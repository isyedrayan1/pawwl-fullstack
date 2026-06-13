import { Router } from "express";
import { z } from "zod";
import { asyncHandler } from "../lib/async.js";
import { HttpError } from "../lib/http.js";
import { prisma } from "../lib/prisma.js";
import { requireAuth } from "../middleware/auth.js";
import { createId } from "@paralleldrive/cuid2";

const router = Router();

const listSchema = z.object({
  status: z.enum(["draft", "published", "archived"]).optional(),
  q: z.string().optional(),
  category: z.string().optional(),
  animalType: z.string().optional(),
});

const productInclude = {
  productvariant: {
    where: { isActive: true },
    orderBy: { createdAt: "asc" as const },
  },
  animaltype: true,
  productcategory: true,
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

router.get(
  "/meta",
  asyncHandler(async (_req, res) => {
    const [animalTypes, categories] = await Promise.all([
      prisma.animaltype.findMany({ where: { isActive: true }, orderBy: [{ sortOrder: "asc" }, { name: "asc" }] }),
      prisma.productcategory.findMany({ where: { isActive: true }, orderBy: [{ sortOrder: "asc" }, { name: "asc" }] }),
    ]);

    res.json({ animalTypes, categories });
  }),
);

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const query = listSchema.parse(req.query);
    const products = await prisma.product.findMany({
      where: {
        status: query.status ?? "published",
        ...(query.category ? { category: query.category } : {}),
        ...(query.animalType ? { animaltype: { key: query.animalType.toLowerCase() } } : {}),
        ...(query.q
          ? {
              OR: [
                { name: { contains: query.q } },
                { description: { contains: query.q } },
                { brand: { contains: query.q } },
              ],
            }
          : {}),
      },
      include: productInclude,
      orderBy: { createdAt: "desc" },
    });

    const normalized = products.map(normalizeProduct);
    res.json({ products: normalized });
  }),
);

router.get(
  "/:slug",
  asyncHandler(async (req, res) => {
    const slugOrId = String(req.params.slug);
    const product = await prisma.product.findFirst({
      where: {
        OR: [
          { slug: slugOrId },
          { id: slugOrId },
          ...(Number.isFinite(Number(slugOrId)) ? [{ catalogId: Number(slugOrId) }] : []),
        ],
      },
      include: productInclude,
    });

    if (!product || product.status !== "published") {
      throw new HttpError(404, "Product not found");
    }

    const normalized = normalizeProduct(product);

    res.json({ product: normalized });
  }),
);

const reviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  title: z.string().optional().nullable(),
  comment: z.string().min(5),
});

router.get(
  "/:id/reviews",
  asyncHandler(async (req, res) => {
    const productId = String(req.params.id);
    const reviews = await prisma.review.findMany({
      where: { productId },
      include: { user: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    });
    res.json({ reviews });
  })
);

router.post(
  "/:id/reviews",
  requireAuth,
  asyncHandler(async (req, res) => {
    const productId = String(req.params.id);
    const input = reviewSchema.parse(req.body);

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) throw new HttpError(404, "Product not found");

    const review = await prisma.review.create({
      data: {
        id: createId(),
        productId,
        userId: req.user!.id,
        rating: input.rating,
        title: input.title,
        comment: input.comment,
      },
    });

    const aggregates = await prisma.review.aggregate({
      where: { productId },
      _count: true,
      _avg: { rating: true },
    });

    await prisma.product.update({
      where: { id: productId },
      data: {
        rating: aggregates._avg.rating ? aggregates._avg.rating.toFixed(1) : "0.0",
        reviewCount: aggregates._count,
      },
    });

    res.status(201).json({ review });
  })
);

export default router;
