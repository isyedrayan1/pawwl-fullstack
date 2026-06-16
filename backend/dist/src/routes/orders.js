import { Router } from "express";
import { z } from "zod";
import { asyncHandler } from "../lib/async.js";
import { HttpError } from "../lib/http.js";
import { prisma } from "../lib/prisma.js";
import { requireAuth } from "../middleware/auth.js";
import { createOrderFromSingleProduct } from "../services/buyNowService.js";
import { createOrderFromCart } from "../services/orderService.js";
import { createId } from "@paralleldrive/cuid2";
const router = Router();
const createOrderSchema = z.object({
    addressId: z.string().min(1),
    notes: z.string().optional(),
    couponCode: z.string().optional(),
    isBillingSame: z.boolean().optional(),
    billingAddressId: z.string().optional(),
});
const buyNowOrderSchema = createOrderSchema.extend({
    productId: z.string().min(1),
    variantId: z.string().min(1),
    quantity: z.coerce.number().int().min(1).max(99),
});
router.use(requireAuth);
const normalizeOrder = (order) => ({
    ...order,
    items: order.orderitem,
    payments: order.payment,
    orderitem: undefined,
    payment: undefined,
});
router.get("/coupons/:code/validate", asyncHandler(async (req, res) => {
    const code = String(req.params.code).trim();
    const coupon = await prisma.coupon.findFirst({
        where: {
            code: { equals: code },
            isActive: true,
            expiresAt: { gt: new Date() },
        },
    });
    if (!coupon)
        throw new HttpError(404, "Invalid or expired coupon code");
    res.json({ coupon });
}));
router.post("/", asyncHandler(async (req, res) => {
    const input = createOrderSchema.parse(req.body);
    const order = await createOrderFromCart(req.user.id, input.addressId, input.notes, input.couponCode, input.isBillingSame, input.billingAddressId);
    res.status(201).json({ order });
}));
router.post("/buy-now", asyncHandler(async (req, res) => {
    const input = buyNowOrderSchema.parse(req.body);
    const order = await createOrderFromSingleProduct(req.user.id, input);
    res.status(201).json({ order });
}));
router.post("/:id/returns", asyncHandler(async (req, res) => {
    const orderId = String(req.params.id);
    const input = z.object({ reason: z.string().min(5) }).parse(req.body);
    const order = await prisma.order.findFirst({
        where: { id: orderId, userId: req.user.id },
    });
    if (!order)
        throw new HttpError(404, "Order not found");
    if (order.fulfillmentStatus !== "delivered") {
        throw new HttpError(400, "Only delivered orders can be returned");
    }
    const request = await prisma.returnrequest.create({
        data: {
            id: createId(),
            orderId,
            reason: input.reason,
            status: "pending",
        },
    });
    res.status(201).json({ request });
}));
router.get("/", asyncHandler(async (req, res) => {
    const orders = await prisma.order.findMany({
        where: { userId: req.user.id },
        include: { orderitem: true, payment: true },
        orderBy: { createdAt: "desc" },
    });
    res.json({ orders: orders.map(normalizeOrder) });
}));
router.get("/:id", asyncHandler(async (req, res) => {
    const order = await prisma.order.findFirst({
        where: { id: String(req.params.id), userId: req.user.id },
        include: { orderitem: true, payment: true },
    });
    if (!order)
        throw new HttpError(404, "Order not found");
    res.json({ order: normalizeOrder(order) });
}));
router.get("/:id/invoice", asyncHandler(async (req, res) => {
    const orderId = String(req.params.id);
    const order = await prisma.order.findFirst({
        where: { id: orderId, userId: req.user.id },
        include: { orderitem: true, payment: true },
    });
    if (!order)
        throw new HttpError(404, "Order not found");
    let address = {};
    try {
        address = JSON.parse(order.addressSnapshot);
    }
    catch {
        address = {};
    }
    const itemsHtml = order.orderitem.map((item) => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #eee;">
          <strong>${item.productName}</strong><br>
          <small style="color: #666;">${item.variantName} ${item.sku ? `(${item.sku})` : ''}</small>
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">₹${Number(item.unitPrice).toFixed(0)}</td>
        <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">₹${Number(item.lineTotal).toFixed(0)}</td>
      </tr>
    `).join('');
    const formattedDate = new Date(order.createdAt).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
    const isIntrastate = Number(order.cgst) > 0 || Number(order.sgst) > 0;
    const taxHtml = isIntrastate ? `
      <tr>
        <td style="padding: 6px 0; color: #555;">CGST (9%)</td>
        <td style="padding: 6px 0; text-align: right; font-weight: bold;">₹${Number(order.cgst).toFixed(2)}</td>
      </tr>
      <tr>
        <td style="padding: 6px 0; color: #555;">SGST (9%)</td>
        <td style="padding: 6px 0; text-align: right; font-weight: bold;">₹${Number(order.sgst).toFixed(2)}</td>
      </tr>
    ` : `
      <tr>
        <td style="padding: 6px 0; color: #555;">IGST (18%)</td>
        <td style="padding: 6px 0; text-align: right; font-weight: bold;">₹${Number(order.igst).toFixed(2)}</td>
      </tr>
    `;
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice ${order.orderNumber}</title>
        <meta charset="utf-8">
        <style>
          body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            color: #333;
            line-height: 1.6;
            margin: 0;
            padding: 40px;
            background: #fff;
          }
          .invoice-box {
            max-width: 800px;
            margin: auto;
            border: 1px solid #eee;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
          }
          .header-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 40px;
          }
          .logo {
            font-size: 28px;
            font-weight: 800;
            color: #134e86;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          .meta-info {
            text-align: right;
            font-size: 14px;
            color: #555;
          }
          .address-section {
            display: flex;
            justify-content: space-between;
            margin-bottom: 40px;
            gap: 20px;
          }
          .address-box {
            flex: 1;
            padding: 20px;
            background: #fdfdfd;
            border: 1px solid #f0f0f0;
            border-radius: 6px;
          }
          .address-box h3 {
            margin-top: 0;
            font-size: 16px;
            color: #134e86;
            border-bottom: 2px solid #134e86;
            padding-bottom: 6px;
            margin-bottom: 12px;
          }
          .address-box p {
            margin: 4px 0;
            font-size: 14px;
            color: #555;
          }
          .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
            font-size: 14px;
          }
          .items-table th {
            background: #f8fbff;
            color: #134e86;
            padding: 12px;
            font-weight: bold;
            border-bottom: 2px solid #dce6ee;
            text-align: left;
          }
          .summary-table {
            width: 320px;
            margin-left: auto;
            border-collapse: collapse;
            font-size: 14px;
          }
          .summary-table td {
            padding: 8px 0;
          }
          .grand-total {
            font-size: 20px;
            font-weight: bold;
            color: #134e86;
            border-top: 2px solid #134e86;
            padding-top: 12px !important;
          }
          .actions {
            max-width: 800px;
            margin: 20px auto 0;
            text-align: center;
          }
          .btn {
            background: #134e86;
            color: white;
            border: none;
            padding: 10px 20px;
            font-size: 14px;
            font-weight: bold;
            border-radius: 6px;
            cursor: pointer;
            text-decoration: none;
            display: inline-block;
          }
          .btn:hover {
            background: #0d365d;
          }
          @media print {
            body { padding: 0; }
            .invoice-box { border: none; box-shadow: none; padding: 0; }
            .actions { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="invoice-box">
          <table class="header-table">
            <tr>
              <td>
                <div class="logo">Pawwl</div>
                <div style="font-size: 12px; color: #777; margin-top: 4px;">Premium Pet Supplies & Services</div>
              </td>
              <td class="meta-info">
                <strong>INVOICE</strong><br>
                Invoice #: ${order.orderNumber}<br>
                Date: ${formattedDate}<br>
                Payment: ${order.paymentStatus.toUpperCase()}
              </td>
            </tr>
          </table>

          <div class="address-section">
            <div class="address-box">
              <h3>Seller Details</h3>
              <p><strong>Pawwl India</strong></p>
              <p>Grooming & Supplies HQ</p>
              <p>Mumbai, Maharashtra</p>
              <p>India</p>
              <p>Email: billing@pawwl.com</p>
            </div>
            <div class="address-box">
              <h3>Shipping Address</h3>
              <p><strong>${address.fullName || ''}</strong></p>
              <p>${address.line1 || ''}</p>
              ${address.line2 ? `<p>${address.line2}</p>` : ''}
              <p>${address.city || ''}, ${address.state || ''} - ${address.postalCode || ''}</p>
              <p>Country: ${address.country || 'India'}</p>
              <p>Phone: ${address.phone || ''}</p>
            </div>
          </div>

          <table class="items-table">
            <thead>
              <tr>
                <th>Product Description</th>
                <th style="text-align: center; width: 80px;">Qty</th>
                <th style="text-align: right; width: 120px;">Unit Price</th>
                <th style="text-align: right; width: 120px;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <table class="summary-table">
            <tr>
              <td style="color: #555;">Subtotal</td>
              <td style="text-align: right; font-weight: bold;">₹${Number(order.subtotal).toFixed(0)}</td>
            </tr>
            ${Number(order.discount) > 0 ? `
              <tr>
                <td style="color: #555;">Discount</td>
                <td style="text-align: right; font-weight: bold; color: #ff4d4d;">-₹${Number(order.discount).toFixed(0)}</td>
              </tr>
            ` : ''}
            <tr>
              <td style="color: #555;">Taxable Value</td>
              <td style="text-align: right; font-weight: bold;">₹${Number(order.taxableValue).toFixed(2)}</td>
            </tr>
            ${taxHtml}
            <tr>
              <td style="color: #555;">Shipping & Delivery</td>
              <td style="text-align: right; font-weight: bold; color: #17b170;">FREE</td>
            </tr>
            <tr class="grand-total">
              <td>Grand Total</td>
              <td style="text-align: right;">₹${Number(order.total).toFixed(0)}</td>
            </tr>
          </table>
          
          <div style="margin-top: 60px; font-size: 11px; color: #999; text-align: center; border-top: 1px dashed #eee; padding-top: 20px;">
            Thank you for shopping with Pawwl! This is a system-generated invoice.
          </div>
        </div>

        <div class="actions">
          <button onclick="window.print()" class="btn">Print / Save as PDF</button>
        </div>
      </body>
      </html>
    `;
    res.send(html);
}));
router.get("/:id", asyncHandler(async (req, res) => {
    const orderId = String(req.params.id);
    const order = await prisma.order.findFirst({
        where: { id: orderId, userId: req.user.id },
        include: { orderitem: true, payment: true },
    });
    if (!order)
        throw new HttpError(404, "Order not found");
    // Normalize field names for frontend compatibility
    const normalized = {
        ...order,
        items: order.orderitem,
        payments: order.payment,
        orderitem: undefined,
        payment: undefined,
    };
    res.json({ order: normalized });
}));
router.post("/:id/reviews", asyncHandler(async (req, res) => {
    const orderId = String(req.params.id);
    const { productId, rating, title, comment } = req.body;
    if (!productId || typeof rating !== "number" || rating < 1 || rating > 5) {
        throw new HttpError(400, "Invalid review data");
    }
    const order = await prisma.order.findFirst({
        where: { id: orderId, userId: req.user.id },
        include: { orderitem: true },
    });
    if (!order)
        throw new HttpError(404, "Order not found");
    if (order.fulfillmentStatus !== "delivered") {
        throw new HttpError(400, "You can only review products from delivered orders");
    }
    const hasProduct = order.orderitem.some((item) => item.productId === productId);
    if (!hasProduct) {
        throw new HttpError(400, "Product not found in this order");
    }
    // Check if review already exists
    const existingReview = await prisma.review.findFirst({
        where: { userId: req.user.id, productId: productId }
    });
    if (existingReview) {
        throw new HttpError(400, "You have already reviewed this product");
    }
    const review = await prisma.review.create({
        data: {
            productId,
            userId: req.user.id,
            rating,
            title,
            comment,
        },
    });
    // Update product review count and rating
    const allReviews = await prisma.review.findMany({
        where: { productId },
    });
    const avgRating = allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length;
    await prisma.product.update({
        where: { id: productId },
        data: {
            rating: avgRating.toFixed(1),
            reviewCount: allReviews.length,
        },
    });
    res.status(201).json({ review });
}));
export default router;
