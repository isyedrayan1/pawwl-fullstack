import { Prisma } from "@prisma/client";
import { HttpError } from "../lib/http.js";
import { lineTotal } from "../lib/money.js";
import { prisma } from "../lib/prisma.js";

/**
 * Create an order for a single product/variant (Buy Now flow).
 * Input: { productId, variantId, quantity }
 */
export const createOrderFromSingleProduct = async (userId, input) => {
  const { productId, variantId, quantity } = input;

  return prisma.$transaction(async (tx) => {
    const [variant, product, address] = await Promise.all([
      tx.productvariant.findUnique({ where: { id: variantId }, include: { product: true } }),
      tx.product.findUnique({ where: { id: productId } }),
      tx.address.findFirst({ where: { userId } }),
    ]);

    if (!variant || !product) throw new HttpError(404, "Product variation is not available");
    if (product.status !== "published") throw new HttpError(400, "Product is not available");
    if (!variant.isActive) throw new HttpError(400, "Selected variant is not available");
    if (variant.stock < quantity) throw new HttpError(400, `${product.name} has only ${variant.stock} in stock`);
    if (!address) throw new HttpError(400, "Please add a delivery address");

    const price = Number(variant.salePrice ?? variant.price);
    const subtotalValue = price * quantity;

    const orderNumber = `PWL-${Date.now()}`;
    const subtotal = new Prisma.Decimal(subtotalValue);
    const deliveryFee = new Prisma.Decimal(0);
    const total = subtotal.plus(deliveryFee);

    const order = await tx.order.create({
      data: {
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
        notes: "Buy Now",
        paymentStatus: "pending",
        fulfillmentStatus: "pending",
        items: {
          create: [{
            productId: product.id,
            variantId: variant.id,
            productName: product.name,
            variantName: variant.name,
            sku: variant.sku,
            quantity,
            unitPrice: price,
            lineTotal: lineTotal(price, quantity),
          }],
        },
        payments: {
          create: {
            provider: "demo",
            amount: total,
            status: "pending",
          },
        },
      },
      include: { items: true, payments: true },
    });

    return order;
  });
};

export default createOrderFromSingleProduct;
