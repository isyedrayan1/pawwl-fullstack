import { Router } from "express";
import { asyncHandler } from "../lib/async.js";

const router = Router();

router.post(
  "/razorpay",
  asyncHandler(async (_req, res) => {
    res.json({
      ok: true,
      mode: "fallback",
      message: "Razorpay webhook received in demo mode. Signature verification will be enabled with live credentials.",
    });
  }),
);

export default router;
