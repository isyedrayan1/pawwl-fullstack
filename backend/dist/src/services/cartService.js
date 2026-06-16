import { HttpError } from "../lib/http.js";
import { prisma } from "../lib/prisma.js";
export const getCart = async (userId) => prisma.cartitem.findMany({
    where: { userId },
    include: {
        product: true,
        productvariant: true,
    },
    orderBy: { createdAt: "asc" },
});
export const validateCart = async (userId) => {
    const items = await getCart(userId);
    const issues = [];
    let subtotal = 0;
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
        subtotal += price * item.quantity;
    }
    return {
        items,
        valid: issues.length === 0,
        issues,
        subtotal,
        deliveryFee: 0,
        total: subtotal,
    };
};
export const assertValidCart = async (userId) => {
    const cart = await validateCart(userId);
    if (cart.items.length === 0)
        throw new HttpError(400, "Cart is empty");
    if (!cart.valid)
        throw new HttpError(400, cart.issues.join("; "));
    return cart;
};
