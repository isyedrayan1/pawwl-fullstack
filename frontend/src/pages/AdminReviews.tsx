import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Search, Star, MessageSquare, Trash2 } from "lucide-react";
import AdminShell from "@/components/AdminShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { formatDistanceToNow } from "date-fns";
import { apiRequest, ApiReview, formatPrice, getImageUrl } from "@/lib/api";
import { toast } from "sonner";

const AdminReviews = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data, error } = useQuery({
    queryKey: ["admin-reviews"],
    queryFn: () => apiRequest<{ reviews: ApiReview[] }>("/api/admin/reviews"),
    retry: false,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      apiRequest(`/api/admin/reviews/${id}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      toast.success("Review deleted and product aggregates updated");
      setIsDeleteDialogOpen(false);
      setDeletingId(null);
      queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    },
    onError: (mutationError) => {
      toast.error(mutationError instanceof Error ? mutationError.message : "Deletion failed");
      setIsDeleteDialogOpen(false);
      setDeletingId(null);
    },
  });

  const filteredReviews = (data?.reviews ?? []).filter((r) => {
    const needle = search.trim().toLowerCase();
    if (!needle) return true;
    return (
      r.product?.name.toLowerCase().includes(needle) ||
      r.user?.name.toLowerCase().includes(needle) ||
      r.comment.toLowerCase().includes(needle) ||
      String(r.rating).includes(needle)
    );
  });

  const confirmDelete = (id: string) => {
    setDeletingId(id);
    setIsDeleteDialogOpen(true);
  };

  return (
    <AdminShell
      title="Product Reviews"
      description="Inspect customer feedback, ratings, and moderate or delete spam/inappropriate reviews."
    >
      {error && <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">Admin login required.</div>}

      <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="relative">
          <Search size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search reviews by product, customer, or comment" className="pl-10" />
        </div>
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="rounded-[2.5rem] border border-slate-200 bg-white p-6">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-bold text-slate-950">Delete Review</AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-slate-600">
              Are you sure you want to delete this customer review? This will remove the review permanently and recalculate the product's average rating. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4 flex gap-2">
            <AlertDialogCancel className="rounded-full border-slate-200" onClick={() => { setIsDeleteDialogOpen(false); setDeletingId(null); }}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              className="rounded-full bg-rose-600 hover:bg-rose-700 text-white animate-none" 
              onClick={() => { if(deletingId) deleteMutation.mutate(deletingId); }}
              disabled={deleteMutation.isPending}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="mt-6 grid gap-4">
        {filteredReviews.map((review) => {
          const thumbnail = Array.isArray(review.product?.images) && review.product!.images!.length > 0
            ? getImageUrl(review.product!.images![0])
            : "/pawwl-logo-main-croped.webp";
          const formattedDate = new Intl.DateTimeFormat("en-IN", {
            dateStyle: "medium",
          }).format(new Date(review.createdAt));

          return (
            <div key={review.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex gap-4 items-start max-w-3xl">
                  <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-xl overflow-hidden shrink-0">
                    <img src={thumbnail} className="w-full h-full object-cover" alt={review.product?.name ?? "product"} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-950">{review.product?.name ?? "Unknown Product"}</h3>
                    <div className="mt-1 flex items-center gap-1.5">
                      <div className="flex items-center gap-0.5 text-amber-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            fill={i < review.rating ? "currentColor" : "none"}
                            className={i < review.rating ? "text-amber-500" : "text-slate-200"}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-slate-400">by {review.user?.name ?? "Customer"} · {formattedDate}</span>
                    </div>
                    <p className="mt-3 text-sm text-slate-700 italic leading-6 bg-slate-50 border border-slate-100 rounded-2xl p-3">
                      "{review.comment}"
                    </p>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2 pt-2 lg:pt-0">
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-full border-slate-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700 text-xs font-semibold bg-white flex items-center gap-1"
                    disabled={deleteMutation.isPending}
                    onClick={() => confirmDelete(review.id)}
                  >
                    <Trash2 size={14} />
                    Delete Review
                  </Button>
                </div>
              </div>
            </div>
          );
        })}

        {!filteredReviews.length && <p className="text-sm text-slate-500">No matching customer reviews found.</p>}
      </div>
    </AdminShell>
  );
};

export default AdminReviews;
