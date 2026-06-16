import { prisma } from "../lib/prisma.js";
import { env } from "../lib/env.js";
import { sendOrderConfirmation } from "../lib/mailer.js";
import crypto from "crypto";
export const handleRazorpayWebhook = async (signature, body, rawBody) => {
    // 1. Verify Webhook Signature
    if (!env.razorpayWebhookSecret) {
        console.warn("Razorpay webhook received but RAZORPAY_WEBHOOK_SECRET is not set.");
        return { ok: true, message: "Webhook ignored (demo mode or missing secret)" };
    }
    if (!signature) {
        throw new Error("Missing razorpay signature in headers");
    }
    const expectedSignature = crypto
        .createHmac("sha256", env.razorpayWebhookSecret)
        .update(rawBody)
        .digest("hex");
    if (expectedSignature !== signature) {
        throw new Error("Invalid razorpay webhook signature");
    }
    // 2. Process Event
    const event = body.event;
    const payload = body.payload;
    console.log(`[Webhook] Processing event: ${event}`);
    if (event === "payment.captured" || event === "order.paid") {
        const paymentEntity = payload.payment?.entity;
        const providerOrderId = paymentEntity?.order_id;
        const providerPaymentId = paymentEntity?.id;
        if (!providerOrderId)
            return { ok: true, message: "No order_id in payload" };
        // Find the payment
        const payment = await prisma.payment.findFirst({
            where: { providerOrderId },
            include: { order: { include: { orderitem: true, user: true } } },
        });
        if (!payment) {
            console.warn(`[Webhook] Payment not found for providerOrderId: ${providerOrderId}`);
            return { ok: true, message: "Payment not found" };
        }
        // Idempotency check
        if (payment.status === "paid") {
            console.log(`[Webhook] Order ${payment.orderId} is already paid. Idempotent skip.`);
            return { ok: true, message: "Already paid" };
        }
        const order = payment.order;
        const userId = order.userId;
        // Fulfill the order
        await prisma.$transaction(async (tx) => {
            await tx.order.update({
                where: { id: order.id },
                data: { paymentStatus: "paid" },
            });
            for (const item of order.orderitem) {
                if (item.variantId) {
                    await tx.productvariant.update({
                        where: { id: item.variantId },
                        data: { stock: { decrement: item.quantity } },
                    });
                }
                if (item.productId) {
                    await tx.product.update({
                        where: { id: item.productId },
                        data: { stock: { decrement: item.quantity } },
                    });
                }
            }
            if (order.couponId) {
                await tx.coupon.update({
                    where: { id: order.couponId },
                    data: { usedCount: { increment: 1 } },
                });
            }
            // Clear the cart
            await tx.cartitem.deleteMany({ where: { userId } });
            await tx.payment.update({
                where: { id: payment.id },
                data: {
                    status: "paid",
                    providerPaymentId,
                    rawResponse: JSON.stringify({
                        verified_by: "webhook",
                        ...paymentEntity,
                    }),
                },
            });
        });
        // Send confirmation email asynchronously
        sendOrderConfirmation(order.user.email, order.orderNumber, Number(order.total)).catch((err) => {
            console.error("[mailer] Failed to send order confirmation from webhook:", err);
        });
        return { ok: true, message: "Payment captured successfully via webhook" };
    }
    if (event === "payment.failed") {
        const paymentEntity = payload.payment?.entity;
        const providerOrderId = paymentEntity?.order_id;
        if (!providerOrderId)
            return { ok: true, message: "No order_id in payload" };
        const payment = await prisma.payment.findFirst({
            where: { providerOrderId },
            include: { order: { include: { user: true } } },
        });
        if (!payment)
            return { ok: true, message: "Payment not found" };
        if (payment.status === "pending") {
            await prisma.$transaction([
                prisma.payment.update({
                    where: { id: payment.id },
                    data: { status: "failed" },
                }),
                prisma.order.update({
                    where: { id: payment.orderId },
                    data: { paymentStatus: "failed" },
                }),
            ]);
        }
        return { ok: true, message: "Payment failure recorded" };
    }
    return { ok: true, message: `Event ${event} unhandled but acknowledged` };
};
