import React from "react";
import { useQuery } from "@tanstack/react-query";
import AccountLayout from "@/components/AccountLayout";
import { apiRequest, ApiUser, formatPrice } from "@/lib/api";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingBag, MapPin, CreditCard, ChevronRight, Heart } from "lucide-react";

type Order = {
  id: string;
  orderNumber: string;
  total: string | number;
  paymentStatus: string;
  fulfillmentStatus: string;
  createdAt: string;
  items: { id: string; productName: string; quantity: number; lineTotal: string | number }[];
};

type Address = {
  id: string;
  fullName: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  phone: string;
  isDefault: boolean;
};

const Account = () => {
  const userQuery = useQuery({
    queryKey: ["me"],
    queryFn: () => apiRequest<{ user: ApiUser }>("/api/auth/me"),
    retry: false,
  });

  const ordersQuery = useQuery({
    queryKey: ["orders"],
    queryFn: () => apiRequest<{ orders: Order[] }>("/api/orders"),
    retry: false,
  });

  const addressesQuery = useQuery({
    queryKey: ["addresses"],
    queryFn: () => apiRequest<{ addresses: Address[] }>("/api/addresses"),
    retry: false,
  });

  const recentOrders = ordersQuery.data?.orders?.slice(0, 3) || [];
  const totalSpent = ordersQuery.data?.orders?.reduce((sum, order) => {
    return sum + (typeof order.total === "string" ? parseFloat(order.total) : order.total);
  }, 0) || 0;
  const addressCount = addressesQuery.data?.addresses?.length || 0;

  return (
    <AccountLayout>
      <div className="space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-brand-light to-brand-light/50 rounded-xl p-6 border border-border-design">
            <ShoppingBag size={32} className="text-brand-blue mb-3" />
            <p className="text-[#666] text-sm font-medium">Total Orders</p>
            <p className="text-2xl font-bold text-brand-dark mt-1">
              {ordersQuery.data?.orders?.length || 0}
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl p-6 border border-border-design">
            <CreditCard size={32} className="text-blue-600 mb-3" />
            <p className="text-[#666] text-sm font-medium">Total Spent</p>
            <p className="text-2xl font-bold text-brand-dark mt-1">
              {formatPrice(totalSpent)}
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-100 to-green-50 rounded-xl p-6 border border-border-design">
            <MapPin size={32} className="text-green-600 mb-3" />
            <p className="text-[#666] text-sm font-medium">Saved Addresses</p>
            <p className="text-2xl font-bold text-brand-dark mt-1">{addressCount}</p>
          </div>

          <div className="bg-gradient-to-br from-purple-100 to-purple-50 rounded-xl p-6 border border-border-design">
            <Heart size={32} className="text-purple-600 mb-3" />
            <p className="text-[#666] text-sm font-medium">Wishlist Items</p>
            <p className="text-2xl font-bold text-brand-dark mt-1">0</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link to="/products" className="flex-1">
            <Button className="w-full bg-brand-blue hover:bg-brand-accent">
              Start Shopping
            </Button>
          </Link>
          <Link to="/account/orders" className="flex-1">
            <Button variant="outline" className="w-full">
              View All Orders
            </Button>
          </Link>
          <Link to="/account/addresses" className="flex-1">
            <Button variant="outline" className="w-full">
              Manage Addresses
            </Button>
          </Link>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl border border-border-design overflow-hidden">
          <div className="bg-gray-50 p-6 border-b border-border-design flex items-center justify-between">
            <h3 className="text-xl font-bold text-brand-dark">Recent Orders</h3>
            <Link to="/account/orders" className="text-brand-blue hover:text-brand-accent flex items-center gap-1">
              View All <ChevronRight size={16} />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="p-12 text-center">
              <ShoppingBag size={48} className="mx-auto text-[#ccc] mb-4" />
              <p className="text-[#666] mb-4">You haven't placed any orders yet.</p>
              <Link to="/products">
                <Button className="bg-brand-blue">
                  Start Shopping
                </Button>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-border-design">
              {recentOrders.map((order) => (
                <Link key={order.id} to={`/account/orders/${order.id}`} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <p className="font-semibold text-brand-dark">{order.orderNumber}</p>
                      <p className="text-sm text-[#666] mt-1">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                      <div className="mt-2 space-y-1">
                        {order.items.slice(0, 2).map((item) => (
                          <p key={item.id} className="text-sm text-[#666]">
                            {item.quantity}x {item.productName}
                          </p>
                        ))}
                        {order.items.length > 2 && (
                          <p className="text-sm text-[#666]">
                            +{order.items.length - 2} more items
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-brand-blue text-lg">
                        {formatPrice(order.total)}
                      </p>
                      <p className="text-xs font-semibold text-white bg-green-500 px-3 py-1 rounded-full mt-2 inline-block">
                        {order.fulfillmentStatus}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </AccountLayout>
  );
};

export default Account;
