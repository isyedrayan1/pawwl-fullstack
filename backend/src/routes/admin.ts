import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";
import { NextFunction, Request, Response, Router } from "express";
import { z } from "zod";
import { createId } from "@paralleldrive/cuid2";
import { asyncHandler } from "../lib/async.js";
import { HttpError } from "../lib/http.js";
import { prisma } from "../lib/prisma.js";
import { uniqueSlug } from "../lib/slug.js";
import { requireAdmin, requireSuperAdmin, requireScope } from "../middleware/auth.js";
import { sendShippingUpdate, sendOrderDelivered, sendOrderCancelled, sendAbandonedCart } from "../lib/mailer.js";
import * as xlsx from "xlsx";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { uploadToR2 } from "../lib/r2.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (_req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const mimeType = allowedTypes.test(file.mimetype);
    const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    if (mimeType && extName) {
      cb(null, true);
    } else {
      cb(new Error("Only images (.jpg, .jpeg, .png, .webp) are allowed"));
    }
  },
});

const router = Router();


const userFilterSchema = z.object({
  q: z.string().optional(),
  status: z.enum(["active", "disabled"]).optional(),
});

const roleSchema = z.object({
  name: z.string().min(2),
  permissions: z.string(),
});

const adminCreateSchema = z.object({
  name: z.string().min(2).optional(),
  username: z.string().min(3),
  email: z.string().email().optional(),
  password: z.string().min(8),
});

const adminPasswordSchema = z.object({
  password: z.string().min(8),
});

const productVariantSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  sku: z.string().optional(),
  price: z.coerce.number().min(0),
  salePrice: z.coerce.number().min(0).optional().nullable(),
  gstPrice: z.coerce.number().min(0).optional().nullable(),
  stock: z.coerce.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
});

const productSchema = z.object({
  catalogId: z.coerce.number().int().positive().optional().nullable(),
  name: z.string().min(2),
  slug: z.string().optional(),
  description: z.string().optional().nullable(),
  category: z.string().default("Uncategorized"),
  animalType: z.string().optional().nullable(),
  productCategoryId: z.string().optional().nullable(),
  animalTypeId: z.string().optional().nullable(),
  brand: z.string().optional().nullable(),
  images: z.array(z.string()).default([]),
  imagePaths: z.array(z.string()).optional(),
  price: z.coerce.number().min(0).default(0),
  stock: z.coerce.number().int().min(0).default(0),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
  benefits: z.array(z.string()).default([]),
  ingredients: z.string().optional().nullable(),
  usage: z.string().optional().nullable(),
  weight: z.coerce.number().min(0).optional().nullable(),
  dimensions: z.string().optional().nullable(),
  variants: z.array(productVariantSchema).min(1).optional(),
});

const statusSchema = z.object({
  paymentStatus: z.enum(["pending", "paid", "failed", "refunded"]).optional(),
  fulfillmentStatus: z
    .enum(["pending", "processing", "out_for_delivery", "delivered", "cancelled"])
    .optional(),
  courierName: z.string().optional().nullable(),
  trackingNumber: z.string().optional().nullable(),
  trackingUrl: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

const logAdminAction = async (
  adminUserId: string,
  action: string,
  entityType: string,
  entityId?: string,
  metadata?: unknown,
) => {
  await prisma.adminauditlog.create({
    data: {
      id: createId(),
      adminUserId,
      action,
      entityType,
      entityId,
      metadata: metadata == null ? null : JSON.stringify(metadata),
    },
  });
};

const parseJsonArray = (value: string | null | undefined) => {
  if (!value) return [] as string[];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [] as string[];
  }
};

const normalizeProduct = (product: any) => {
  const { productvariant, images, benefits, ...rest } = product;
  const parsedImages = parseJsonArray(images).length ? parseJsonArray(images) : parseJsonArray(product.imagePaths);
  return {
    ...rest,
    images: parsedImages,
    imagePaths: parsedImages,
    benefits: parseJsonArray(benefits),
    animalType: product.animaltype?.name ?? null,
    categoryRecord: product.productcategory ?? null,
    variants: productvariant,
  };
};

const normalizeOrder = (order: any) => ({
  ...order,
  items: order.orderitem,
  payments: order.payment,
  orderitem: undefined,
  payment: undefined,
});

const categoryKey = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const resolveProductLookups = async (input: {
  category?: string | null;
  productCategoryId?: string | null;
  animalType?: string | null;
  animalTypeId?: string | null;
}) => {
  const [animalTypeRecord, categoryRecord] = await Promise.all([
    input.animalTypeId
      ? prisma.animaltype.findUnique({ where: { id: input.animalTypeId } })
      : input.animalType
        ? prisma.animaltype.upsert({
            where: { key: categoryKey(input.animalType) },
            update: { name: input.animalType },
            create: { id: createId(), key: categoryKey(input.animalType), name: input.animalType },
          })
        : Promise.resolve(null),
    input.productCategoryId
      ? prisma.productcategory.findUnique({ where: { id: input.productCategoryId } })
      : input.category
        ? prisma.productcategory.upsert({
            where: { key: categoryKey(input.category) },
            update: { name: input.category },
            create: { id: createId(), key: categoryKey(input.category), name: input.category },
          })
        : Promise.resolve(null),
  ]);

  return { animalTypeRecord, categoryRecord };
};

const syncDefaultVariant = async (productId: string, input: { price: number; stock: number; status: string }) => {
  const existing = await prisma.productvariant.findFirst({
    where: { productId },
    orderBy: { createdAt: "asc" },
  });
  const data = {
    name: "Default",
    price: new Prisma.Decimal(input.price),
    gstPrice: new Prisma.Decimal(input.price),
    stock: input.stock,
    isActive: input.status === "published",
  };

  if (existing) {
    return prisma.productvariant.update({ where: { id: existing.id }, data });
  }

  return prisma.productvariant.create({
    data: {
      id: createId(),
      productId,
      ...data,
    },
  });
};

const adminSelect = {
  id: true,
  name: true,
  username: true,
  email: true,
  status: true,
  phone: true,
  role: true,
  adminRoleId: true,
  adminRole: { select: { id: true, name: true, permissions: true } },
  walletBalance: true,
  createdAt: true,
  updatedAt: true,
  _count: { select: { order: true, address: true, session: true } },
} as const;

router.use(requireAdmin);

router.post(
  "/upload",
  upload.array("images", 10),
  asyncHandler(async (req, res) => {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      throw new HttpError(400, "No files uploaded");
    }
    const uploadPromises = files.map((file) =>
      uploadToR2(file.buffer, file.originalname, file.mimetype)
    );
    const fileUrls = await Promise.all(uploadPromises);
    res.json({ urls: fileUrls });
  })
);

// --- Admin Roles Management ---

router.get("/admins", requireSuperAdmin, asyncHandler(async (_req: Request, res: Response) => {
  const admins = await prisma.user.findMany({
    where: { role: { not: "customer" } },
    select: adminSelect,
    orderBy: { createdAt: "desc" },
  });
  res.json({ admins });
}));

const adminUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  username: z.string().min(3).optional(),
  email: z.string().email().optional(),
  status: z.enum(["active", "disabled"]).optional(),
  adminRoleId: z.string().optional().nullable(),
  role: z.enum(["customer", "admin", "fulfillment", "marketing"]).optional(), // "admin" or "customer" or "staff"
});

router.post("/admins", requireSuperAdmin, asyncHandler(async (req: Request, res: Response) => {
  const { name, username, email, password } = adminCreateSchema.parse(req.body);
  const { adminRoleId, role = "admin" } = adminUpdateSchema.parse(req.body);

  const existing = await prisma.user.findFirst({ where: { OR: [{ email: email ?? undefined }, { username }] } });
  if (existing) throw new HttpError(400, "Username or email already taken");

  const passwordHash = await bcrypt.hash(password, 10);
  const admin = await prisma.user.create({
    data: { id: createId(), name: name ?? username, username, email: email ?? `${username}@pawwl.local`, passwordHash, role, adminRoleId } as any,
    select: adminSelect,
  });
  res.status(201).json({ admin });
}));

router.put("/admins/:id", requireSuperAdmin, asyncHandler(async (req: Request, res: Response) => {
  const data = adminUpdateSchema.parse(req.body);
  const admin = await prisma.user.update({
    where: { id: String(req.params.id) },
    data: data as any,
    select: adminSelect,
  });
  res.json({ admin });
}));

router.delete("/admins/:id", requireSuperAdmin, asyncHandler(async (req: Request, res: Response) => {
  if (req.adminUser?.id === req.params.id) throw new HttpError(400, "Cannot delete yourself");
  await prisma.user.delete({ where: { id: String(req.params.id) } });
  res.json({ success: true });
}));

router.get("/roles", requireSuperAdmin, asyncHandler(async (_req: Request, res: Response) => {
  const roles = await prisma.adminrole.findMany({
    include: { _count: { select: { users: true } } },
    orderBy: { createdAt: "desc" },
  });
  res.json({ roles });
}));

router.post("/roles", requireSuperAdmin, asyncHandler(async (req: Request, res: Response) => {
  const { name, permissions } = roleSchema.parse(req.body);
  const role = await prisma.adminrole.create({
    data: { name, permissions },
  });
  res.status(201).json({ role });
}));

router.put("/roles/:id", requireSuperAdmin, asyncHandler(async (req: Request, res: Response) => {
  const { name, permissions } = roleSchema.parse(req.body);
  const role = await prisma.adminrole.update({
    where: { id: String(req.params.id) },
    data: { name, permissions },
  });
  res.json({ role });
}));

router.delete("/roles/:id", requireSuperAdmin, asyncHandler(async (req: Request, res: Response) => {
  const role = await prisma.adminrole.findUnique({
    where: { id: String(req.params.id) },
    include: { _count: { select: { users: true } } },
  });
  if (!role) throw new HttpError(404, "Role not found");
  if ((role as any)._count.users > 0) throw new HttpError(400, "Cannot delete role assigned to users");

  await prisma.adminrole.delete({ where: { id: String(req.params.id) } });
  res.json({ success: true });
}));

// --- End Admin Roles Management ---

router.get(
  "/summary",
  requireSuperAdmin,
  asyncHandler(async (_req, res) => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const [
      usersTotal,
      activeUsers,
      disabledUsers,
      productsTotal,
      publishedProducts,
      draftProducts,
      archivedProducts,
      lowStockVariants,
      recentOrders,
      recentUsers,
      recentLogs,
      revenueAggregate,
      pendingOrders,
      processingOrders,
      deliveredOrders,
      orders7d,
    ] = await Promise.all([
      prisma.user.count({ where: { role: "customer" } }),
      prisma.user.count({ where: { status: "active", role: "customer" } }),
      prisma.user.count({ where: { status: "disabled", role: "customer" } }),
      prisma.product.count(),
      prisma.product.count({ where: { status: "published" } }),
      prisma.product.count({ where: { status: "draft" } }),
      prisma.product.count({ where: { status: "archived" } }),
      prisma.productvariant.findMany({
        where: { stock: { lte: 10 } },
        include: { product: { select: { id: true, name: true, slug: true, status: true } } },
        orderBy: [{ stock: "asc" }, { updatedAt: "desc" }],
        take: 8,
      }),
      prisma.order.findMany({
        include: {
          user: { select: { id: true, name: true, email: true } },
          orderitem: true,
          payment: true,
        },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      prisma.user.findMany({
        where: { role: "customer" },
        include: { _count: { select: { order: true, address: true, session: true } } },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      prisma.adminauditlog.findMany({
        include: { user: { select: { id: true, name: true, email: true } } },
        orderBy: { createdAt: "desc" },
        take: 8,
      }),
      prisma.order.aggregate({ where: { paymentStatus: "paid" }, _sum: { total: true } }),
      prisma.order.count({ where: { fulfillmentStatus: "pending" } }),
      prisma.order.count({ where: { fulfillmentStatus: "processing" } }),
      prisma.order.count({ where: { fulfillmentStatus: "delivered" } }),
      prisma.order.findMany({
        where: { paymentStatus: "paid", createdAt: { gte: sevenDaysAgo } },
        select: { total: true, createdAt: true }
      }),
    ]);

    const revenueByDay: Record<string, number> = {};
    for (let i = 0; i < 7; i++) {
      const d = new Date(sevenDaysAgo);
      d.setDate(d.getDate() + i);
      revenueByDay[d.toISOString().split("T")[0]] = 0;
    }

    for (const o of orders7d) {
      const dateStr = o.createdAt.toISOString().split("T")[0];
      if (revenueByDay[dateStr] !== undefined) {
        revenueByDay[dateStr] += Number(o.total);
      }
    }

    const revenueTrend = Object.keys(revenueByDay).sort().map(date => ({
      date,
      revenue: revenueByDay[date]
    }));

    res.json({
      summary: {
        usersTotal,
        activeUsers,
        disabledUsers,
        productsTotal,
        publishedProducts,
        draftProducts,
        archivedProducts,
        lowStockVariants: lowStockVariants.length,
        pendingOrders,
        processingOrders,
        deliveredOrders,
        revenueTotal: revenueAggregate._sum.total ?? 0,
      },
      recentOrders: recentOrders.map(normalizeOrder),
      recentUsers: recentUsers.map((user) => ({
        ...user,
        orderCount: user._count.order,
        addressCount: user._count.address,
        sessionCount: user._count.session,
      })),
      lowStockVariants: lowStockVariants.map((variant) => ({
        ...variant,
        product: variant.product,
      })),
      recentAuditLogs: recentLogs,
      revenueTrend,
    });
  }),
);

router.post(
  "/marketing/abandoned-carts/send",
  requireSuperAdmin,
  asyncHandler(async (req, res) => {
    const usersWithCarts = await prisma.user.findMany({
      where: {
        cartitem: { some: {} }
      },
      select: { email: true, name: true }
    });

    let sent = 0;
    for (const user of usersWithCarts) {
      try {
        await sendAbandonedCart(user.email, user.name);
        sent++;
      } catch (err) {
        console.error("Failed to send abandoned cart email to", user.email, err);
      }
    }

    res.json({ sent });
  }),
);

router.get(
  "/products",
  asyncHandler(async (_req, res) => {
    const products = await prisma.product.findMany({
      include: { productvariant: true, animaltype: true, productcategory: true },
      orderBy: { createdAt: "desc" },
    });
    // Normalize field names for frontend compatibility
    const normalized = products.map(normalizeProduct);
    res.json({ products: normalized });
  }),
);

router.post(
  "/products",
  asyncHandler(async (req, res) => {
    const input = productSchema.parse(req.body);
    const { animalTypeRecord, categoryRecord } = await resolveProductLookups(input);
    const images = input.imagePaths ?? input.images;
    const variantInput = input.variants?.[0];
    const price = variantInput?.price ?? input.price;
    const stock = variantInput?.stock ?? input.stock;
    const product = await prisma.product.create({
      data: {
        id: createId(),
        catalogId: input.catalogId ?? null,
        name: input.name,
        slug: input.slug ?? uniqueSlug(input.name, Date.now()),
        description: input.description,
        category: categoryRecord?.name ?? input.category,
        brand: input.brand,
        images: JSON.stringify(images),
        imagePaths: JSON.stringify(images),
        price: new Prisma.Decimal(price),
        stock,
        status: input.status,
        seoTitle: input.seoTitle,
        seoDescription: input.seoDescription,
        benefits: JSON.stringify(input.benefits),
        ingredients: input.ingredients,
        usage: input.usage,
        weight: input.weight != null ? new Prisma.Decimal(input.weight) : null,
        dimensions: input.dimensions,
        animalTypeId: animalTypeRecord?.id ?? null,
        productCategoryId: categoryRecord?.id ?? null,
        productvariant: {
          create: {
            id: createId(),
            name: variantInput?.name ?? "Default",
            sku: variantInput?.sku,
            price: new Prisma.Decimal(price),
            salePrice: variantInput?.salePrice == null ? null : new Prisma.Decimal(variantInput.salePrice),
            gstPrice: new Prisma.Decimal(variantInput?.gstPrice ?? price),
            stock,
            isActive: input.status === "published" && (variantInput?.isActive ?? true),
          },
        },
      },
      include: { productvariant: true, animaltype: true, productcategory: true },
    });

    await logAdminAction(req.user!.id, "create", "product", product.id, { name: product.name });
    res.status(201).json({ product: normalizeProduct(product) });
  }),
);

router.patch(
  "/products/:id",
  asyncHandler(async (req, res) => {
    const input = productSchema.partial().parse(req.body);
    const productId = String(req.params.id);
    const existing = await prisma.product.findUnique({ where: { id: productId } });
    if (!existing) throw new HttpError(404, "Product not found");
    const { animalTypeRecord, categoryRecord } = await resolveProductLookups(input);
    const images = input.imagePaths ?? input.images;
    const variantInput = input.variants?.[0];
    const price = variantInput?.price ?? input.price;
    const stock = variantInput?.stock ?? input.stock;

    const product = await prisma.product.update({
      where: { id: productId },
      data: {
        ...(input.catalogId !== undefined ? { catalogId: input.catalogId } : {}),
        ...(input.name !== undefined ? { name: input.name } : {}),
        ...(input.slug !== undefined ? { slug: input.slug } : {}),
        ...(input.description !== undefined ? { description: input.description } : {}),
        ...(input.category !== undefined ? { category: categoryRecord?.name ?? input.category } : {}),
        ...(input.brand !== undefined ? { brand: input.brand } : {}),
        ...(images !== undefined ? { images: JSON.stringify(images), imagePaths: JSON.stringify(images) } : {}),
        ...(price !== undefined ? { price: new Prisma.Decimal(price) } : {}),
        ...(stock !== undefined ? { stock } : {}),
        ...(input.status !== undefined ? { status: input.status } : {}),
        ...(input.seoTitle !== undefined ? { seoTitle: input.seoTitle } : {}),
        ...(input.seoDescription !== undefined ? { seoDescription: input.seoDescription } : {}),
        ...(input.benefits !== undefined ? { benefits: JSON.stringify(input.benefits) } : {}),
        ...(input.ingredients !== undefined ? { ingredients: input.ingredients } : {}),
        ...(input.usage !== undefined ? { usage: input.usage } : {}),
        ...(input.weight !== undefined ? { weight: input.weight != null ? new Prisma.Decimal(input.weight) : null } : {}),
        ...(input.dimensions !== undefined ? { dimensions: input.dimensions } : {}),
        ...(input.animalType !== undefined || input.animalTypeId !== undefined ? { animalTypeId: animalTypeRecord?.id ?? null } : {}),
        ...(input.category !== undefined || input.productCategoryId !== undefined ? { productCategoryId: categoryRecord?.id ?? null } : {}),
      },
      include: { productvariant: true, animaltype: true, productcategory: true },
    });

    if (price !== undefined || stock !== undefined || input.status !== undefined || input.variants) {
      await syncDefaultVariant(product.id, {
        price: price ?? Number(product.price ?? 0),
        stock: stock ?? product.stock,
        status: input.status ?? product.status,
      });
    }

    const updated = await prisma.product.findUnique({
      where: { id: product.id },
      include: { productvariant: true, animaltype: true, productcategory: true },
    });

    // Normalize field names for frontend compatibility
    const normalized = updated ? normalizeProduct(updated) : null;

    await logAdminAction(req.user!.id, "update", "product", product.id, { name: product.name });
    res.json({ product: normalized });
  }),
);

router.get(
  "/users",
  requireSuperAdmin,
  asyncHandler(async (req, res) => {
    const query = userFilterSchema.parse(req.query);
    const users = await prisma.user.findMany({
      where: {
        role: "customer",
        ...(query.status ? { status: query.status } : {}),
        ...(query.q
          ? {
              OR: [
                { name: { contains: query.q } },
                { email: { contains: query.q } },
                { phone: { contains: query.q } },
              ],
            }
          : {}),
      },
      include: { _count: { select: { order: true, address: true, session: true } } },
      orderBy: { createdAt: "desc" },
    });

    res.json({
      users: users.map((user) => ({
        ...user,
        orderCount: user._count.order,
        addressCount: user._count.address,
        sessionCount: user._count.session,
      })),
    });
  }),
);

router.patch(
  "/users/:id/status",
  requireSuperAdmin,
  asyncHandler(async (req, res) => {
    const userId = String(req.params.id);
    const { status } = z.object({ status: z.enum(["active", "disabled"]) }).parse(req.body);

    const user = await prisma.user.update({
      where: { id: userId },
      data: { status },
      include: { _count: { select: { order: true, address: true, session: true } } },
    });

    res.json({
      user: {
        ...user,
        orderCount: user._count.order,
        addressCount: user._count.address,
        sessionCount: user._count.session,
      },
    });
  }),
);

router.delete(
  "/users/:id",
  requireSuperAdmin,
  asyncHandler(async (req, res) => {
    const userId = String(req.params.id);
    try {
      await prisma.user.delete({ where: { id: userId } });
      res.json({ success: true });
    } catch (e) {
      throw new HttpError(400, "Cannot delete user. They have associated orders or data. Please use the 'disable' action instead.");
    }
  }),
);

router.get(
  "/admins",
  asyncHandler(async (_req, res) => {
    const admins = await prisma.user.findMany({
      where: { role: "admin" },
      select: adminSelect,
      orderBy: { createdAt: "desc" },
    });

    res.json({
      admins: admins.map((admin) => ({
        ...admin,
        orderCount: admin._count.order,
        addressCount: admin._count.address,
        sessionCount: admin._count.session,
      })),
    });
  }),
);

router.post(
  "/admins",
  asyncHandler(async (req, res) => {
    const input = adminCreateSchema.parse(req.body);
    const username = input.username.trim().toLowerCase();
    const email = (input.email?.trim().toLowerCase() ?? `${username}@admin.local`);

    const existingUsername = await prisma.user.findFirst({ where: { username } });
    if (existingUsername) throw new HttpError(409, "Username already exists");

    const existingEmail = await prisma.user.findUnique({ where: { email } });
    if (existingEmail) throw new HttpError(409, "Email already exists");

    const admin = await prisma.user.create({
      data: {
        id: createId(),
        name: input.name?.trim() || username,
        username,
        email,
        passwordHash: await bcrypt.hash(input.password, 12),
        role: "admin",
        status: "active",
      },
      select: adminSelect,
    });

    await logAdminAction(req.user!.id, "create", "admin", admin.id, { username: admin.username, email: admin.email });
    res.status(201).json({
      admin: {
        ...admin,
        orderCount: admin._count.order,
        addressCount: admin._count.address,
        sessionCount: admin._count.session,
      },
    });
  }),
);

router.patch(
  "/admins/:id/password",
  asyncHandler(async (req, res) => {
    const input = adminPasswordSchema.parse(req.body);
    const adminId = String(req.params.id);

    const admin = await prisma.user.findUnique({ where: { id: adminId } });
    if (!admin || admin.role !== "admin") throw new HttpError(404, "Admin not found");

    const passwordHash = await bcrypt.hash(input.password, 12);

    await prisma.user.update({ where: { id: adminId }, data: { passwordHash } });
    await logAdminAction(req.user!.id, "password_update", "admin", adminId, { username: admin.username, email: admin.email });

    res.json({ ok: true });
  }),
);

router.patch(
  "/users/:id/status",
  asyncHandler(async (req, res) => {
    const input = z.object({ status: z.enum(["active", "disabled"]) }).parse(req.body);
    const userId = String(req.params.id);

    if (req.user!.id === userId) {
      throw new HttpError(400, "You cannot change your own account status");
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new HttpError(404, "User not found");

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { status: input.status },
      include: { _count: { select: { order: true, address: true, session: true } } },
    });

    await logAdminAction(req.user!.id, "status_update", "user", userId, { status: input.status });
    res.json({
      user: {
        ...updated,
        orderCount: updated._count.order,
        addressCount: updated._count.address,
        sessionCount: updated._count.session,
      },
    });
  }),
);

router.get(
  "/orders",
  asyncHandler(async (_req, res) => {
    const orders = await prisma.order.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
        orderitem: true,
        payment: true,
      },
      orderBy: { createdAt: "desc" },
    });
    // Normalize field names for frontend compatibility
    const normalized = orders.map((o) => ({
      ...o,
      items: o.orderitem,
      payments: o.payment,
      orderitem: undefined,
      payment: undefined,
    }));
    res.json({ orders: normalized });
  }),
);

router.patch(
  "/orders/:id/status",
  asyncHandler(async (req, res) => {
    const input = statusSchema.parse(req.body);
    const orderId = String(req.params.id);

    const oldOrder = await prisma.order.findUnique({
      where: { id: orderId },
      include: { user: true },
    });

    if (!oldOrder) throw new HttpError(404, "Order not found");

    const order = await prisma.order.update({
      where: { id: orderId },
      data: input,
      include: { orderitem: true, payment: true, user: true },
    });

    if (input.fulfillmentStatus && input.fulfillmentStatus !== oldOrder.fulfillmentStatus) {
      const email = order.user.email;
      const orderNum = order.orderNumber;
      
      if (input.fulfillmentStatus === "out_for_delivery") {
        sendShippingUpdate(email, orderNum, order.trackingUrl).catch((err) => {
          console.error("[mailer] Failed to send shipping update:", err);
        });
      } else if (input.fulfillmentStatus === "delivered") {
        sendOrderDelivered(email, orderNum).catch((err) => {
          console.error("[mailer] Failed to send order delivered email:", err);
        });
      } else if (input.fulfillmentStatus === "cancelled") {
        // Attempt refund if the order was paid
        import("../services/refundService.js").then(({ processRefundForOrder }) => {
          processRefundForOrder(order.id).catch((err) => {
            console.error("[Refund] Automatic refund failed on cancel:", err);
          });
        });

        sendOrderCancelled(email, orderNum).catch((err) => {
          console.error("[mailer] Failed to send order cancelled email:", err);
        });
      }
    }

    // Normalize field names for frontend compatibility
    const normalized = {
      ...order,
      items: order.orderitem,
      payments: order.payment,
      orderitem: undefined,
      payment: undefined,
    };

    await logAdminAction(req.user!.id, "status_update", "order", order.id, input);
    res.json({ order: normalized });
  }),
);

router.get(
  "/audit-logs",
  asyncHandler(async (_req, res) => {
    const logs = await prisma.adminauditlog.findMany({
      include: { user: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    res.json({ logs });
  }),
);

// DELETE Product
router.delete(
  "/products/:id",
  asyncHandler(async (req, res) => {
    const productId = String(req.params.id);
    const existing = await prisma.product.findUnique({ where: { id: productId } });
    if (!existing) throw new HttpError(404, "Product not found");

    try {
      await prisma.product.delete({
        where: { id: productId },
      });
      await logAdminAction(req.user!.id, "delete", "product", productId, { name: existing.name });
      res.json({ success: true });
    } catch (error: any) {
      if (error.code === "P2003" || (error.message && error.message.includes("foreign key constraint"))) {
        throw new HttpError(
          400,
          "Cannot delete this product because it has order history. Please change its status to 'Archived' instead."
        );
      }
      throw error;
    }
  }),
);

// Coupons CRUD
const couponSchema = z.object({
  code: z.string().min(1),
  discount: z.number().positive(),
  type: z.enum(["percentage", "fixed"]),
  minCartAmt: z.number().nonnegative().optional().nullable(),
  maxDiscount: z.number().nonnegative().optional().nullable(),
  usageLimit: z.number().int().positive().optional().nullable(),
  expiresAt: z.string(),
  isActive: z.boolean().default(true),
});

router.get(
  "/coupons",
  asyncHandler(async (_req, res) => {
    const coupons = await prisma.coupon.findMany({
      include: {
        order: {
          select: {
            id: true,
            orderNumber: true,
            total: true,
            createdAt: true,
            user: { select: { id: true, name: true, email: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json({ coupons });
  }),
);

router.post(
  "/coupons",
  asyncHandler(async (req, res) => {
    const input = couponSchema.parse(req.body);
    const existing = await prisma.coupon.findUnique({
      where: { code: input.code.toUpperCase() },
    });
    if (existing) throw new HttpError(400, "A coupon with this code already exists");

    const coupon = await prisma.coupon.create({
      data: {
        id: createId(),
        code: input.code.toUpperCase(),
        discount: new Prisma.Decimal(input.discount),
        type: input.type,
        minCartAmt: input.minCartAmt != null ? new Prisma.Decimal(input.minCartAmt) : null,
        maxDiscount: input.maxDiscount != null ? new Prisma.Decimal(input.maxDiscount) : null,
        usageLimit: input.usageLimit,
        expiresAt: new Date(input.expiresAt),
        isActive: input.isActive,
      },
    });

    await logAdminAction(req.user!.id, "create", "coupon", coupon.id, { code: coupon.code });
    res.status(201).json({ coupon });
  }),
);

router.put(
  "/coupons/:id",
  asyncHandler(async (req, res) => {
    const input = couponSchema.partial().parse(req.body);
    const couponId = String(req.params.id);
    const existing = await prisma.coupon.findUnique({ where: { id: couponId } });
    if (!existing) throw new HttpError(404, "Coupon not found");

    if (input.code) {
      const codeDuplicate = await prisma.coupon.findFirst({
        where: {
          code: input.code.toUpperCase(),
          NOT: { id: couponId },
        },
      });
      if (codeDuplicate) throw new HttpError(400, "A coupon with this code already exists");
    }

    const coupon = await prisma.coupon.update({
      where: { id: couponId },
      data: {
        ...(input.code !== undefined ? { code: input.code.toUpperCase() } : {}),
        ...(input.discount !== undefined ? { discount: new Prisma.Decimal(input.discount) } : {}),
        ...(input.type !== undefined ? { type: input.type } : {}),
        ...(input.minCartAmt !== undefined ? { minCartAmt: input.minCartAmt != null ? new Prisma.Decimal(input.minCartAmt) : null } : {}),
        ...(input.maxDiscount !== undefined ? { maxDiscount: input.maxDiscount != null ? new Prisma.Decimal(input.maxDiscount) : null } : {}),
        ...(input.usageLimit !== undefined ? { usageLimit: input.usageLimit } : {}),
        ...(input.expiresAt !== undefined ? { expiresAt: new Date(input.expiresAt) } : {}),
        ...(input.isActive !== undefined ? { isActive: input.isActive } : {}),
      },
    });

    await logAdminAction(req.user!.id, "update", "coupon", coupon.id, { code: coupon.code });
    res.json({ coupon });
  }),
);

router.delete(
  "/coupons/:id",
  asyncHandler(async (req, res) => {
    const couponId = String(req.params.id);
    const existing = await prisma.coupon.findUnique({ where: { id: couponId } });
    if (!existing) throw new HttpError(404, "Coupon not found");

    await prisma.coupon.delete({ where: { id: couponId } });
    await logAdminAction(req.user!.id, "delete", "coupon", couponId, { code: existing.code });
    res.json({ success: true });
  }),
);

// Return Requests
router.get(
  "/returns",
  asyncHandler(async (_req, res) => {
    const returns = await prisma.returnrequest.findMany({
      include: {
        order: {
          include: {
            user: { select: { id: true, name: true, email: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json({ returns });
  }),
);

router.patch(
  "/returns/:id/status",
  asyncHandler(async (req, res) => {
    const returnId = String(req.params.id);
    const statusVal = z.enum(["pending", "approved", "rejected", "completed"]).parse(req.body.status);

    const existing = await prisma.returnrequest.findUnique({
      where: { id: returnId },
      include: { order: true },
    });
    if (!existing) throw new HttpError(404, "Return request not found");

    const updated = await prisma.returnrequest.update({
      where: { id: returnId },
      data: { status: statusVal },
    });

    if (statusVal === "completed") {
      await prisma.order.update({
        where: { id: existing.orderId },
        data: {
          paymentStatus: "refunded",
          fulfillmentStatus: "cancelled",
        },
      });
      await prisma.payment.updateMany({
        where: { orderId: existing.orderId },
        data: { status: "refunded" },
      });
    }

    await logAdminAction(req.user!.id, "update_return_status", "returnrequest", returnId, { status: statusVal });
    res.json({ returnRequest: updated });
  }),
);

// Reviews Moderation
router.get(
  "/reviews",
  asyncHandler(async (_req, res) => {
    const reviews = await prisma.review.findMany({
      include: {
        product: { select: { id: true, name: true, images: true } },
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json({ reviews });
  }),
);

router.delete(
  "/reviews/:id",
  asyncHandler(async (req, res) => {
    const reviewId = String(req.params.id);
    const existing = await prisma.review.findUnique({
      where: { id: reviewId },
    });
    if (!existing) throw new HttpError(404, "Review not found");

    await prisma.review.delete({ where: { id: reviewId } });
    
    const stats = await prisma.review.aggregate({
      where: { productId: existing.productId },
      _avg: { rating: true },
      _count: { id: true },
    });

    await prisma.product.update({
      where: { id: existing.productId },
      data: {
        rating: stats._avg.rating ? stats._avg.rating.toFixed(1) : null,
        reviewCount: stats._count.id,
      },
    });

    await logAdminAction(req.user!.id, "delete_review", "review", reviewId, { productId: existing.productId });
    res.json({ success: true });
  }),
);

// EXCEL EXPORT ROUTES
const sendExcel = (res: Response, data: any[], filename: string) => {
  const wb = xlsx.utils.book_new();
  const ws = xlsx.utils.json_to_sheet(data);
  xlsx.utils.book_append_sheet(wb, ws, "Sheet1");
  const buffer = xlsx.write(wb, { type: "buffer", bookType: "xlsx" });
  res.header("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  res.attachment(`${filename}.xlsx`);
  return res.send(buffer);
};

router.get("/export/orders", requireSuperAdmin, asyncHandler(async (req, res) => {
  const orders = await prisma.order.findMany({ include: { user: true } });
  const data = orders.map(o => ({
    OrderNumber: o.orderNumber,
    CustomerName: o.user.name,
    CustomerEmail: o.user.email,
    Subtotal: Number(o.subtotal),
    Discount: Number(o.discount),
    Total: Number(o.total),
    PaymentStatus: o.paymentStatus,
    FulfillmentStatus: o.fulfillmentStatus,
    Courier: o.courierName || "",
    Tracking: o.trackingNumber || "",
    Date: o.createdAt.toISOString()
  }));
  return sendExcel(res, data, "orders");
}));

router.get("/export/products", requireSuperAdmin, asyncHandler(async (req, res) => {
  const products = await prisma.product.findMany({ include: { productvariant: true } });
  const data = products.map(p => ({
    CatalogId: p.catalogId || "",
    Name: p.name,
    Category: p.category,
    Status: p.status,
    Price: Number(p.price),
    CostPrice: Number(p.costPrice || 0),
    Stock: p.stock,
    Variants: p.productvariant.length
  }));
  return sendExcel(res, data, "products");
}));

router.get("/export/users", requireSuperAdmin, asyncHandler(async (req, res) => {
  const users = await prisma.user.findMany();
  const data = users.map(u => ({
    Name: u.name,
    Email: u.email,
    Phone: u.phone || "",
    Role: u.role,
    Status: u.status,
    Wallet: Number(u.walletBalance),
    Joined: u.createdAt.toISOString()
  }));
  return sendExcel(res, data, "users");
}));

router.post("/import/products", requireSuperAdmin, upload.single("file"), asyncHandler(async (req, res) => {
  if (!req.file) throw new HttpError(400, "No file uploaded");
  const wb = xlsx.read(req.file.buffer, { type: "buffer" });
  const sheet = wb.Sheets[wb.SheetNames[0]];
  const data = xlsx.utils.sheet_to_json(sheet) as any[];

  let updated = 0;
  for (const row of data) {
    const name = row.Name;
    if (!name) continue;
    
    const product = await prisma.product.findFirst({ where: { name } });
    if (product) {
      await prisma.product.update({
        where: { id: product.id },
        data: {
          price: row.Price !== undefined ? Number(row.Price) : undefined,
          stock: row.Stock !== undefined ? Number(row.Stock) : undefined,
        }
      });
      
      await prisma.productvariant.updateMany({
        where: { productId: product.id, name: "Default" },
        data: {
          price: row.Price !== undefined ? Number(row.Price) : undefined,
          stock: row.Stock !== undefined ? Number(row.Stock) : undefined,
        }
      });
      updated++;
    }
  }
  res.json({ success: true, updated });
}));

// ANALYTICS ROUTE
router.get("/analytics", requireSuperAdmin, asyncHandler(async (req, res) => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const orders = await prisma.order.findMany({
    where: { createdAt: { gte: thirtyDaysAgo }, paymentStatus: "paid" },
    select: { total: true, createdAt: true, userId: true }
  });

  const dailyRevenue: Record<string, number> = {};
  let totalRevenue = 0;
  orders.forEach(o => {
    const day = o.createdAt.toISOString().split('T')[0];
    dailyRevenue[day] = (dailyRevenue[day] || 0) + Number(o.total);
    totalRevenue += Number(o.total);
  });

  const revenueData = Object.keys(dailyRevenue).sort().map(date => ({
    date,
    revenue: dailyRevenue[date]
  }));

  const aov = orders.length ? totalRevenue / orders.length : 0;

  const userOrderCounts: Record<string, number> = {};
  orders.forEach(o => {
    userOrderCounts[o.userId] = (userOrderCounts[o.userId] || 0) + 1;
  });
  const totalUsers = Object.keys(userOrderCounts).length;
  const repeatUsers = Object.values(userOrderCounts).filter(c => c > 1).length;
  const retentionRate = totalUsers ? (repeatUsers / totalUsers) * 100 : 0;

  const orderItems = await prisma.orderitem.findMany({
    where: { order: { createdAt: { gte: thirtyDaysAgo }, paymentStatus: "paid" } }
  });
  const productSales: Record<string, {name: string, sales: number}> = {};
  orderItems.forEach(i => {
    if (!i.productId) return;
    if (!productSales[i.productId]) {
      productSales[i.productId] = { name: i.productName, sales: 0 };
    }
    productSales[i.productId].sales += i.quantity;
  });
  const topProducts = Object.values(productSales).sort((a, b) => b.sales - a.sales).slice(0, 5);

  res.json({
    revenueData,
    aov,
    retentionRate,
    topProducts,
    totalRevenue,
    ordersCount: orders.length
  });
}));

// POS Order Creation
router.post(
  "/pos-order",
  asyncHandler(async (req, res) => {
    const { items, discount, paymentStatus, customerEmail, customerName, customerPhone } = req.body;
    
    if (!items || items.length === 0) throw new HttpError(400, "Cart is empty");
    
    // 1. Resolve or create customer
    let user;
    if (customerEmail) {
      user = await prisma.user.findUnique({ where: { email: customerEmail } });
      if (!user) {
        user = await prisma.user.create({
          data: {
            id: createId(),
            name: customerName || "Walk-in Customer",
            email: customerEmail,
            phone: customerPhone || null,
            passwordHash: await bcrypt.hash(createId(), 10), // random password
            role: "customer"
          }
        });
      }
    } else {
      user = await prisma.user.findFirst({ where: { email: "guest@pawwl.local" } });
      if (!user) {
        user = await prisma.user.create({
          data: {
            id: createId(),
            name: "Guest Walk-in",
            email: "guest@pawwl.local",
            passwordHash: await bcrypt.hash(createId(), 10),
            role: "customer"
          }
        });
      }
    }

    // 2. Calculate totals
    let subtotal = 0;
    const orderItems = [];
    
    for (const item of items) {
      const product = await prisma.product.findUnique({ where: { id: item.productId } });
      const variant = item.variantId ? await prisma.productvariant.findUnique({ where: { id: item.variantId } }) : null;
      
      if (!product) throw new HttpError(404, `Product not found: ${item.productId}`);
      
      const price = variant ? Number(variant.price) : Number(product.price);
      subtotal += price * item.quantity;
      
      orderItems.push({
        id: createId(),
        productId: product.id,
        variantId: variant?.id,
        productName: product.name,
        variantName: variant?.name || "Default",
        sku: variant?.sku || null,
        quantity: item.quantity,
        unitPrice: new Prisma.Decimal(price),
        lineTotal: new Prisma.Decimal(price * item.quantity),
      });

      // Deduct stock
      if (variant) {
        await prisma.productvariant.update({
          where: { id: variant.id },
          data: { stock: { decrement: item.quantity } }
        });
      } else {
        await prisma.product.update({
          where: { id: product.id },
          data: { stock: { decrement: item.quantity } }
        });
      }
    }

    const appliedDiscount = Number(discount) || 0;
    const total = Math.max(0, subtotal - appliedDiscount);

    // 3. Create Order
    const orderId = createId();
    const orderNumber = `POS${Math.floor(Date.now() / 1000).toString().slice(-6)}`;

    const order = await prisma.order.create({
      data: {
        id: orderId,
        orderNumber,
        userId: user.id,
        addressSnapshot: JSON.stringify({ fullName: "POS Walk-in", line1: "Store Pickup" }),
        subtotal: new Prisma.Decimal(subtotal),
        discount: new Prisma.Decimal(appliedDiscount),
        total: new Prisma.Decimal(total),
        paymentStatus: paymentStatus || "paid",
        fulfillmentStatus: "delivered", // POS orders are usually handed over immediately
        notes: "POS Order manually created by admin",
        orderitem: {
          createMany: {
            data: orderItems
          }
        },
        payment: {
          create: {
            id: createId(),
            amount: new Prisma.Decimal(total),
            status: paymentStatus || "paid",
            provider: "pos_manual"
          }
        }
      }
    });

    await logAdminAction(req.user!.id, "create_pos_order", "order", orderId, { total });
    res.json({ success: true, orderId: order.id });
  })
);

router.get(
  "/leads/services",
  requireScope("manage_orders"),
  asyncHandler(async (req, res) => {
    const leads = await prisma.servicelead.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json({ leads });
  })
);

router.get(
  "/leads/careers",
  requireScope("manage_users"),
  asyncHandler(async (req, res) => {
    const applications = await prisma.jobapplication.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json({ applications });
  })
);

export default router;
