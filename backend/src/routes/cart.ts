import { Router } from "express";
import { z } from "zod";
import { asyncHandler } from "../lib/async.js";
import { HttpError } from "../lib/http.js";
import { prisma } from "../lib/prisma.js";
import { requireAuth } from "../middleware/auth.js";
import { getCart, validateCart } from "../services/cartService.js";

const router = Router();

const addSchema = z.object({
  variantId: z.string().min(1),
  quantity: z.number().int().min(1).max(99).default(1),
});

const updateSchema = z.object({
  quantity: z.number().int().min(1).max(99),
});

router.use(requireAuth);

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const items = await getCart(req.user!.id);
    res.json({ items });
  }),
);

router.post(
  "/items",
  asyncHandler(async (req, res) => {
    const input = addSchema.parse(req.body);
    const variant = await prisma.productvariant.findUnique({
      where: { id: input.variantId },
      include: { product: true },
    });

    if (!variant || !variant.isActive || variant.product.status !== "published") {
      throw new HttpError(404, "Product variation is not available");
    }

    const item = await prisma.cartitem.upsert({
      where: {
        userId_variantId: {
          userId: req.user!.id,
          variantId: input.variantId,
        },
      },
      update: {
        quantity: { increment: input.quantity },
      },
      create: {
        userId: req.user!.id,
        productId: variant.productId,
        variantId: input.variantId,
        quantity: input.quantity,
      },
      include: { product: true, productvariant: true },
    });

    res.status(201).json({ item });
  }),
);

router.patch(
  "/items/:id",
  asyncHandler(async (req, res) => {
    const input = updateSchema.parse(req.body);
    const itemId = String(req.params.id);
    const item = await prisma.cartitem.updateMany({
      where: { id: itemId, userId: req.user!.id },
      data: { quantity: input.quantity },
    });

    if (item.count === 0) throw new HttpError(404, "Cart item not found");
    res.json({ ok: true });
  }),
);

const mergeSchema = z.object({
  items: z.array(
    z.object({
      variantId: z.string().min(1),
      quantity: z.number().int().min(1).max(99),
    })
  ),
});

router.delete(
  "/items/:id",
  asyncHandler(async (req, res) => {
    const itemId = String(req.params.id);
    await prisma.cartitem.deleteMany({
      where: { id: itemId, userId: req.user!.id },
    });
    res.json({ ok: true });
  }),
);

router.post(
  "/merge",
  asyncHandler(async (req, res) => {
    const input = mergeSchema.parse(req.body);
    const userId = req.user!.id;

    const mergedItems = await prisma.$transaction(async (tx) => {
      for (const item of input.items) {
        const variant = await tx.productvariant.findUnique({
          where: { id: item.variantId },
          include: { product: true },
        });

        if (!variant || !variant.isActive || variant.product.status !== "published") {
          continue;
        }

        await tx.cartitem.upsert({
          where: {
            userId_variantId: {
              userId,
              variantId: item.variantId,
            },
          },
          update: {
            quantity: { increment: item.quantity },
          },
          create: {
            userId,
            productId: variant.productId,
            variantId: item.variantId,
            quantity: item.quantity,
          },
        });
      }

      return tx.cartitem.findMany({
        where: { userId },
        include: { product: true, productvariant: true },
        orderBy: { createdAt: "asc" },
      });
    });

    res.json({ items: mergedItems });
  })
);

router.post(
  "/validate",
  asyncHandler(async (req, res) => {
    const result = await validateCart(req.user!.id);
    res.json(result);
  }),
);

export default router;
