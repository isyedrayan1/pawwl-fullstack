import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Search, RefreshCw, ClipboardList, CheckCircle, XCircle } from "lucide-react";
import AdminShell from "@/components/AdminShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiRequest, ApiReturnRequest, formatPrice } from "@/lib/api";
import { toast } from "sonner";

const AdminReturns = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");

  const { data, error } = useQuery({
    queryKey: ["admin-returns"],
    queryFn: () => apiRequest<{ returns: ApiReturnRequest[] }>("/api/admin/returns"),
    retry: false,
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: ApiReturnRequest["status"] }) =>
      apiRequest(`/api/admin/returns/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      }),
    onSuccess: () => {
      toast.success("Return status updated");
      queryClient.invalidateQueries({ queryKey: ["admin-returns"] });
      queryClient.invalidateQueries({ queryKey: ["admin-summary"] });
    },
    onError: (mutationError) => toast.error(mutationError instanceof Error ? mutationError.message : "Update failed"),
  });

  const filteredReturns = (data?.returns ?? []).filter((r) => {
    const needle = search.trim().toLowerCase();
    if (!needle) return true;
    return (
      r.order.orderNumber.toLowerCase().includes(needle) ||
      r.order.user.name.toLowerCase().includes(needle) ||
      r.reason.toLowerCase().includes(needle) ||
      r.status.toLowerCase().includes(needle)
    );
  });

  const getStatusColor = (status: ApiReturnRequest["status"]) => {
    switch (status) {
      case "pending":
        return "bg-amber-50 text-amber-700 border border-amber-200";
      case "approved":
        return "bg-blue-50 text-blue-700 border border-blue-200";
      case "rejected":
        return "bg-rose-50 text-rose-700 border border-rose-200";
      case "completed":
        return "bg-green-50 text-green-700 border border-green-200";
      default:
        return "bg-slate-50 text-slate-700 border border-slate-200";
    }
  };

  return (
    <AdminShell
      title="Return Requests"
      description="Inspect customer product refund applications, review reasoning, and approve, reject, or mark returns as completed."
    >
      {error && <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">Admin login required.</div>}

      <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="relative">
          <Search size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search returns by order number, customer, or reason" className="pl-10" />
        </div>
      </div>

      <div className="mt-6 grid gap-4">
        {filteredReturns.map((req) => {
          const formattedDate = new Intl.DateTimeFormat("en-IN", {
            dateStyle: "medium",
            timeStyle: "short",
          }).format(new Date(req.createdAt));

          return (
            <div key={req.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-xl bg-slate-100 p-2 text-slate-700 shrink-0">
                      <RefreshCw size={16} />
                    </span>
                    <h2 className="text-lg font-bold text-slate-950">{req.order.orderNumber}</h2>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${getStatusColor(req.status)}`}>
                      {req.status}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">
                    <span className="font-semibold text-slate-800">Customer:</span> {req.order.user.name} ({req.order.user.email})
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    <span className="font-semibold text-slate-800">Refund Amount:</span> {formatPrice(req.order.total)} (GST snapshot: {formatPrice(Number(req.order.total) - Number(req.order.subtotal))} tax inclusive)
                  </p>
                  <p className="mt-2 text-sm text-slate-600 bg-slate-50 border border-slate-100 rounded-2xl p-3 max-w-2xl">
                    <span className="font-semibold text-slate-800 block mb-1">Reason for Return request:</span>
                    {req.reason}
                  </p>
                  <p className="mt-3 text-xs text-slate-400">Filed on {formattedDate}</p>
                </div>

                {req.status !== "completed" && req.status !== "rejected" && (
                  <div className="flex flex-wrap gap-2 pt-2 lg:pt-0 shrink-0">
                    {req.status === "pending" && (
                      <>
                        <Button
                          type="button"
                          variant="outline"
                          className="rounded-full border-slate-200 text-xs font-semibold hover:bg-slate-50 flex items-center gap-1 bg-white text-slate-700"
                          disabled={updateStatus.isPending}
                          onClick={() => updateStatus.mutate({ id: req.id, status: "approved" })}
                        >
                          <CheckCircle size={14} className="text-blue-500" />
                          Approve Return
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          className="rounded-full border-slate-200 text-xs font-semibold hover:bg-slate-50 flex items-center gap-1 bg-white text-rose-600"
                          disabled={updateStatus.isPending}
                          onClick={() => updateStatus.mutate({ id: req.id, status: "rejected" })}
                        >
                          <XCircle size={14} />
                          Reject
                        </Button>
                      </>
                    )}
                    {req.status === "approved" && (
                      <Button
                        type="button"
                        className="rounded-full bg-slate-950 text-white hover:bg-slate-800 text-xs font-semibold flex items-center gap-1 px-4"
                        disabled={updateStatus.isPending}
                        onClick={() => updateStatus.mutate({ id: req.id, status: "completed" })}
                      >
                        <CheckCircle size={14} className="text-green-400" />
                        Complete Refund
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {!filteredReturns.length && <p className="text-sm text-slate-500">No return requests found.</p>}
      </div>
    </AdminShell>
  );
};

export default AdminReturns;
