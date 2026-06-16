import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ShieldCheck, ShieldOff, Search, Download } from "lucide-react";
import AdminShell from "@/components/AdminShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiRequest, ApiAdminUser } from "@/lib/api";
import { toast } from "sonner";

const money = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

const AdminUsers = () => {
  const queryClient = useQueryClient();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "disabled">("all");

  const { data, error } = useQuery({
    queryKey: ["admin-users", query, statusFilter],
    queryFn: () =>
      apiRequest<{ users: ApiAdminUser[] }>(
        `/api/admin/users?${new URLSearchParams({
          ...(query ? { q: query } : {}),
          ...(statusFilter === "all" ? {} : { status: statusFilter }),
        }).toString()}`,
      ),
    retry: false,
  });

  const toggleStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: "active" | "disabled" }) =>
      apiRequest(`/api/admin/users/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      }),
    onSuccess: () => {
      toast.success("User updated");
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      queryClient.invalidateQueries({ queryKey: ["admin-summary"] });
    },
    onError: (mutationError) => toast.error(mutationError instanceof Error ? mutationError.message : "Update failed"),
  });

  return (
    <AdminShell
      title="Users"
      description="Inspect customer accounts, activity counts, and quickly disable or restore access when needed."
      actions={
        <Button variant="outline" className="rounded-full border-slate-200 bg-white text-slate-800 hover:bg-slate-100 hover:text-slate-900" onClick={() => window.open("/api/admin/export/users", "_blank")}>
          <Download size={16} />
          Export to Excel
        </Button>
      }
    >
      {error && <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">Admin login required.</div>}

      <div className="grid gap-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[1fr_220px]">
        <div className="relative">
          <Search size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by name, email, or phone" className="pl-10" />
        </div>
        <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as typeof statusFilter)}>
          <SelectTrigger>
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All users</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="disabled">Disabled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mt-6 grid gap-4">
        {data?.users.map((user) => {
          const canDisable = user.status === "active";

          return (
            <div key={user.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-semibold text-slate-950">{user.name}</h2>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">{user.status}</span>
                  </div>
                  <p className="mt-1 text-sm text-slate-600">{user.email}</p>
                  {user.phone && <p className="mt-1 text-sm text-slate-600">{user.phone}</p>}
                </div>

                <div className="flex flex-wrap gap-2 text-sm text-slate-600">
                  <span className="rounded-full bg-slate-100 px-3 py-1">{user.orderCount ?? 0} orders</span>
                  <span className="rounded-full bg-slate-100 px-3 py-1">{user.addressCount ?? 0} addresses</span>
                  <span className="rounded-full bg-slate-100 px-3 py-1">{user.sessionCount ?? 0} sessions</span>
                  <span className="rounded-full bg-slate-100 px-3 py-1">{money.format(Number(user.walletBalance ?? 0))} wallet</span>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <Button
                  variant={canDisable ? "destructive" : "secondary"}
                  className={`rounded-full ${!canDisable ? "text-black" : ""}`}
                  disabled={toggleStatus.isPending}
                  onClick={() => toggleStatus.mutate({ id: user.id, status: canDisable ? "disabled" : "active" })}
                >
                  {canDisable ? <ShieldOff size={16} /> : <ShieldCheck size={16} />}
                  {canDisable ? "Disable user" : "Restore access"}
                </Button>
                <p className="text-sm text-slate-500">Created {user.createdAt ? new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(new Date(user.createdAt)) : "recently"}</p>
              </div>
            </div>
          );
        })}
        {!data?.users.length && <p className="text-sm text-slate-500">No matching users found.</p>}
      </div>
    </AdminShell>
  );
};

export default AdminUsers;