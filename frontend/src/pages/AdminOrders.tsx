import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Search, Truck } from "lucide-react";
import AdminShell from "@/components/AdminShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiRequest, ApiAdminOrder, formatPrice } from "@/lib/api";
import { toast } from "sonner";

type OrderDraft = {
  paymentStatus: ApiAdminOrder["paymentStatus"];
  fulfillmentStatus: ApiAdminOrder["fulfillmentStatus"];
  courierName?: string | null;
  trackingNumber?: string | null;
  trackingUrl?: string | null;
};

const AdminOrders = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [drafts, setDrafts] = useState<Record<string, OrderDraft>>({});

  const { data, error } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: () => apiRequest<{ orders: ApiAdminOrder[] }>("/api/admin/orders"),
    retry: false,
  });

  useEffect(() => {
    const nextDrafts: Record<string, OrderDraft> = {};

    for (const order of data?.orders ?? []) {
      nextDrafts[order.id] = {
        paymentStatus: order.paymentStatus,
        fulfillmentStatus: order.fulfillmentStatus,
        courierName: order.courierName ?? "",
        trackingNumber: order.trackingNumber ?? "",
        trackingUrl: order.trackingUrl ?? "",
      };
    }

    setDrafts(nextDrafts);
  }, [data?.orders]);

  const filteredOrders = useMemo(() => {
    const needle = search.trim().toLowerCase();
    const orders = data?.orders ?? [];

    if (!needle) return orders;

    return orders.filter((order) => {
      const haystack = [order.orderNumber, order.user.name, order.user.email, order.paymentStatus, order.fulfillmentStatus]
        .join(" ")
        .toLowerCase();
      return haystack.includes(needle);
    });
  }, [data?.orders, search]);

  const updateStatus = useMutation({
    mutationFn: ({
      id,
      paymentStatus,
      fulfillmentStatus,
      courierName,
      trackingNumber,
      trackingUrl,
    }: {
      id: string;
      paymentStatus: OrderDraft["paymentStatus"];
      fulfillmentStatus: OrderDraft["fulfillmentStatus"];
      courierName?: string | null;
      trackingNumber?: string | null;
      trackingUrl?: string | null;
    }) =>
      apiRequest(`/api/admin/orders/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ paymentStatus, fulfillmentStatus, courierName, trackingNumber, trackingUrl }),
      }),
    onSuccess: () => {
      toast.success("Order updated");
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      queryClient.invalidateQueries({ queryKey: ["admin-summary"] });
    },
    onError: (mutationError) => toast.error(mutationError instanceof Error ? mutationError.message : "Update failed"),
  });

  return (
    <AdminShell
      title="Orders"
      description="Review payments, fulfillment, and order contents with direct status control for the operations team."
      actions={
        <Button variant="outline" className="rounded-full border-slate-200 bg-white text-slate-800 hover:bg-slate-100">
          <Truck size={16} />
          Fulfillment queue
        </Button>
      }
    >
      {error && <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">Admin login required.</div>}

      <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="relative">
          <Search size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search order number, customer, or status"
            className="pl-10"
          />
        </div>
      </div>

      <div className="mt-6 grid gap-4">
        {filteredOrders.map((order) => {
          const draft = drafts[order.id] ?? {
            paymentStatus: order.paymentStatus,
            fulfillmentStatus: order.fulfillmentStatus,
            courierName: order.courierName ?? "",
            trackingNumber: order.trackingNumber ?? "",
            trackingUrl: order.trackingUrl ?? "",
          };

          const address = order.addressSnapshot as Record<string, unknown>;
          const itemCount = order.items.reduce((total, item) => total + item.quantity, 0);

          return (
            <div key={order.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                <div className="max-w-3xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-semibold text-slate-950">{order.orderNumber}</h2>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">{itemCount} items</span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="rounded-full text-xs h-7 border-slate-200 bg-white hover:bg-slate-100 text-slate-700"
                      onClick={() => {
                        const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";
                        window.open(`${API_BASE}/api/orders/${order.id}/invoice`, '_blank');
                      }}
                    >
                      Print Invoice
                    </Button>
                  </div>
                  <p className="mt-1 text-sm text-slate-600">
                    {order.user.name} · {order.user.email}
                  </p>
                  <div className="mt-3 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
                    <p>
                      <span className="font-medium text-slate-800">Payment:</span> {order.paymentStatus}
                    </p>
                    <p>
                      <span className="font-medium text-slate-800">Fulfillment:</span> {order.fulfillmentStatus}
                    </p>
                    <p>
                      <span className="font-medium text-slate-800">Subtotal:</span> {formatPrice(order.subtotal)}
                    </p>
                    <p>
                      <span className="font-medium text-slate-800">Total:</span> {formatPrice(order.total)}
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4 text-right">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Total</p>
                  <p className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">{formatPrice(order.total)}</p>
                </div>
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-[1fr_1fr_auto]">
                <Select
                  value={draft.paymentStatus}
                  onValueChange={(value) =>
                    setDrafts((current) => ({
                      ...current,
                      [order.id]: { ...draft, paymentStatus: value as OrderDraft["paymentStatus"] },
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Payment status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="refunded">Refunded</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={draft.fulfillmentStatus}
                  onValueChange={(value) =>
                    setDrafts((current) => ({
                      ...current,
                      [order.id]: { ...draft, fulfillmentStatus: value as OrderDraft["fulfillmentStatus"] },
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Fulfillment status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="out_for_delivery">Out for delivery</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  className="rounded-full bg-slate-950 text-white hover:bg-slate-800"
                  disabled={updateStatus.isPending}
                  onClick={() =>
                    updateStatus.mutate({
                      id: order.id,
                      paymentStatus: draft.paymentStatus,
                      fulfillmentStatus: draft.fulfillmentStatus,
                      courierName: draft.courierName,
                      trackingNumber: draft.trackingNumber,
                      trackingUrl: draft.trackingUrl,
                    })
                  }
                >
                  Save Status & Tracking
                </Button>
              </div>

              <details className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <summary className="cursor-pointer list-none font-medium text-slate-950">Order details, tracking & address</summary>
                <div className="mt-4 space-y-4">
                  {/* Courier tracking section */}
                  <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm space-y-3">
                    <p className="font-semibold text-slate-950">Courier & Tracking Settings</p>
                    <div className="grid gap-3 sm:grid-cols-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Courier Name</label>
                        <Input 
                          placeholder="e.g. FedEx, BlueDart" 
                          value={draft.courierName ?? ""} 
                          onChange={(e) => setDrafts(curr => ({
                            ...curr,
                            [order.id]: { ...draft, courierName: e.target.value }
                          }))}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Tracking Number</label>
                        <Input 
                          placeholder="e.g. AW1298402" 
                          value={draft.trackingNumber ?? ""} 
                          onChange={(e) => setDrafts(curr => ({
                            ...curr,
                            [order.id]: { ...draft, trackingNumber: e.target.value }
                          }))}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Tracking URL</label>
                        <Input 
                          placeholder="e.g. https://fedex.com/track..." 
                          value={draft.trackingUrl ?? ""} 
                          onChange={(e) => setDrafts(curr => ({
                            ...curr,
                            [order.id]: { ...draft, trackingUrl: e.target.value }
                          }))}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 lg:grid-cols-[1.4fr_0.8fr]">
                    <div className="space-y-3">
                      {order.items.map((item) => (
                        <div key={item.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="font-medium text-slate-950">{item.productName}</p>
                              <p className="text-sm text-slate-600">
                                {item.variantName}
                                {item.sku ? ` · ${item.sku}` : ""}
                              </p>
                            </div>
                            <p className="text-sm font-medium text-slate-950">
                              {item.quantity} × {formatPrice(item.unitPrice)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
                      <p className="font-medium text-slate-950">Delivery address</p>
                      <p className="mt-2">{String(address.fullName ?? "")}</p>
                      <p>{String(address.line1 ?? "")}</p>
                      {address.line2 && <p>{String(address.line2)}</p>}
                      <p>
                        {String(address.city ?? "")}, {String(address.state ?? "")}
                      </p>
                      <p>
                        {String(address.postalCode ?? "")}, {String(address.country ?? "")}
                      </p>
                    </div>
                  </div>
                </div>
              </details>
            </div>
          );
        })}

        {!filteredOrders.length && <p className="text-sm text-slate-500">No matching orders found.</p>}
      </div>
    </AdminShell>
  );
};

export default AdminOrders;