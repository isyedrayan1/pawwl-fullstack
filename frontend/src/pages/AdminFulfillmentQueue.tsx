import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Package, Truck, CheckCircle2, ChevronRight, MapPin } from "lucide-react";
import AdminShell from "@/components/AdminShell";
import { Button } from "@/components/ui/button";
import { apiRequest, ApiAdminOrder } from "@/lib/api";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { adminPath } from "@/lib/routes";

const AdminFulfillmentQueue = () => {
  const queryClient = useQueryClient();

  const { data, error, isLoading } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: () => apiRequest<{ orders: ApiAdminOrder[] }>("/api/admin/orders"),
    retry: false,
    refetchInterval: 10000, // Poll every 10s for new orders
  });

  const pendingOrders = useMemo(() => {
    return (data?.orders ?? []).filter((order) => order.fulfillmentStatus === "pending").reverse(); // Oldest first
  }, [data?.orders]);

  const processOrder = useMutation({
    mutationFn: (id: string) =>
      apiRequest(`/api/admin/orders/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ fulfillmentStatus: "processing" }),
      }),
    onSuccess: () => {
      toast.success("Order marked as Processing!");
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      queryClient.invalidateQueries({ queryKey: ["admin-summary"] });
    },
    onError: (mutationError) => toast.error(mutationError instanceof Error ? mutationError.message : "Failed to process order"),
  });

  return (
    <AdminShell
      title="Fulfillment Queue"
      description="Distraction-free pick list. Pack these boxes and mark them as processing."
    >
      {error && <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">Orders could not be loaded.</div>}

      {!isLoading && pendingOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-[2.5rem] border-2 border-dashed border-slate-200 bg-slate-50 py-32 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600 mb-6">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Queue is empty!</h2>
          <p className="mt-2 text-slate-500 max-w-sm">All pending orders have been processed. Great job today!</p>
          <Button asChild variant="outline" className="mt-8 rounded-full">
            <Link to={adminPath("/orders")}>Back to All Orders</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {pendingOrders.map((order) => {
            const address = JSON.parse(order.addressSnapshot);
            return (
              <div key={order.id} className="flex flex-col overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md">
                {/* Header */}
                <div className="bg-slate-50 border-b border-slate-100 p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-slate-900">{order.orderNumber}</span>
                    <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700">
                      Pending
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-slate-500 gap-2">
                    <MapPin size={14} />
                    <span>{address.fullName} • {address.city || 'No City'}</span>
                  </div>
                </div>

                {/* Items */}
                <div className="flex-1 p-5 space-y-4">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Pick List</h4>
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-start gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-light/20 text-brand-blue font-bold">
                        {item.quantity}x
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900 leading-tight">{item.productName}</p>
                        {item.variantName && item.variantName !== "Default" && (
                          <p className="text-xs text-slate-500 mt-0.5">{item.variantName}</p>
                        )}
                        {item.sku && (
                          <p className="text-[10px] font-mono text-slate-400 mt-0.5 uppercase">SKU: {item.sku}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer Action */}
                <div className="p-5 pt-0 mt-auto">
                  <Button
                    onClick={() => processOrder.mutate(order.id)}
                    disabled={processOrder.isPending}
                    className="w-full h-12 rounded-xl bg-brand-blue hover:bg-brand-dark text-white font-semibold text-base flex items-center justify-center gap-2"
                  >
                    <Package size={18} />
                    Mark as Processed
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AdminShell>
  );
};

export default AdminFulfillmentQueue;
