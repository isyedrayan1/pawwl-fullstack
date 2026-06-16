import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import { toast } from "sonner";
import AccountLayout from "@/components/AccountLayout";
import { Button } from "@/components/ui/button";
import { apiRequest, formatPrice } from "@/lib/api";
import {
  CheckCircle,
  Package,
  Truck,
  Download,
  ArrowLeft,
  ShoppingBag,
  Info,
  Star,
  MessageSquare
} from "lucide-react";

type Order = {
  id: string;
  orderNumber: string;
  total: string | number;
  paymentStatus: string;
  fulfillmentStatus: string;
  createdAt: string;
  notes?: string | null;
  items: {
    id: string;
    productName: string;
    quantity: number;
    lineTotal: string | number;
  }[];
};

const getStatusIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case "processing":
      return <Package size={20} className="text-blue-500" />;
    case "shipped":
      return <Truck size={20} className="text-purple-500" />;
    case "delivered":
      return <CheckCircle size={20} className="text-green-500" />;
    case "cancelled":
      return <Info size={20} className="text-red-500" />;
    default:
      return <ShoppingBag size={20} className="text-gray-400" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "processing":
      return "bg-blue-100 text-blue-700";
    case "shipped":
      return "bg-purple-100 text-purple-700";
    case "delivered":
      return "bg-green-100 text-green-700";
    case "cancelled":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const AccountOrderDetail = () => {
  const { id } = useParams<{ id: string }>();

  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewProductId, setReviewProductId] = useState("");
  const [reviewProductName, setReviewProductName] = useState("");
  const [rating, setRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const submitReview = async () => {
    if (!rating || rating < 1 || rating > 5) return toast.error("Please select a rating");
    setIsSubmittingReview(true);
    try {
      await apiRequest(`/api/orders/${id}/reviews`, {
        method: "POST",
        body: JSON.stringify({
          productId: reviewProductId,
          rating,
          title: reviewTitle,
          comment: reviewComment,
        }),
      });
      toast.success("Review submitted successfully! Thank you.");
      setReviewModalOpen(false);
      setReviewComment("");
      setReviewTitle("");
      setRating(5);
    } catch (err: any) {
      toast.error(err.message || "Could not submit review");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["order", id],
    queryFn: () =>
      id
        ? apiRequest<{ order: Order }>(`/api/orders/${id}`)
        : Promise.reject(new Error("No order ID provided")),
    enabled: !!id,
    retry: false,
  });

  if (isLoading) {
    return (
      <AccountLayout>
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-[#666]">Loading order details...</p>
        </div>
      </AccountLayout>
    );
  }

  if (error || !data?.order) {
    return (
      <AccountLayout>
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
          <p className="text-red-600 mb-4">Failed to load order details. It might not exist or you don't have access to it.</p>
          <Link to="/account/orders">
            <Button variant="outline">Back to My Orders</Button>
          </Link>
        </div>
      </AccountLayout>
    );
  }

  const order = data.order;

  return (
    <AccountLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link to="/account/orders" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft size={20} className="text-[#666]" />
          </Link>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-brand-dark">Order {order.orderNumber}</h1>
            <p className="text-[#666] text-sm mt-1">
              Placed on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
            </p>
          </div>
        </div>

        {/* Cancellation Notice if any */}
        {order.fulfillmentStatus.toLowerCase() === "cancelled" && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <div className="flex gap-3">
              <Info className="text-red-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-red-900 mb-1">Order Cancelled</h4>
                <p className="text-sm text-red-800">
                  {order.notes ? order.notes : "This order has been cancelled by the administrative team or automatically by the system."}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Status Card */}
        <div className="bg-white border border-border-design rounded-xl p-6">
          <div className="flex items-center gap-2 mb-6 pb-6 border-b border-border-design">
            {getStatusIcon(order.fulfillmentStatus)}
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.fulfillmentStatus)}`}>
              {order.fulfillmentStatus}
            </span>
            <span className="text-xs text-[#999] ml-auto">
              Payment: {order.paymentStatus}
            </span>
          </div>

          <div className="grid sm:grid-cols-2 gap-8">
            <div>
              <p className="text-xs font-bold text-[#666] uppercase tracking-wider mb-2">Order Items</p>
              <div className="space-y-3">
                {order.items.map((item: any) => (
                  <div key={item.id} className="flex flex-col gap-2 pb-3 border-b border-border-design last:border-0">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-brand-dark">
                        {item.quantity}x {item.productName}
                      </span>
                      <span className="font-semibold text-brand-dark">
                        {formatPrice(item.lineTotal)}
                      </span>
                    </div>
                    {order.fulfillmentStatus.toLowerCase() === "delivered" && (
                      <Button
                        variant="link"
                        className="text-brand-blue p-0 h-auto self-start text-xs flex items-center gap-1"
                        onClick={() => {
                          setReviewProductId(item.productId);
                          setReviewProductName(item.productName);
                          setReviewModalOpen(true);
                        }}
                      >
                        <MessageSquare size={12} /> Leave a Review
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="sm:text-right border-t sm:border-t-0 sm:border-l border-border-design pt-4 sm:pt-0 sm:pl-8">
              <p className="text-xs font-bold text-[#666] uppercase tracking-wider mb-2">Order Total</p>
              <p className="text-3xl font-bold text-brand-blue">
                {formatPrice(order.total)}
              </p>
              <Button
                variant="outline"
                className="mt-4 w-full sm:w-auto"
                onClick={() => {
                  const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? "" : "http://localhost:4000");
                  window.open(`${API_BASE}/api/orders/${order.id}/invoice`, "_blank");
                }}
              >
                <Download size={16} className="mr-2" />
                Download Invoice
              </Button>
            </div>
          </div>
        </div>
      </div>

      {reviewModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl">
            <h3 className="text-xl font-bold text-brand-dark mb-2">Leave a Review</h3>
            <p className="text-[#666] text-sm mb-6">Review your purchase of: <strong className="text-brand-dark">{reviewProductName}</strong></p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className="focus:outline-none transition-transform hover:scale-110"
                    >
                      <Star
                        size={28}
                        className={star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                      />
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold mb-2">Review Title (Optional)</label>
                <input 
                  type="text" 
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  className="w-full border border-border-design rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  placeholder="Summarize your experience..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Review Details</label>
                <textarea 
                  rows={4}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="w-full border border-border-design rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  placeholder="What did you like or dislike about this product?"
                ></textarea>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button 
                variant="outline" 
                className="flex-1" 
                onClick={() => setReviewModalOpen(false)}
                disabled={isSubmittingReview}
              >
                Cancel
              </Button>
              <Button 
                className="flex-1 bg-brand-blue text-white" 
                onClick={submitReview}
                disabled={isSubmittingReview}
              >
                {isSubmittingReview ? "Submitting..." : "Submit Review"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </AccountLayout>
  );
};

export default AccountOrderDetail;
