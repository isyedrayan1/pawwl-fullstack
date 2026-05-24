import { useQuery } from "@tanstack/react-query";
import AccountLayout from "@/components/AccountLayout";
import { apiRequest, formatPrice } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ShoppingBag, ChevronRight, Package, Truck, CheckCircle } from "lucide-react";
import { useState } from "react";

type Order = {
  id: string;
  orderNumber: string;
  total: string | number;
  paymentStatus: string;
  fulfillmentStatus: string;
  createdAt: string;
  items: { id: string; productName: string; quantity: number; lineTotal: string | number }[];
};

const AccountOrders = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["orders"],
    queryFn: () => apiRequest<{ orders: Order[] }>("/api/orders"),
    retry: false,
  });

  const [filterStatus, setFilterStatus] = useState("all");

  const orders = data?.orders || [];
  const filteredOrders =
    filterStatus === "all"
      ? orders
      : orders.filter((order) =>
          order.fulfillmentStatus.toLowerCase().includes(filterStatus.toLowerCase())
        );

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "processing":
        return <Package size={20} className="text-blue-500" />;
      case "shipped":
        return <Truck size={20} className="text-purple-500" />;
      case "delivered":
        return <CheckCircle size={20} className="text-green-500" />;
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
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <AccountLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-brand-dark">My Orders</h1>
          <p className="text-[#666] mt-1">Track and manage all your orders</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={filterStatus === "all" ? "default" : "outline"}
            onClick={() => setFilterStatus("all")}
            className={filterStatus === "all" ? "bg-brand-blue" : ""}
          >
            All Orders ({orders.length})
          </Button>
          <Button
            variant={filterStatus === "processing" ? "default" : "outline"}
            onClick={() => setFilterStatus("processing")}
            className={filterStatus === "processing" ? "bg-brand-blue" : ""}
          >
            Processing
          </Button>
          <Button
            variant={filterStatus === "shipped" ? "default" : "outline"}
            onClick={() => setFilterStatus("shipped")}
            className={filterStatus === "shipped" ? "bg-brand-blue" : ""}
          >
            Shipped
          </Button>
          <Button
            variant={filterStatus === "delivered" ? "default" : "outline"}
            onClick={() => setFilterStatus("delivered")}
            className={filterStatus === "delivered" ? "bg-brand-blue" : ""}
          >
            Delivered
          </Button>
        </div>

        {/* Orders List */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-[#666]">Loading your orders...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12 bg-red-50 rounded-lg border border-red-200">
            <p className="text-red-600">Failed to load orders. Please login again.</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-xl border border-border-design">
            <ShoppingBag size={48} className="mx-auto text-[#ccc] mb-4" />
            <p className="text-[#666] text-lg mb-4">
              {filterStatus === "all"
                ? "You haven't placed any orders yet."
                : `No ${filterStatus} orders found.`}
            </p>
            <Link to="/products">
              <Button className="bg-brand-blue">
                Start Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white border border-border-design rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Order Header */}
                <div className="p-6 border-b border-border-design bg-gray-50">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-brand-dark">
                        {order.orderNumber}
                      </h3>
                      <p className="text-sm text-[#666] mt-1">
                        Ordered on {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-brand-blue">
                        {formatPrice(order.total)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Order Status */}
                <div className="p-6 border-b border-border-design">
                  <div className="flex items-center gap-2 mb-4">
                    {getStatusIcon(order.fulfillmentStatus)}
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.fulfillmentStatus)}`}>
                      {order.fulfillmentStatus}
                    </span>
                    <span className="text-xs text-[#999] ml-auto">
                      Payment: {order.paymentStatus}
                    </span>
                  </div>

                  {/* Status Timeline */}
                  <div className="flex items-center justify-between text-xs">
                    <div className="text-center">
                      <CheckCircle size={16} className="mx-auto text-green-500 mb-1" />
                      <p className="text-[#666]">Confirmed</p>
                    </div>
                    <div className="flex-1 h-1 bg-border-design mx-2"></div>
                    <div className="text-center">
                      <div className={`mx-auto mb-1 ${order.fulfillmentStatus.toLowerCase() !== "processing" ? "text-green-500" : "text-gray-400"}`}>
                        <Package size={16} />
                      </div>
                      <p className="text-[#666]">Processing</p>
                    </div>
                    <div className="flex-1 h-1 bg-border-design mx-2"></div>
                    <div className="text-center">
                      <div className={`mx-auto mb-1 ${["shipped", "delivered"].includes(order.fulfillmentStatus.toLowerCase()) ? "text-green-500" : "text-gray-400"}`}>
                        <Truck size={16} />
                      </div>
                      <p className="text-[#666]">Shipped</p>
                    </div>
                    <div className="flex-1 h-1 bg-border-design mx-2"></div>
                    <div className="text-center">
                      <div className={`mx-auto mb-1 ${order.fulfillmentStatus.toLowerCase() === "delivered" ? "text-green-500" : "text-gray-400"}`}>
                        <CheckCircle size={16} />
                      </div>
                      <p className="text-[#666]">Delivered</p>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6 border-b border-border-design">
                  <h4 className="font-semibold text-brand-dark mb-4">Items Ordered</h4>
                  <div className="space-y-2">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-[#666]">
                          {item.quantity}x {item.productName}
                        </span>
                        <span className="font-semibold text-brand-dark">
                          {formatPrice(item.lineTotal)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="p-6 bg-gray-50 flex flex-col sm:flex-row gap-3">
                  <Button variant="outline" className="flex-1">
                    Track Order
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Download Invoice
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Return Items
                  </Button>
                  <Button className="flex-1 bg-brand-blue">
                    View Details <ChevronRight size={16} className="ml-2" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AccountLayout>
  );
};

export default AccountOrders;
