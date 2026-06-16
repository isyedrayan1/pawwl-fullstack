import { prisma } from "../lib/prisma.js";
import { HttpError } from "../lib/http.js";
import { createId } from "@paralleldrive/cuid2";
import { env } from "../lib/env.js";
import { sendOrderConfirmation } from "../lib/mailer.js";
import Razorpay from "razorpay";
import crypto from "crypto";
// Initialize Razorpay SDK if keys are provided
const razorpay = env.razorpayKeyId && env.razorpayKeySecret
    ? new Razorpay({
        key_id: env.razorpayKeyId,
        key_secret: env.razorpayKeySecret,
    })
    : null;
export const createDemoPaymentOrder = async (userId, orderId) => {
    const order = await prisma.order.findFirst({
        where: { id: orderId, userId },
        include: { payment: true },
    });
    if (!order)
        throw new HttpError(404, "Order not found");
    // If Razorpay is configured, use real Razorpay API to create order
    if (razorpay) {
        try {
            const amountInPaise = Math.round(Number(order.total) * 100);
            if (amountInPaise < 100) {
                throw new HttpError(400, "Minimum amount for Razorpay is ₹1 (100 paise)");
            }
            const rzpOrder = await razorpay.orders.create({
                amount: amountInPaise,
                currency: "INR",
                receipt: order.id,
            });
            const providerOrderId = rzpOrder.id;
            const payment = order.payment[0]
                ? await prisma.payment.update({
                    where: { id: order.payment[0].id },
                    data: {
                        provider: "razorpay",
                        providerOrderId,
                        rawResponse: JSON.stringify(rzpOrder),
                    },
                })
                : await prisma.payment.create({
                    data: {
                        id: createId(),
                        orderId: order.id,
                        provider: "razorpay",
                        amount: order.total,
                        status: "pending",
                        providerOrderId,
                        rawResponse: JSON.stringify(rzpOrder),
                    },
                });
            return {
                provider: "razorpay",
                orderId: providerOrderId,
                amount: order.total,
                currency: "INR",
                payment,
            };
        }
        catch (error) {
            console.error("Razorpay order creation failed:", error);
            throw new HttpError(500, error.message || "Razorpay order creation failed");
        }
    }
    // Fallback to local demo order
    const providerOrderId = `demo_order_${order.id}`;
    const payment = order.payment[0]
        ? await prisma.payment.update({
            where: { id: order.payment[0].id },
            data: {
                provider: "demo",
                providerOrderId,
                rawResponse: JSON.stringify({
                    mode: "demo",
                    message: "Razorpay fallback order created locally",
                }),
            },
        })
        : await prisma.payment.create({
            data: {
                id: createId(),
                orderId: order.id,
                provider: "demo",
                amount: order.total,
                status: "pending",
                providerOrderId,
                rawResponse: JSON.stringify({
                    mode: "demo",
                    message: "Razorpay fallback order created locally",
                }),
            },
        });
    return {
        provider: "demo",
        orderId: providerOrderId,
        amount: order.total,
        currency: "INR",
        payment,
    };
};
export const verifyDemoPayment = async (userId, input) => {
    const order = await prisma.order.findFirst({
        where: { id: input.orderId, userId },
        include: { payment: true, orderitem: true, user: true },
    });
    if (!order)
        throw new HttpError(404, "Order not found");
    const payment = order.payment[0];
    if (!payment)
        throw new HttpError(404, "Payment not found");
    // If Razorpay keys are configured and it's a razorpay payment
    if (razorpay && payment.provider === "razorpay") {
        if (!input.providerOrderId || !input.providerPaymentId || !input.signature) {
            throw new HttpError(400, "Missing required payment fields for verification");
        }
        // Verify HMAC-SHA256 signature
        const text = input.providerOrderId + "|" + input.providerPaymentId;
        const generated_signature = crypto
            .createHmac("sha256", env.razorpayKeySecret)
            .update(text)
            .digest("hex");
        if (generated_signature !== input.signature) {
            // Mark payment as failed in the DB
            await prisma.payment.update({
                where: { id: payment.id },
                data: { status: "failed" },
            });
            await prisma.order.update({
                where: { id: order.id },
                data: { paymentStatus: "failed" },
            });
            throw new HttpError(400, "Signature verification failed. Invalid transaction.");
        }
        // Success transaction updates order, stock, and clears cart
        const [, , updatedPayment] = await prisma.$transaction(async (tx) => {
            const oUpdate = tx.order.update({
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
            // Clear the cart since payment was successful
            await tx.cartitem.deleteMany({ where: { userId } });
            const pUpdate = tx.payment.update({
                where: { id: payment.id },
                data: {
                    status: "paid",
                    providerPaymentId: input.providerPaymentId,
                    rawResponse: JSON.stringify({
                        verified: true,
                        providerOrderId: input.providerOrderId,
                        providerPaymentId: input.providerPaymentId,
                        signature: input.signature,
                    }),
                },
            });
            return Promise.all([oUpdate, Promise.resolve(null), pUpdate]);
        });
        // Send confirmation email asynchronously without blocking the response
        sendOrderConfirmation(order.user.email, order.orderNumber, Number(order.total)).catch((err) => {
            console.error("[mailer] Failed to send order confirmation:", err);
        });
        return updatedPayment;
    }
    // Fallback demo payment logic
    const providerPaymentId = input.providerPaymentId ?? `demo_payment_${Date.now()}`;
    const [, , updatedPayment] = await prisma.$transaction(async (tx) => {
        const oUpdate = tx.order.update({
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
        // Clear the cart since payment was successful
        await tx.cartitem.deleteMany({ where: { userId } });
        const pUpdate = tx.payment.update({
            where: { id: payment.id },
            data: {
                status: "paid",
                provider: "demo",
                providerOrderId: input.providerOrderId ?? payment.providerOrderId,
                providerPaymentId,
                rawResponse: JSON.stringify({
                    mode: "demo",
                    verified: true,
                    providerOrderId: input.providerOrderId ?? payment.providerOrderId,
                    providerPaymentId,
                }),
            },
        });
        return Promise.all([oUpdate, Promise.resolve(null), pUpdate]);
    });
    // Send confirmation email asynchronously without blocking the response
    sendOrderConfirmation(order.user.email, order.orderNumber, Number(order.total)).catch((err) => {
        console.error("[mailer] Failed to send order confirmation:", err);
    });
    return updatedPayment;
};
