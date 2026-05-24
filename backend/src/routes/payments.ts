import { Router } from "express";
import { z } from "zod";
import { asyncHandler } from "../lib/async.js";
import { requireAuth } from "../middleware/auth.js";
import { createDemoPaymentOrder, verifyDemoPayment } from "../services/paymentService.js";

const router = Router();

const createOrderSchema = z.object({
  orderId: z.string().min(1),
});

const verifySchema = z.object({
  orderId: z.string().min(1),
  providerOrderId: z.string().optional(),
  providerPaymentId: z.string().optional(),
});

router.use(requireAuth);

router.post(
  "/razorpay/create-order",
  asyncHandler(async (req, res) => {
    const input = createOrderSchema.parse(req.body);
    const demoOrder = await createDemoPaymentOrder(req.user!.id, input.orderId);
    res.json({
      provider: "demo",
      mode: "fallback",
      message: "Demo payment order created. Razorpay can be enabled when client credentials are available.",
      ...demoOrder,
    });
  }),
);

router.post(
  "/razorpay/verify",
  asyncHandler(async (req, res) => {
    const input = verifySchema.parse(req.body);
    const payment = await verifyDemoPayment(req.user!.id, input);
    res.json({
      provider: "demo",
      mode: "fallback",
      payment,
    });
  }),
);

export default router;
