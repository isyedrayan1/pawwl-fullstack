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

    const item = await prisma.cartItem.upsert({
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
      include: { product: true, variant: true },
    });

    res.status(201).json({ item });
  }),
);

router.patch(
  "/items/:id",
  asyncHandler(async (req, res) => {
    const input = updateSchema.parse(req.body);
    const itemId = String(req.params.id);
    const item = await prisma.cartItem.updateMany({
      where: { id: itemId, userId: req.user!.id },
      data: { quantity: input.quantity },
    });

    if (item.count === 0) throw new HttpError(404, "Cart item not found");
    res.json({ ok: true });
  }),
);

router.delete(
  "/items/:id",
  asyncHandler(async (req, res) => {
    const itemId = String(req.params.id);
    await prisma.cartItem.deleteMany({
      where: { id: itemId, userId: req.user!.id },
    });
    res.json({ ok: true });
  }),
);

router.post(
  "/validate",
  asyncHandler(async (req, res) => {
    const result = await validateCart(req.user!.id);
    res.json(result);
  }),
);

export default router;
