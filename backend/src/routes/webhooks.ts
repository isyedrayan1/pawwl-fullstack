import { Router } from "express";
import { asyncHandler } from "../lib/async.js";
import { handleRazorpayWebhook } from "../services/webhookService.js";
import express from "express";

const router = Router();

// Webhook payload needs raw body for HMAC signature verification
router.post(
  "/razorpay",
  express.json({
    verify: (req: any, _res, buf) => {
      req.rawBody = buf.toString();
    },
  }),
  asyncHandler(async (req: any, res) => {
    const signature = req.headers["x-razorpay-signature"] as string | undefined;
    const rawBody = req.rawBody || JSON.stringify(req.body);

    try {
      const result = await handleRazorpayWebhook(signature, req.body, rawBody);
      res.json(result);
    } catch (err: any) {
      console.error("[Webhook Error]:", err.message);
      res.status(400).json({ ok: false, error: err.message });
    }
  }),
);

export default router;
