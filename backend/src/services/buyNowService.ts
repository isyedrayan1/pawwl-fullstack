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
    couponCode?: string;
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
    const subtotalValue = Number(lineTotal(unitPrice, input.quantity));

    // 1. Coupon Discount Calculation
    let discountValue = 0;
    let validatedCouponCode: string | null = null;

    if (input.couponCode) {
      const coupon = await tx.coupon.findFirst({
        where: {
          code: { equals: input.couponCode },
          isActive: true,
          expiresAt: { gt: new Date() },
        },
      });

      if (coupon) {
        const minCartAmt = Number(coupon.minCartAmt ?? 0);
        if (subtotalValue >= minCartAmt) {
          validatedCouponCode = coupon.code;
          if (coupon.type === "percentage") {
            const calculatedDiscount = subtotalValue * (Number(coupon.discount) / 100);
            const maxD = coupon.maxDiscount ? Number(coupon.maxDiscount) : calculatedDiscount;
            discountValue = Math.min(calculatedDiscount, maxD);
          } else {
            discountValue = Math.min(Number(coupon.discount), subtotalValue);
          }
        }
      }
    }

    const subtotal = new Prisma.Decimal(subtotalValue);
    const discount = new Prisma.Decimal(discountValue);
    const deliveryFee = new Prisma.Decimal(0);
    const total = subtotal.minus(discount).plus(deliveryFee);

    // 2. GST Indian Tax Split Calculation
    const storeState = (process.env.STORE_ORIGIN_STATE || "maharashtra").trim().toLowerCase();
    const customerState = address.state.trim().toLowerCase();
    const isIntrastate = storeState === customerState;

    const totalValueNum = Number(total);
    const taxableValueNum = totalValueNum / 1.18; // Backward calculate taxable value assuming standard 18% slab
    const gstAmountNum = totalValueNum - taxableValueNum;

    let cgstNum = 0;
    let sgstNum = 0;
    let igstNum = 0;

    if (isIntrastate) {
      cgstNum = gstAmountNum / 2;
      sgstNum = gstAmountNum / 2;
    } else {
      igstNum = gstAmountNum;
    }

    return tx.order.create({
      data: {
        id: createId(),
        orderNumber: `PWL-${Date.now()}`,
        userId,
        addressSnapshot: JSON.stringify({
          label: address.label,
          fullName: address.fullName,
          phone: address.phone,
          line1: address.line1,
          line2: address.line2,
          city: address.city,
          state: address.state,
          postalCode: address.postalCode,
          country: address.country,
        }),
        subtotal,
        discount,
        deliveryFee,
        total,
        couponCode: validatedCouponCode,
        taxableValue: new Prisma.Decimal(taxableValueNum),
        cgst: new Prisma.Decimal(cgstNum),
        sgst: new Prisma.Decimal(sgstNum),
        igst: new Prisma.Decimal(igstNum),
        notes: input.notes,
        paymentStatus: "pending",
        fulfillmentStatus: "pending",
        orderitem: {
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
        payment: {
          create: {
            id: createId(),
            provider: "demo",
            amount: total,
            status: "pending",
          },
        },
      },
      include: { orderitem: true, payment: true },
    });
  });
};
