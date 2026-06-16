import { Link } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { ArrowRight, Banknote, Package, ReceiptText, Users, Activity, Plus, Tag, TrendingUp, AlertTriangle, CheckCircle, PackageOpen, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import AdminShell from "@/components/AdminShell";
import { apiRequest, ApiAdminSummary, formatPrice } from "@/lib/api";
import { adminPath } from "@/lib/routes";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const Admin = () => {
  const { data, error } = useQuery({
    queryKey: ["admin-summary"],
    queryFn: () => apiRequest<ApiAdminSummary>("/api/admin/summary"),
    retry: false,
  });

  const summary = data?.summary;

  const triggerAbandonedCarts = useMutation({
    mutationFn: () => apiRequest<{ sent: number }>("/api/admin/marketing/abandoned-carts/send", { method: "POST" }),
    onSuccess: (res) => {
      if (res.sent > 0) {
        toast.success(`Successfully sent ${res.sent} abandoned cart emails!`);
      } else {
        toast.info("No abandoned carts found right now.");
      }
    },
    onError: (err: any) => toast.error(err.message || "Failed to send emails"),
  });

  return (
    <AdminShell
      title="Command Center"
      description="Your high-level overview of store performance, pending actions, and recent activity."
    >
      {error && <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">Admin data could not be loaded.</div>}

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <Button asChild className="rounded-full bg-slate-950 text-white hover:bg-slate-800">
          <Link to={adminPath("/products")}>
            <Plus size={16} className="mr-2" />
            Add Product
          </Link>
        </Button>
        <Button asChild variant="outline" className="rounded-full border-slate-200 bg-white text-slate-800 hover:bg-slate-100 hover:text-slate-900">
          <Link to={adminPath("/coupons")}>
            <Tag size={16} className="mr-2" />
            Create Coupon
          </Link>
        </Button>
        <Button asChild variant="outline" className="rounded-full border-slate-200 bg-white text-slate-800 hover:bg-slate-100 hover:text-slate-900">
          <Link to={adminPath("/orders")}>
            <PackageOpen size={16} className="mr-2" />
            Process Orders
          </Link>
        </Button>
        <Button asChild variant="outline" className="rounded-full border-slate-200 bg-white text-brand-blue hover:bg-slate-100 hover:text-slate-900 font-semibold">
          <Link to={adminPath("/reports")}>
            <TrendingUp size={16} className="mr-2" />
            View Reports
          </Link>
        </Button>
        <Button 
          variant="outline" 
          className="rounded-full border-brand-light bg-brand-light/30 text-brand-dark hover:bg-brand-light/60 font-semibold"
          onClick={() => triggerAbandonedCarts.mutate()}
          disabled={triggerAbandonedCarts.isPending}
        >
          <ShoppingCart size={16} className="mr-2" />
          {triggerAbandonedCarts.isPending ? "Sending Emails..." : "Recover Abandoned Carts"}
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 mb-6">
        {[
          { label: "Total Revenue", value: formatPrice(summary?.revenueTotal ?? 0), icon: Banknote },
          { label: "Orders in Motion", value: (summary?.pendingOrders ?? 0) + (summary?.processingOrders ?? 0), icon: ReceiptText },
          { label: "Total Products", value: summary?.productsTotal ?? 0, icon: Package },
          { label: "Total Customers", value: summary?.usersTotal ?? 0, icon: Users },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">{item.label}</p>
                <p className="mt-1 text-2xl font-bold tracking-tight text-slate-950">{item.value}</p>
              </div>
              <div className="rounded-2xl bg-brand-light/50 p-3 text-brand-blue">
                <Icon size={22} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_350px]">
        <div className="space-y-6">
          {/* Actionable Alerts (Needs Attention) */}
          <section className="rounded-3xl border border-rose-100 bg-white p-6 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-rose-400"></div>
            <div className="mb-4 flex items-center gap-2">
              <AlertTriangle className="text-rose-500" size={20} />
              <h2 className="text-lg font-bold text-slate-950">Needs Attention</h2>
            </div>
            <div className="space-y-3">
              {(summary?.pendingOrders ?? 0) > 0 ? (
                <div className="flex items-center justify-between bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <span className="text-sm font-medium text-slate-800">{summary!.pendingOrders} Orders are pending fulfillment</span>
                  <Button asChild size="sm" className="rounded-full bg-brand-blue hover:bg-brand-dark">
                    <Link to={adminPath("/orders")}>Fulfill Now</Link>
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-3 rounded-2xl">
                  <CheckCircle size={16} /> All orders are processed!
                </div>
              )}

              {(data?.lowStockVariants?.length ?? 0) > 0 ? (
                <div className="flex items-center justify-between bg-amber-50 p-3 rounded-2xl border border-amber-100">
                  <span className="text-sm font-medium text-amber-900">{data!.lowStockVariants.length} Products are low on stock</span>
                  <Button asChild size="sm" className="rounded-full bg-amber-500 hover:bg-amber-600 text-white">
                    <Link to={adminPath("/products")}>Update Inventory</Link>
                  </Button>
                </div>
              ) : null}
            </div>
          </section>

          {/* 7-Day Revenue Mini-Chart */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-950">7-Day Revenue Trend</h2>
                <p className="text-sm text-slate-500">At-a-glance performance overview</p>
              </div>
              <Button asChild variant="outline" size="sm" className="rounded-full">
                <Link to={adminPath("/reports")}>Full Reports <ArrowRight size={14} className="ml-1" /></Link>
              </Button>
            </div>
            
            <div className="h-[250px] w-full">
              {data?.revenueTrend && data.revenueTrend.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.revenueTrend} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#1b4965" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#1b4965" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" tickFormatter={(val) => new Date(val).toLocaleDateString('en-US', { weekday: 'short' })} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                    <YAxis hide />
                    <Tooltip 
                      formatter={(value: number) => [formatPrice(value), "Revenue"]}
                      labelFormatter={(label) => new Date(label).toLocaleDateString()}
                      contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#1b4965" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-slate-400">
                  Loading trend data...
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Recent Activity Feed */}
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col h-full">
          <div className="mb-6 flex items-center gap-2">
            <Activity className="text-brand-blue" size={20} />
            <h2 className="text-lg font-bold text-slate-950">Live Activity</h2>
          </div>
          <div className="flex-1 space-y-6 overflow-y-auto">
            {data?.recentOrders?.map((order) => (
              <div key={order.id} className="relative pl-6 before:absolute before:left-[7px] before:top-2 before:h-2 before:w-2 before:rounded-full before:bg-brand-blue after:absolute after:left-[10px] after:top-5 after:bottom-[-20px] after:w-0.5 after:bg-slate-100 last:after:hidden">
                <p className="text-sm font-medium text-slate-900">
                  <span className="font-semibold">{order.user.name}</span> placed an order
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {order.orderNumber} for {formatPrice(order.total)} • {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            ))}
            
            {data?.recentUsers?.slice(0, 3).map((user) => (
              <div key={user.id} className="relative pl-6 before:absolute before:left-[7px] before:top-2 before:h-2 before:w-2 before:rounded-full before:bg-green-500 after:absolute after:left-[10px] after:top-5 after:bottom-[-20px] after:w-0.5 after:bg-slate-100 last:after:hidden">
                <p className="text-sm font-medium text-slate-900">
                  New user <span className="font-semibold">{user.name}</span> joined
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}

            {!data?.recentOrders?.length && !data?.recentUsers?.length && (
              <p className="text-sm text-slate-500 text-center py-10">No recent activity</p>
            )}
          </div>
        </section>
      </div>
    </AdminShell>
  );
};

export default Admin;
