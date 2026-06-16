import { Router } from "express";
import { z } from "zod";
import { asyncHandler } from "../lib/async.js";
import { requireAuth } from "../middleware/auth.js";
import { createDemoPaymentOrder, verifyDemoPayment } from "../services/paymentService.js";
import { env } from "../lib/env.js";

const router = Router();

const createOrderSchema = z.object({
  orderId: z.string().min(1),
});

const verifySchema = z.object({
  orderId: z.string().min(1),
  providerOrderId: z.string().optional(),
  providerPaymentId: z.string().optional(),
  signature: z.string().optional(),
});

router.use(requireAuth);

router.get(
  "/razorpay/config",
  asyncHandler(async (req, res) => {
    res.json({
      keyId: env.razorpayKeyId || null,
      mode: env.razorpayKeyId ? "live" : "demo",
    });
  }),
);

router.post(
  "/razorpay/create-order",
  asyncHandler(async (req, res) => {
    const input = createOrderSchema.parse(req.body);
    const rzpOrder = await createDemoPaymentOrder(req.user!.id, input.orderId);
    res.json(rzpOrder);
  }),
);

router.post(
  "/razorpay/verify",
  asyncHandler(async (req, res) => {
    const input = verifySchema.parse(req.body);
    const payment = await verifyDemoPayment(req.user!.id, input);
    res.json({
      success: true,
      payment,
    });
  }),
);

export default router;
