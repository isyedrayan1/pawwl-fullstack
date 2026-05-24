import { Prisma } from "@prisma/client";
import { createId } from "@paralleldrive/cuid2";
import { HttpError } from "../lib/http.js";
import { lineTotal } from "../lib/money.js";
import { prisma } from "../lib/prisma.js";

export const createOrderFromSingleProduct = async (
  userId: string,
  input: {
    productId: string;
    variantId: string;
    quantity: number;
    addressId: string;
    notes?: string;
  },
) => {
  return prisma.$transaction(async (tx) => {
    const [product, variant, address] = await Promise.all([
      tx.product.findFirst({ where: { id: input.productId } }),
      tx.productvariant.findFirst({
        where: { id: input.variantId, productId: input.productId },
      }),
      tx.address.findFirst({ where: { id: input.addressId, userId } }),
    ]);

    if (!address) throw new HttpError(404, "Address not found");
    if (!product || product.status !== "published") throw new HttpError(404, "Product not found");
    if (!variant || !variant.isActive) throw new HttpError(404, "Product variation not found");
    if (input.quantity < 1) throw new HttpError(400, "Quantity must be at least 1");
    if (variant.stock < input.quantity) {
      throw new HttpError(400, `${product.name} has only ${variant.stock} in stock`);
    }

    const unitPrice = variant.salePrice ?? variant.price;
    const subtotal = lineTotal(unitPrice, input.quantity);
    const deliveryFee = new Prisma.Decimal(0);
    const total = subtotal.plus(deliveryFee);

    return tx.order.create({
      data: {
        id: createId(),
        orderNumber: `PWL-${Date.now()}`,
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
        notes: input.notes,
        paymentStatus: "pending",
        fulfillmentStatus: "pending",
        items: {
          create: {
            id: createId(),
            productId: product.id,
            variantId: variant.id,
            productName: product.name,
            variantName: variant.name,
            sku: variant.sku,
            quantity: input.quantity,
            unitPrice,
            lineTotal: subtotal,
          },
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
  });
};
