import { Router } from "express";
import { z } from "zod";
import { asyncHandler } from "../lib/async.js";
import { HttpError } from "../lib/http.js";
import { prisma } from "../lib/prisma.js";
import { requireAuth } from "../middleware/auth.js";
import { createOrderFromSingleProduct } from "../services/buyNowService.js";
import { createOrderFromCart } from "../services/orderService.js";

const router = Router();

const createOrderSchema = z.object({
  addressId: z.string().min(1),
  notes: z.string().optional(),
});

const buyNowOrderSchema = createOrderSchema.extend({
  productId: z.string().min(1),
  variantId: z.string().min(1),
  quantity: z.coerce.number().int().min(1).max(99),
});

router.use(requireAuth);

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const input = createOrderSchema.parse(req.body);
    const order = await createOrderFromCart(req.user!.id, input.addressId, input.notes);
    res.status(201).json({ order });
  }),
);

router.post(
  "/buy-now",
  asyncHandler(async (req, res) => {
    const input = buyNowOrderSchema.parse(req.body);
    const order = await createOrderFromSingleProduct(req.user!.id, input);
    res.status(201).json({ order });
  }),
);

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const orders = await prisma.order.findMany({
      where: { userId: req.user!.id },
      include: { orderitem: true, payment: true },
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

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const orderId = String(req.params.id);
    const order = await prisma.order.findFirst({
      where: { id: orderId, userId: req.user!.id },
      include: { orderitem: true, payment: true },
    });
    if (!order) throw new HttpError(404, "Order not found");
    // Normalize field names for frontend compatibility
    const normalized = {
      ...order,
      items: order.orderitem,
      payments: order.payment,
      orderitem: undefined,
      payment: undefined,
    };
    res.json({ order: normalized });
  }),
);

export default router;
