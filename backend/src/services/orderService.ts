import { Prisma } from "@prisma/client";
import { createId } from "@paralleldrive/cuid2";
import { HttpError } from "../lib/http.js";
import { lineTotal } from "../lib/money.js";
import { prisma } from "../lib/prisma.js";

export const createOrderFromCart = async (
  userId: string,
  addressId: string,
  notes?: string,
  couponCode?: string,
  isBillingSame: boolean = true,
  billingAddressId?: string
) => {
  return prisma.$transaction(async (tx) => {
    const [items, address, billingAddress] = await Promise.all([
      tx.cartitem.findMany({
        where: { userId },
        include: {
          product: true,
          productvariant: true,
        },
        orderBy: { createdAt: "asc" },
      }),
      tx.address.findFirst({ where: { id: addressId, userId } }),
      billingAddressId && !isBillingSame 
        ? tx.address.findFirst({ where: { id: billingAddressId, userId } })
        : Promise.resolve(null),
    ]);

    if (!address) throw new HttpError(404, "Shipping address not found");
    const resolvedBillingAddress = isBillingSame ? address : (billingAddress ?? address);
    if (!resolvedBillingAddress) throw new HttpError(404, "Billing address not found");
    if (items.length === 0) throw new HttpError(400, "Cart is empty");

    const issues: string[] = [];
    let subtotalValue = 0;

    for (const item of items) {
      if (item.product.status !== "published") {
        issues.push(`${item.product.name} is not available`);
      }
      if (!item.productvariant.isActive) {
        issues.push(`${item.product.name} variation is not available`);
      }
      if (item.productvariant.stock < item.quantity) {
        issues.push(`${item.product.name} has only ${item.productvariant.stock} in stock`);
      }

      const price = Number(item.productvariant.salePrice ?? item.productvariant.price);
      subtotalValue += price * item.quantity;
    }

    if (issues.length > 0) throw new HttpError(400, issues.join("; "));

    let discountValue = 0;
    let validatedCouponCode: string | null = null;
    let validatedCouponId: string | null = null;

    if (couponCode) {
      const coupon = await tx.coupon.findFirst({
        where: {
          code: { equals: couponCode },
          isActive: true,
          expiresAt: { gt: new Date() },
        },
      });

      if (coupon) {
        const minCartAmt = Number(coupon.minCartAmt ?? 0);
        const limitReached = coupon.usageLimit != null && coupon.usedCount >= coupon.usageLimit;
        
        if (subtotalValue >= minCartAmt && !limitReached) {
          validatedCouponCode = coupon.code;
          validatedCouponId = coupon.id;
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

    const orderNumber = `PWL-${Date.now()}`;
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

    const order = await tx.order.create({
      data: {
        id: createId(),
        orderNumber,
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
        shippingAddress: JSON.stringify(address),
        billingAddress: JSON.stringify(resolvedBillingAddress),
        isBillingSame,
        subtotal,
        discount,
        deliveryFee,
        total,
        couponCode: validatedCouponCode,
        couponId: validatedCouponId,
        taxableValue: new Prisma.Decimal(taxableValueNum),
        cgst: new Prisma.Decimal(cgstNum),
        sgst: new Prisma.Decimal(sgstNum),
        igst: new Prisma.Decimal(igstNum),
        notes,
        paymentStatus: "pending",
        fulfillmentStatus: "pending",
        orderitem: {
          create: items.map((item) => {
            const unitPrice = item.productvariant.salePrice ?? item.productvariant.price;
            return {
              id: createId(),
              productId: item.productId,
              variantId: item.variantId,
              productName: item.product.name,
              variantName: item.productvariant.name,
              sku: item.productvariant.sku,
              quantity: item.quantity,
              unitPrice,
              lineTotal: lineTotal(unitPrice, item.quantity),
            };
          }),
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

    return order;
  });
};
