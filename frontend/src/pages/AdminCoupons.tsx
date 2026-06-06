import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Plus, Tag, Search, Trash2, Calendar, Ban } from "lucide-react";
import AdminShell from "@/components/AdminShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { apiRequest, ApiCoupon, formatPrice } from "@/lib/api";
import { toast } from "sonner";

type CouponFormState = {
  code: string;
  discount: string;
  type: "percentage" | "fixed";
  minCartAmt: string;
  maxDiscount: string;
  expiresAt: string;
  isActive: boolean;
};

const emptyForm = (): CouponFormState => ({
  code: "",
  discount: "",
  type: "percentage",
  minCartAmt: "",
  maxDiscount: "",
  expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
  isActive: true,
});

const AdminCoupons = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [form, setForm] = useState<CouponFormState>(emptyForm());

  const { data, error } = useQuery({
    queryKey: ["admin-coupons"],
    queryFn: () => apiRequest<{ coupons: ApiCoupon[] }>("/api/admin/coupons"),
    retry: false,
  });

  const filteredCoupons = (data?.coupons ?? []).filter((c) => {
    const needle = search.trim().toLowerCase();
    if (!needle) return true;
    return c.code.toLowerCase().includes(needle) || c.type.toLowerCase().includes(needle);
  });

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyForm());
  };

  const beginEdit = (coupon: ApiCoupon) => {
    setEditingId(coupon.id);
    setForm({
      code: coupon.code,
      discount: String(coupon.discount),
      type: coupon.type,
      minCartAmt: coupon.minCartAmt == null ? "" : String(coupon.minCartAmt),
      maxDiscount: coupon.maxDiscount == null ? "" : String(coupon.maxDiscount),
      expiresAt: new Date(coupon.expiresAt).toISOString().split('T')[0],
      isActive: coupon.isActive,
    });
  };

  const saveCoupon = useMutation({
    mutationFn: () =>
      apiRequest(editingId ? `/api/admin/coupons/${editingId}` : "/api/admin/coupons", {
        method: editingId ? "PUT" : "POST",
        body: JSON.stringify({
          code: form.code,
          discount: Number(form.discount || 0),
          type: form.type,
          minCartAmt: form.minCartAmt === "" ? null : Number(form.minCartAmt),
          maxDiscount: form.maxDiscount === "" ? null : Number(form.maxDiscount),
          expiresAt: new Date(form.expiresAt).toISOString(),
          isActive: form.isActive,
        }),
      }),
    onSuccess: () => {
      toast.success(editingId ? "Coupon updated" : "Coupon created");
      resetForm();
      setIsDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["admin-coupons"] });
    },
    onError: (mutationError) => toast.error(mutationError instanceof Error ? mutationError.message : "Save failed"),
  });

  const deleteCoupon = useMutation({
    mutationFn: (id: string) =>
      apiRequest(`/api/admin/coupons/${id}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      toast.success("Coupon deleted");
      setIsDeleteDialogOpen(false);
      setDeletingId(null);
      setIsDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["admin-coupons"] });
    },
    onError: (mutationError) => {
      toast.error(mutationError instanceof Error ? mutationError.message : "Delete failed");
      setIsDeleteDialogOpen(false);
      setDeletingId(null);
    },
  });

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    saveCoupon.mutate();
  };

  const confirmDelete = (id: string) => {
    setDeletingId(id);
    setIsDeleteDialogOpen(true);
  };

  return (
    <AdminShell
      title="Coupons & Promotions"
      description="Create discount promo codes, active duration dates, min spends, and custom limits."
      actions={
        <Button className="rounded-full bg-slate-950 text-white hover:bg-slate-800" onClick={() => { resetForm(); setIsDialogOpen(true); }}>
          <Plus size={16} />
          New coupon
        </Button>
      }
    >
      {error && <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">Admin login required.</div>}

      <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="relative">
          <Search size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search coupons by code" className="pl-10" />
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
        <DialogContent className="max-w-md p-6 rounded-[2rem] border border-slate-200 bg-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-950 flex items-center gap-2">
              <span className="rounded-xl bg-slate-100 p-2 text-slate-700">
                <Tag size={18} />
              </span>
              {editingId ? "Edit Coupon" : "Create Coupon"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={submit} className="space-y-4 pt-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Coupon Code</label>
              <Input placeholder="e.g. DISCOUNT20" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} required />
            </div>

            <div className="grid gap-3 grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Discount Rate</label>
                <Input placeholder="e.g. 10" type="number" value={form.discount} onChange={(e) => setForm({ ...form, discount: e.target.value })} required />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Discount Type</label>
                <Select value={form.type} onValueChange={(val: "percentage" | "fixed") => setForm({ ...form, type: val })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage (%)</SelectItem>
                    <SelectItem value="fixed">Fixed Amount (₹)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-3 grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Min Spend (₹)</label>
                <Input placeholder="e.g. 500" type="number" value={form.minCartAmt} onChange={(e) => setForm({ ...form, minCartAmt: e.target.value })} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Max Cap (₹ - Optional)</label>
                <Input placeholder="e.g. 200" type="number" value={form.maxDiscount} onChange={(e) => setForm({ ...form, maxDiscount: e.target.value })} />
              </div>
            </div>

            <div className="grid gap-3 grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Expiration Date</label>
                <Input type="date" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} required />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Status</label>
                <Select value={form.isActive ? "true" : "false"} onValueChange={(val) => setForm({ ...form, isActive: val === "true" })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Active</SelectItem>
                    <SelectItem value="false">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter className="pt-4 border-t border-slate-100 flex flex-row items-center gap-2">
              {editingId && (
                <Button 
                  type="button" 
                  variant="destructive" 
                  className="rounded-full bg-rose-600 hover:bg-rose-700 text-white mr-auto flex items-center gap-1.5 px-4"
                  onClick={() => confirmDelete(editingId)}
                >
                  <Trash2 size={16} />
                  Delete
                </Button>
              )}
              <Button type="button" variant="outline" className="rounded-full border-slate-200" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button disabled={saveCoupon.isPending} className="rounded-full bg-slate-950 text-white hover:bg-slate-800 px-6" type="submit">
                Save
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="rounded-[2.5rem] border border-slate-200 bg-white p-6">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-bold text-slate-950">Delete Coupon</AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-slate-600">
              Are you sure you want to delete this coupon? This action cannot be undone and customers will no longer be able to use it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4 flex gap-2">
            <AlertDialogCancel className="rounded-full border-slate-200" onClick={() => { setIsDeleteDialogOpen(false); setDeletingId(null); }}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              className="rounded-full bg-rose-600 hover:bg-rose-700 text-white animate-none" 
              onClick={() => { if(deletingId) deleteCoupon.mutate(deletingId); }}
              disabled={deleteCoupon.isPending}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="mt-6 grid gap-4">
        {filteredCoupons.map((coupon) => {
          const discountStr = coupon.type === "percentage" ? `${coupon.discount}% off` : `${formatPrice(coupon.discount)} off`;
          const expired = new Date(coupon.expiresAt) < new Date();
          const active = coupon.isActive && !expired;

          return (
            <div key={coupon.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-xl bg-slate-100 p-2 text-slate-700 shrink-0">
                      <Tag size={16} />
                    </span>
                    <h2 className="text-lg font-bold text-slate-950">{coupon.code}</h2>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      active ? "bg-green-50 text-green-700 border border-green-200" : "bg-rose-50 text-rose-700 border border-rose-200"
                    }`}>
                      {active ? "Active" : expired ? "Expired" : "Disabled"}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-600">
                    <p><span className="font-semibold text-slate-800">Reward:</span> {discountStr}</p>
                    {coupon.minCartAmt != null && Number(coupon.minCartAmt) > 0 && (
                      <p><span className="font-semibold text-slate-800">Min Spend:</span> {formatPrice(coupon.minCartAmt)}</p>
                    )}
                    {coupon.maxDiscount != null && Number(coupon.maxDiscount) > 0 && (
                      <p><span className="font-semibold text-slate-800">Max Discount Cap:</span> {formatPrice(coupon.maxDiscount)}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right text-sm text-slate-600 flex items-center gap-1">
                    <Calendar size={14} className="text-slate-400" />
                    <span>Expires {new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(new Date(coupon.expiresAt))}</span>
                  </div>
                  <Button type="button" variant="outline" className="rounded-full border-slate-200" onClick={() => { beginEdit(coupon); setIsDialogOpen(true); }}>
                    Edit
                  </Button>
                </div>
              </div>
            </div>
          );
        })}

        {!filteredCoupons.length && <p className="text-sm text-slate-500">No promo coupons found.</p>}
      </div>
    </AdminShell>
  );
};

export default AdminCoupons;
