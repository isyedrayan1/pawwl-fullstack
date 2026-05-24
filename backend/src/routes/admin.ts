import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";
import { Router } from "express";
import { z } from "zod";
import { createId } from "@paralleldrive/cuid2";
import { asyncHandler } from "../lib/async.js";
import { HttpError } from "../lib/http.js";
import { prisma } from "../lib/prisma.js";
import { uniqueSlug } from "../lib/slug.js";
import { requireAdmin } from "../middleware/auth.js";

const router = Router();

const userFilterSchema = z.object({
  q: z.string().optional(),
  status: z.enum(["active", "disabled"]).optional(),
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
  name: z.string().min(2),
  slug: z.string().optional(),
  description: z.string().optional().nullable(),
  category: z.string().default("Uncategorized"),
  brand: z.string().optional().nullable(),
  images: z.array(z.string()).default([]),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
  variants: z.array(productVariantSchema).min(1).optional(),
});

const statusSchema = z.object({
  paymentStatus: z.enum(["pending", "paid", "failed", "refunded"]).optional(),
  fulfillmentStatus: z
    .enum(["pending", "processing", "out_for_delivery", "delivered", "cancelled"])
    .optional(),
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

const normalizeProduct = (product: Awaited<ReturnType<typeof prisma.product.findMany>>[number]) => ({
  ...product,
  variants: product.productvariant,
  productvariant: undefined,
});

const normalizeOrder = (order: Awaited<ReturnType<typeof prisma.order.findMany>>[number]) => ({
  ...order,
  items: order.orderitem,
  payments: order.payment,
  orderitem: undefined,
  payment: undefined,
});

const adminSelect = {
  id: true,
  name: true,
  username: true,
  email: true,
  status: true,
  phone: true,
  role: true,
  walletBalance: true,
  createdAt: true,
  updatedAt: true,
  _count: { select: { order: true, address: true, session: true } },
} as const;

router.use(requireAdmin);

router.get(
  "/summary",
  asyncHandler(async (_req, res) => {
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
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { status: "active" } }),
      prisma.user.count({ where: { status: "disabled" } }),
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
    ]);

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
    });
  }),
);

router.get(
  "/products",
  asyncHandler(async (_req, res) => {
    const products = await prisma.product.findMany({
      include: { productvariant: true },
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
    const product = await prisma.product.create({
      data: {
        id: createId(),
        name: input.name,
        slug: input.slug ?? uniqueSlug(input.name, Date.now()),
        description: input.description,
        category: input.category,
        brand: input.brand,
        images: input.images,
        status: input.status,
        seoTitle: input.seoTitle,
        seoDescription: input.seoDescription,
        productvariant: {
          create:
            input.variants?.map((variant) => ({
              id: createId(),
              name: variant.name,
              sku: variant.sku,
              price: new Prisma.Decimal(variant.price),
              salePrice: variant.salePrice == null ? null : new Prisma.Decimal(variant.salePrice),
              gstPrice: variant.gstPrice == null ? null : new Prisma.Decimal(variant.gstPrice),
              stock: variant.stock,
              isActive: variant.isActive,
            })) ?? [],
        },
      },
      include: { productvariant: true },
    });

    await logAdminAction(req.user!.id, "create", "product", product.id, { name: product.name });
    res.status(201).json({ product });
  }),
);

router.patch(
  "/products/:id",
  asyncHandler(async (req, res) => {
    const input = productSchema.partial().parse(req.body);
    const productId = String(req.params.id);
    const existing = await prisma.product.findUnique({ where: { id: productId } });
    if (!existing) throw new HttpError(404, "Product not found");

    const product = await prisma.product.update({
      where: { id: productId },
      data: {
        ...(input.name !== undefined ? { name: input.name } : {}),
        ...(input.slug !== undefined ? { slug: input.slug } : {}),
        ...(input.description !== undefined ? { description: input.description } : {}),
        ...(input.category !== undefined ? { category: input.category } : {}),
        ...(input.brand !== undefined ? { brand: input.brand } : {}),
        ...(input.images !== undefined ? { images: input.images } : {}),
        ...(input.status !== undefined ? { status: input.status } : {}),
        ...(input.seoTitle !== undefined ? { seoTitle: input.seoTitle } : {}),
        ...(input.seoDescription !== undefined ? { seoDescription: input.seoDescription } : {}),
      },
      include: { productvariant: true },
    });

    if (input.variants) {
      for (const variant of input.variants) {
        if (variant.id) {
          await prisma.productvariant.update({
            where: { id: variant.id },
            data: {
              name: variant.name,
              sku: variant.sku,
              price: new Prisma.Decimal(variant.price),
              salePrice: variant.salePrice == null ? null : new Prisma.Decimal(variant.salePrice),
              gstPrice: variant.gstPrice == null ? null : new Prisma.Decimal(variant.gstPrice),
              stock: variant.stock,
              isActive: variant.isActive,
            },
          });
        } else {
          await prisma.productvariant.create({
            data: {
              id: createId(),
              productId: product.id,
              name: variant.name,
              sku: variant.sku,
              price: new Prisma.Decimal(variant.price),
              salePrice: variant.salePrice == null ? null : new Prisma.Decimal(variant.salePrice),
              gstPrice: variant.gstPrice == null ? null : new Prisma.Decimal(variant.gstPrice),
              stock: variant.stock,
              isActive: variant.isActive,
            },
          });
        }
      }
    }

    const updated = await prisma.product.findUnique({
      where: { id: product.id },
      include: { productvariant: true },
    });

    // Normalize field names for frontend compatibility
    const normalized = updated ? normalizeProduct(updated) : null;

    await logAdminAction(req.user!.id, "update", "product", product.id, { name: product.name });
    res.json({ product: normalized });
  }),
);

router.get(
  "/users",
  asyncHandler(async (req, res) => {
    const query = userFilterSchema.parse(req.query);
    const users = await prisma.user.findMany({
      where: {
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
    const order = await prisma.order.update({
      where: { id: orderId },
      data: input,
      include: { orderitem: true, payment: true },
    });

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

export default router;
