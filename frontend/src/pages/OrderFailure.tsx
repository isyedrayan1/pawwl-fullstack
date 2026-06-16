import React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { apiRequest, formatPrice } from "@/lib/api";
import {
  XCircle,
  AlertTriangle,
  CreditCard,
  ShoppingBag,
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

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if ((window as any).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const OrderFailure = () => {
  const [params] = useSearchParams();
  const orderId = params.get("order");
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["order", orderId],
    queryFn: () =>
      orderId
        ? apiRequest<{ order: Order }>(`/api/orders/${orderId}`)
        : Promise.reject(new Error("No order ID provided")),
    enabled: !!orderId,
    retry: false,
  });

  const { data: meData } = useQuery({
    queryKey: ["me"],
    queryFn: () => apiRequest<{ user: any }>("/api/auth/me"),
    retry: false,
  });

  const retryPayment = async () => {
    if (!data?.order) return;
    const order = data.order;
    try {
      toast.loading("Preparing payment gateway...");

      // 1. Fetch Razorpay configuration
      const config = await apiRequest<{ keyId: string | null; mode: string }>("/api/payments/razorpay/config");

      // 2. Request backend to create/fetch Razorpay order
      const rzpOrder = await apiRequest<{
        provider: string;
        orderId: string;
        amount: number | string;
        currency: string;
      }>("/api/payments/razorpay/create-order", {
        method: "POST",
        body: JSON.stringify({ orderId: order.id }),
      });

      toast.dismiss();

      // Demo Mode Fallback
      if (rzpOrder.provider === "demo") {
        toast.info("Demo Mode: Completing payment simulation...");
        const verifyResult = await apiRequest<{ success: boolean }>("/api/payments/razorpay/verify", {
          method: "POST",
          body: JSON.stringify({
            orderId: order.id,
            providerOrderId: rzpOrder.orderId,
          }),
        });

        if (verifyResult.success) {
          queryClient.invalidateQueries({ queryKey: ["cart"] });
          toast.success("Order placed and payment simulated successfully!");
          navigate(`/order-success?order=${order.id}`);
        } else {
          toast.error("Failed to complete demo payment simulation.");
        }
        return;
      }

      // Real Razorpay Standard checkout
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        toast.error("Could not load Razorpay SDK.");
        return;
      }

      const options = {
        key: config.keyId,
        amount: Math.round(Number(rzpOrder.amount) * 100), // amount in paise
        currency: rzpOrder.currency || "INR",
        name: "Pawwl",
        description: `Payment for Order #${order.orderNumber}`,
        order_id: rzpOrder.orderId,
        handler: async function (response: any) {
          try {
            toast.loading("Verifying payment...");
            const verifyResult = await apiRequest<{ success: boolean }>("/api/payments/razorpay/verify", {
              method: "POST",
              body: JSON.stringify({
                orderId: order.id,
                providerOrderId: response.razorpay_order_id,
                providerPaymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
              }),
            });
            toast.dismiss();

            if (verifyResult.success) {
              queryClient.invalidateQueries({ queryKey: ["cart"] });
              toast.success("Payment verified! Order completed successfully.");
              navigate(`/order-success?order=${order.id}`);
            } else {
              toast.error("Payment verification failed.");
            }
          } catch (err: any) {
            toast.dismiss();
            toast.error(err.message || "Payment verification failed.");
          }
        },
        prefill: {
          name: meData?.user?.name || "",
          email: meData?.user?.email || "",
        },
        theme: {
          color: "#134e86",
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", function (response: any) {
        toast.error(`Payment failed: ${response.error.description}`);
      });
      rzp.open();
    } catch (err: any) {
      toast.dismiss();
      toast.error(err.message || "Could not initialize Razorpay checkout");
    }
  };

  if (!orderId) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <main className="flex-1 section-container py-16 text-center">
          <p className="text-[#666]">Order not found</p>
          <Link to="/products">
            <Button className="mt-6 bg-brand-blue">Shop Products</Button>
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

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <main className="flex-1 section-container py-8 lg:py-16">
        {/* Error Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="bg-red-100 rounded-full p-4 animate-bounce">
              <XCircle size={64} className="text-red-600" />
            </div>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-brand-dark mb-3">
            Payment Transaction Failed
          </h1>
          <p className="text-lg text-[#666] max-w-2xl mx-auto">
            We couldn't process your payment. Don't worry, your order has been saved as **Pending** under your account profile, and no money was deducted.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3 mb-12">
          {/* Order Number Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 text-center shadow-sm">
            <p className="text-[#666] text-sm mb-2">Order Number</p>
            <h2 className="text-3xl font-bold text-brand-dark mb-2">
              {order.orderNumber}
            </h2>
            <p className="text-xs text-[#999]">
              {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>

          {/* Amount Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 text-center shadow-sm">
            <p className="text-[#666] text-sm mb-2">Total Amount</p>
            <h2 className="text-3xl font-bold text-brand-blue mb-2">
              {formatPrice(order.total)}
            </h2>
            <p className="text-xs text-[#999]">Including GST tax</p>
          </div>

          {/* Status Card */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-8 text-center shadow-sm">
            <p className="text-[#666] text-sm mb-2">Payment Status</p>
            <h2 className="text-2xl font-bold text-amber-700 mb-2 uppercase tracking-wide">
              {order.paymentStatus}
            </h2>
            <p className="text-xs text-amber-600">Pending payment authorization</p>
          </div>
        </div>

        {/* Failure & Retry panel */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Items */}
          <div className="lg:col-span-2 bg-white border border-border-design rounded-xl p-8 shadow-sm">
            <h3 className="text-xl font-bold text-brand-dark mb-6">
              Saved Items
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

            <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex items-start gap-4">
              <AlertTriangle className="text-red-600 shrink-0 mt-1" size={24} />
              <div>
                <h4 className="font-semibold text-red-900 mb-1">Common Payment Failure Reasons</h4>
                <ul className="text-sm text-red-800 list-disc pl-5 space-y-1">
                  <li>Checkout pop-up modal was closed before completing the authorization</li>
                  <li>Incorrect card details, CVV code, or OTP validation password</li>
                  <li>Insufficient funds in the selected bank account/card</li>
                  <li>Bank servers timed out or refused the external authorization</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Quick Actions Panel */}
          <div className="space-y-6">
            <div className="bg-brand-dark text-white rounded-xl p-6 shadow-md">
              <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <CreditCard size={20} />
                Complete Payment Now
              </h4>
              <p className="text-sm text-[#ccc] mb-6">
                You can retry completing the secure payment right now to finalize the order.
              </p>
              <Button
                onClick={retryPayment}
                className="w-full bg-brand-blue hover:bg-brand-blue/90 text-white font-bold h-12 flex items-center justify-center gap-2 rounded-lg"
              >
                RETRY PAYMENT
                <ArrowRight size={20} />
              </Button>
            </div>

            <div className="space-y-3">
              <Link to="/account/orders" className="block">
                <Button variant="outline" className="w-full h-11 flex items-center justify-center gap-2">
                  <ShoppingBag size={18} />
                  Go to My Orders
                </Button>
              </Link>
              <Link to="/products" className="block">
                <Button variant="ghost" className="w-full h-11">
                  Continue Shopping
                </Button>
              </Link>
            </div>

            {/* Support */}
            <div className="bg-gray-50 border border-border-design rounded-xl p-6 text-center">
              <h4 className="font-semibold text-brand-dark mb-2">Need Assistance?</h4>
              <p className="text-xs text-[#666] mb-4">
                If the amount was deducted from your account, please do not retry. Contact support below.
              </p>
              <div className="grid grid-cols-3 gap-2">
                <a href="tel:+917208813649" className="text-slate-600 hover:text-brand-blue flex flex-col items-center gap-1">
                  <Phone size={18} />
                  <span className="text-[10px]">Call</span>
                </a>
                <a href={`mailto:support@pawwl.com?subject=Payment Failed Order - ${order.orderNumber}`} className="text-slate-600 hover:text-brand-blue flex flex-col items-center gap-1">
                  <Mail size={18} />
                  <span className="text-[10px]">Email</span>
                </a>
                <a href="https://wa.me/917208813649" target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-brand-blue flex flex-col items-center gap-1">
                  <MessageCircle size={18} />
                  <span className="text-[10px]">Chat</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrderFailure;
