import { prisma } from "../lib/prisma.js";
import { HttpError } from "../lib/http.js";
import { createId } from "@paralleldrive/cuid2";

export const createDemoPaymentOrder = async (userId: string, orderId: string) => {
  const order = await prisma.order.findFirst({
    where: { id: orderId, userId },
    include: { payments: true },
  });

  if (!order) throw new HttpError(404, "Order not found");

  const providerOrderId = `demo_order_${order.id}`;
  const payment = order.payments[0]
    ? await prisma.payment.update({
        where: { id: order.payments[0].id },
        data: {
          provider: "demo",
          providerOrderId,
          rawResponse: {
            mode: "demo",
            message: "Razorpay fallback order created locally",
          },
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
          rawResponse: {
            mode: "demo",
            message: "Razorpay fallback order created locally",
          },
        },
      });

  return {
    orderId: providerOrderId,
    amount: order.total,
    currency: "INR",
    payment,
  };
};

export const verifyDemoPayment = async (
  userId: string,
  input: {
    orderId: string;
    providerOrderId?: string;
    providerPaymentId?: string;
  },
) => {
  const order = await prisma.order.findFirst({
    where: { id: input.orderId, userId },
    include: { payments: true },
  });

  if (!order) throw new HttpError(404, "Order not found");

  const payment = order.payments[0];
  if (!payment) throw new HttpError(404, "Payment not found");

  const providerPaymentId = input.providerPaymentId ?? `demo_payment_${Date.now()}`;

  const [, updatedPayment] = await prisma.$transaction([
    prisma.order.update({
      where: { id: order.id },
      data: { paymentStatus: "paid" },
    }),
    prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: "paid",
        provider: "demo",
        providerOrderId: input.providerOrderId ?? payment.providerOrderId,
        providerPaymentId,
        rawResponse: {
          mode: "demo",
          verified: true,
          providerOrderId: input.providerOrderId ?? payment.providerOrderId,
          providerPaymentId,
        },
      },
    }),
  ]);

  return updatedPayment;
};
