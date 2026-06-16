import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams, Link } from "react-router-dom";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { apiRequest, formatPrice } from "@/lib/api";
import {
  CheckCircle,
  Home,
  Package,
  Truck,
  Download,
  Share2,
  ArrowRight,
  Phone,
  Mail,
  MessageCircle,
} from "lucide-react";

type Order = {
  id: string;
  orderNumber: string;
  total: string | number;
  paymentStatus: string;
  fulfillmentStatus: string;
  createdAt: string;
  items: {
    id: string;
    productName: string;
    quantity: number;
    lineTotal: string | number;
  }[];
};

const OrderSuccess = () => {
  const [params] = useSearchParams();
  const orderId = params.get("order");

  const { data, isLoading, error } = useQuery({
    queryKey: ["order", orderId],
    queryFn: () =>
      orderId
        ? apiRequest<{ order: Order }>(`/api/orders/${orderId}`)
        : Promise.reject(new Error("No order ID provided")),
    enabled: !!orderId,
    retry: false,
  });

  if (!orderId) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <main className="flex-1 section-container py-16 text-center">
          <p className="text-[#666]">Order not found</p>
          <Link to="/account/orders">
            <Button className="mt-6 bg-brand-blue">View My Orders</Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <main className="flex-1 section-container py-16 text-center">
          <p className="text-[#666]">Loading order details...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !data?.order) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <main className="flex-1 section-container py-16 text-center">
          <p className="text-red-600 mb-6">Failed to load order details</p>
          <Link to="/account/orders">
            <Button variant="outline">View My Orders</Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const order = data.order;
  const estimatedDelivery = new Date(
    new Date(order.createdAt).getTime() + 7 * 24 * 60 * 60 * 1000
  );

  const handleDownloadInvoice = () => {
    const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? "" : "http://localhost:4000");
    window.open(`${API_BASE}/api/orders/${order.id}/invoice`, "_blank");
  };

  const handleShareOrder = () => {
    if (navigator.share) {
      navigator.share({
        title: `Pawwl Order ${order.orderNumber}`,
        text: `I just placed an order on Pawwl! Total: ${formatPrice(order.total)}`,
        url: window.location.origin + `/account/orders`,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`My Pawwl Order Number is ${order.orderNumber}`);
      toast.success("Order details copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <main className="flex-1 section-container py-8 lg:py-16">
        {/* Success Message */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="bg-green-100 rounded-full p-4">
              <CheckCircle size={64} className="text-green-600" />
            </div>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-brand-dark mb-3">
            Order Placed Successfully!
          </h1>
          <p className="text-lg text-[#666]">
            Thank you for your purchase. Your order has been confirmed.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3 mb-12">
          {/* Order Number Card */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-8 text-center">
            <p className="text-[#666] text-sm mb-2">Order Number</p>
            <h2 className="text-3xl font-bold text-brand-dark mb-2">
              {order.orderNumber}
            </h2>
            <p className="text-xs text-[#999]">
              {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>

          {/* Total Card */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-8 text-center">
            <p className="text-[#666] text-sm mb-2">Total Amount</p>
            <h2 className="text-3xl font-bold text-brand-blue mb-2">
              {formatPrice(order.total)}
            </h2>
            <p className="text-xs text-[#999]">Including all taxes</p>
          </div>

          {/* Delivery Date Card */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-8 text-center">
            <p className="text-[#666] text-sm mb-2">Est. Delivery</p>
            <h2 className="text-2xl font-bold text-purple-700 mb-2">
              {estimatedDelivery.toLocaleDateString()}
            </h2>
            <p className="text-xs text-[#999]">7 business days</p>
          </div>
        </div>

        {/* Order Details */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Order Items */}
          <div className="lg:col-span-2 bg-white border border-border-design rounded-xl p-8">
            <h3 className="text-xl font-bold text-brand-dark mb-6">
              Order Details
            </h3>

            <div className="space-y-4 mb-6 pb-6 border-b border-border-design">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-brand-dark">
                      {item.productName}
                    </p>
                    <p className="text-sm text-[#666]">Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-bold text-brand-blue">
                    {formatPrice(item.lineTotal)}
                  </p>
                </div>
              ))}
            </div>

            {/* Order Status Timeline */}
            <h4 className="font-semibold text-brand-dark mb-6">Order Status</h4>
            <div className="space-y-4">
              <div className="flex gap-4 items-start">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white">
                    <CheckCircle size={24} />
                  </div>
                  <div className="w-1 h-12 bg-green-200 my-2"></div>
                </div>
                <div>
                  <p className="font-semibold text-brand-dark">Order Confirmed</p>
                  <p className="text-sm text-[#666]">
                    {new Date(order.createdAt).toLocaleDateString()} at{" "}
                    {new Date(order.createdAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-blue-300 rounded-full flex items-center justify-center text-white">
                    <Package size={24} />
                  </div>
                  <div className="w-1 h-12 bg-gray-200 my-2"></div>
                </div>
                <div>
                  <p className="font-semibold text-brand-dark">Processing</p>
                  <p className="text-sm text-[#666]">
                    Your order is being packed and prepared for shipment
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-white">
                    <Truck size={24} />
                  </div>
                  <div className="w-1 h-12 bg-gray-200 my-2"></div>
                </div>
                <div>
                  <p className="font-semibold text-brand-dark">Shipped</p>
                  <p className="text-sm text-[#666]">
                    Track your shipment (details will be sent to your email)
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-white">
                  <Home size={24} />
                </div>
                <div>
                  <p className="font-semibold text-brand-dark">Delivered</p>
                  <p className="text-sm text-[#666]">
                    Expected delivery by{" "}
                    {estimatedDelivery.toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-4">
            {/* Confirmation Card */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h4 className="font-semibold text-brand-dark mb-3">
                Confirmation Email Sent
              </h4>
              <p className="text-sm text-[#666]">
                A confirmation email has been sent to your registered email address with all order details.
              </p>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Button onClick={handleDownloadInvoice} className="w-full bg-brand-blue flex items-center gap-2">
                <Download size={18} />
                Download Invoice
              </Button>
              <Button onClick={handleShareOrder} variant="outline" className="w-full flex items-center gap-2">
                <Share2 size={18} />
                Share Order
              </Button>
              <Link to="/account/orders" className="block">
                <Button variant="outline" className="w-full">
                  View All Orders
                </Button>
              </Link>
            </div>

            {/* Info Box */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <h5 className="font-semibold text-amber-900 text-sm mb-2">
                What's Next?
              </h5>
              <ul className="text-xs text-amber-800 space-y-1">
                <li className="flex items-center gap-2"><CheckCircle size={12} /> Payment confirmed</li>
                <li className="flex items-center gap-2"><Package size={12} /> Order being prepared</li>
                <li className="flex items-center gap-2"><ArrowRight size={12} /> You'll receive tracking info</li>
                <li className="flex items-center gap-2"><Truck size={12} /> Item will be delivered soon</li>
              </ul>
            </div>

            {/* Continue Shopping */}
            <Link to="/products">
              <Button variant="outline" className="w-full">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>

        {/* Support */}
        <div className="mt-12 bg-gray-50 border border-border-design rounded-xl p-8 text-center">
          <h3 className="text-lg font-semibold text-brand-dark mb-2">
            Need Help?
          </h3>
          <p className="text-[#666] mb-4">
            If you have any questions about your order, please contact our customer support team.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:+917208813649" className="flex-1">
              <Button variant="outline" className="w-full flex items-center gap-2"><Phone size={16} /> Call Support</Button>
            </a>
            <a href={`mailto:support@pawwl.com?subject=Order Support - ${order.orderNumber}`} className="flex-1">
              <Button variant="outline" className="w-full flex items-center gap-2"><Mail size={16} /> Email Support</Button>
            </a>
            <a href="https://wa.me/917208813649" target="_blank" rel="noopener noreferrer" className="flex-1">
              <Button variant="outline" className="w-full flex items-center gap-2"><MessageCircle size={16} /> Live Chat</Button>
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrderSuccess;

