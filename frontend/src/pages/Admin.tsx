import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Banknote, Package, ReceiptText, Users, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import AdminShell from "@/components/AdminShell";
import { apiRequest, ApiAdminSummary, formatPrice } from "@/lib/api";
import { adminPath } from "@/lib/routes";

const parseMetadata = (metadata?: string | null) => {
  if (!metadata) return null;

  try {
    return JSON.parse(metadata) as Record<string, unknown>;
  } catch {
    return { value: metadata };
  }
};

const Admin = () => {
  const { data, error } = useQuery({
    queryKey: ["admin-summary"],
    queryFn: () => apiRequest<ApiAdminSummary>("/api/admin/summary"),
    retry: false,
  });

  const summary = data?.summary;

  return (
    <AdminShell
      title="Dashboard"
      description="Operational visibility for orders, products, stock, and admin activity."
      actions={
        <>
          <Button asChild variant="outline" className="rounded-full border-slate-200 bg-white text-slate-800 hover:bg-slate-100">
            <Link to={adminPath("/products")}>
              Products <ArrowRight size={16} />
            </Link>
          </Button>
          <Button asChild className="rounded-full bg-slate-950 text-white hover:bg-slate-800">
            <Link to={adminPath("/orders")}>
              Orders <ArrowRight size={16} />
            </Link>
          </Button>
        </>
      }
    >
      {error && <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">Admin data could not be loaded.</div>}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {[
          { label: "Products", value: summary?.productsTotal ?? 0, icon: Package, hint: `${summary?.publishedProducts ?? 0} published / ${summary?.draftProducts ?? 0} draft` },
          { label: "Orders in motion", value: (summary?.pendingOrders ?? 0) + (summary?.processingOrders ?? 0), icon: ReceiptText, hint: `${summary?.deliveredOrders ?? 0} delivered` },
          { label: "Revenue", value: formatPrice(summary?.revenueTotal ?? 0), icon: Banknote, hint: `${summary?.lowStockVariants ?? 0} low-stock variants` },
        ].map((item) => {
          const Icon = item.icon;

          return (
            <div key={item.label} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-500">{item.label}</p>
                  <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{item.value}</p>
                </div>
                <div className="rounded-2xl bg-slate-100 p-3 text-slate-700">
                  <Icon size={22} />
                </div>
              </div>
              <p className="mt-4 text-sm text-slate-600">{item.hint}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.3fr_0.9fr]">
        <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-slate-950">Recent Orders</h2>
              <p className="text-sm text-slate-500">Latest transactions and their current lifecycle state.</p>
            </div>
            <Link to={adminPath("/orders")} className="text-sm font-medium text-slate-700 hover:text-slate-950">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {data?.recentOrders?.map((order) => (
              <div key={order.id} className="rounded-2xl border border-slate-200 p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-semibold text-slate-950">{order.orderNumber}</p>
                    <p className="text-sm text-slate-600">{order.user.name} · {order.user.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-slate-950">{formatPrice(order.total)}</p>
                    <p className="text-sm text-slate-600">{order.paymentStatus} · {order.fulfillmentStatus}</p>
                  </div>
                </div>
              </div>
            ))}
            {!data?.recentOrders?.length && <p className="text-sm text-slate-500">No orders yet.</p>}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-slate-950">Inventory Status</h2>
              <p className="text-sm text-slate-500">Products running low on stock.</p>
            </div>
            <Link to={adminPath("/products")} className="text-sm font-medium text-slate-700 hover:text-slate-950">
              Manage inventory
            </Link>
          </div>
          <div className="space-y-3">
            {data?.lowStockVariants?.map((variant) => (
              <div key={variant.id} className="rounded-2xl border border-amber-200 bg-amber-50 p-3">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium text-amber-950">{variant.product.name}</p>
                    <p className="text-xs text-amber-900/70">{variant.name}</p>
                  </div>
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-950">
                    {variant.stock} left
                  </span>
                </div>
              </div>
            ))}
            {!data?.lowStockVariants?.length && (
              <div className="rounded-2xl border border-green-200 bg-green-50 p-4 text-center">
                <p className="text-sm text-green-700">✓ All inventory levels are healthy</p>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Recent Activity removed; Inventory Status added for business relevance */}
    </AdminShell>
  );
};

export default Admin;
