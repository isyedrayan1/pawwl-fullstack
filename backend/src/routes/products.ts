import { Router } from "express";
import { z } from "zod";
import { asyncHandler } from "../lib/async.js";
import { HttpError } from "../lib/http.js";
import { prisma } from "../lib/prisma.js";

const router = Router();

const listSchema = z.object({
  status: z.enum(["draft", "published", "archived"]).optional(),
  q: z.string().optional(),
  category: z.string().optional(),
});

const productInclude = {
  productvariant: {
    where: { isActive: true },
    orderBy: { createdAt: "asc" as const },
  },
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

const normalizeProduct = (product: Awaited<ReturnType<typeof prisma.product.findMany>>[number]) => {
  const { productvariant, images, benefits, ...rest } = product;

  return {
    ...rest,
    images: parseJsonArray(images),
    benefits: parseJsonArray(benefits),
    variants: productvariant,
  };
};

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const query = listSchema.parse(req.query);
    const products = await prisma.product.findMany({
      where: {
        status: query.status ?? "published",
        ...(query.category ? { category: query.category } : {}),
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
        OR: [{ slug: slugOrId }, { id: slugOrId }],
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

export default router;
