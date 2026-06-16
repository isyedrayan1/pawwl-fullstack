import { prisma } from "../lib/prisma.js";
import { env } from "../lib/env.js";
import Razorpay from "razorpay";
const razorpay = env.razorpayKeyId && env.razorpayKeySecret
    ? new Razorpay({
        key_id: env.razorpayKeyId,
        key_secret: env.razorpayKeySecret,
    })
    : null;
export const processRefundForOrder = async (orderId) => {
    const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: { payment: true },
    });
    if (!order)
        throw new Error("Order not found");
    if (order.paymentStatus !== "paid")
        return false; // Only refund paid orders
    const payment = order.payment.find((p) => p.status === "paid");
    if (!payment)
        return false;
    // Real Razorpay Refund
    if (razorpay && payment.provider === "razorpay" && payment.providerPaymentId) {
        try {
            const refund = await razorpay.payments.refund(payment.providerPaymentId, {
                amount: Math.round(Number(payment.amount) * 100),
            });
            await prisma.$transaction([
                prisma.payment.update({
                    where: { id: payment.id },
                    data: { status: "refunded", rawResponse: JSON.stringify(refund) },
                }),
                prisma.order.update({
                    where: { id: order.id },
                    data: { paymentStatus: "refunded" },
                })
            ]);
            return true;
        }
        catch (error) {
            console.error("[RefundService] Refund failed:", error);
            throw new Error(`Refund failed: ${error.message}`);
        }
    }
    // Demo Fallback Refund
    if (payment.provider === "demo") {
        await prisma.$transaction([
            prisma.payment.update({
                where: { id: payment.id },
                data: { status: "refunded" },
            }),
            prisma.order.update({
                where: { id: order.id },
                data: { paymentStatus: "refunded" },
            })
        ]);
        return true;
    }
    return false;
};
