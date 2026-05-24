import { Prisma } from "@prisma/client";
import { createId } from "@paralleldrive/cuid2";
import { HttpError } from "../lib/http.js";
import { lineTotal } from "../lib/money.js";
import { prisma } from "../lib/prisma.js";

export const createOrderFromCart = async (userId: string, addressId: string, notes?: string) => {
  return prisma.$transaction(async (tx) => {
    const [items, address] = await Promise.all([
      tx.cartItem.findMany({
        where: { userId },
        include: {
          product: true,
          variant: true,
        },
        orderBy: { createdAt: "asc" },
      }),
      tx.address.findFirst({ where: { id: addressId, userId } }),
    ]);

    if (!address) throw new HttpError(404, "Address not found");
    if (items.length === 0) throw new HttpError(400, "Cart is empty");

    const issues: string[] = [];
    let subtotalValue = 0;

    for (const item of items) {
      if (item.product.status !== "published") {
        issues.push(`${item.product.name} is not available`);
      }
      if (!item.variant.isActive) {
        issues.push(`${item.product.name} variation is not available`);
      }
      if (item.variant.stock < item.quantity) {
        issues.push(`${item.product.name} has only ${item.variant.stock} in stock`);
      }

      const price = Number(item.variant.salePrice ?? item.variant.price);
      subtotalValue += price * item.quantity;
    }

    if (issues.length > 0) throw new HttpError(400, issues.join("; "));

    const orderNumber = `PWL-${Date.now()}`;
    const subtotal = new Prisma.Decimal(subtotalValue);
    const deliveryFee = new Prisma.Decimal(0);
    const total = subtotal.plus(deliveryFee);

    const order = await tx.order.create({
      data: {
        id: createId(),
        orderNumber,
        userId,
        addressSnapshot: {
          label: address.label,
          fullName: address.fullName,
          phone: address.phone,
          line1: address.line1,
          line2: address.line2,
          city: address.city,
          state: address.state,
          postalCode: address.postalCode,
          country: address.country,
        },
        subtotal,
        deliveryFee,
        total,
        notes,
        paymentStatus: "pending",
        fulfillmentStatus: "pending",
        items: {
          create: items.map((item) => {
            const unitPrice = item.variant.salePrice ?? item.variant.price;
            return {
              id: createId(),
              productId: item.productId,
              variantId: item.variantId,
              productName: item.product.name,
              variantName: item.variant.name,
              sku: item.variant.sku,
              quantity: item.quantity,
              unitPrice,
              lineTotal: lineTotal(unitPrice, item.quantity),
            };
          }),
        },
        payments: {
          create: {
            id: createId(),
            provider: "demo",
            amount: total,
            status: "pending",
          },
        },
      },
      include: { items: true, payments: true },
    });

    await tx.cartItem.deleteMany({ where: { userId } });
    return order;
  });
};
