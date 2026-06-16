import { FormEvent, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Edit3, Plus, Search, Trash2, Upload, X, Trash, Download } from "lucide-react";
import AdminShell from "@/components/AdminShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { apiRequest, ApiProduct, ApiProductMeta, formatPrice, getImageUrl } from "@/lib/api";
import { toast } from "sonner";

type ProductFormState = {
  catalogId: string;
  name: string;
  animalType: string;
  category: string;
  brand: string;
  description: string;
  status: ApiProduct["status"];
  images: string[];
  benefits: string[];
  ingredients: string;
  usage: string;
  seoTitle: string;
  seoDescription: string;
  variantName: string;
  price: string;
  salePrice: string;
  stock: string;
  variantActive: "true" | "false";
  variantId: string;
  benefitInput: string;
  isUploading: boolean;
};

const emptyForm = (): ProductFormState => ({
  catalogId: "",
  name: "",
  animalType: "",
  category: "Uncategorized",
  brand: "",
  description: "",
  status: "draft",
  images: [],
  benefits: [],
  ingredients: "",
  usage: "",
  seoTitle: "",
  seoDescription: "",
  variantName: "Default",
  price: "",
  salePrice: "",
  stock: "0",
  variantActive: "true",
  variantId: "",
  benefitInput: "",
  isUploading: false,
});

const AdminProducts = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductFormState>(emptyForm());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const deleteProduct = useMutation({
    mutationFn: (id: string) =>
      apiRequest(`/api/admin/products/${id}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      toast.success("Product deleted");
      setIsDeleteDialogOpen(false);
      setDeletingId(null);
      setIsDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["admin-summary"] });
    },
    onError: (mutationError) => {
      toast.error(mutationError instanceof Error ? mutationError.message : "Deletion failed");
      setIsDeleteDialogOpen(false);
      setDeletingId(null);
    },
  });

  const confirmDelete = (id: string) => {
    setDeletingId(id);
    setIsDeleteDialogOpen(true);
  };

  const { data, error } = useQuery({
    queryKey: ["admin-products"],
    queryFn: () => apiRequest<{ products: ApiProduct[] }>("/api/admin/products"),
    retry: false,
  });

  const { data: metaData } = useQuery({
    queryKey: ["product-meta"],
    queryFn: () => apiRequest<ApiProductMeta>("/api/products/meta"),
    retry: false,
  });

  const filteredProducts = useMemo(() => {
    const products = data?.products ?? [];
    const needle = search.trim().toLowerCase();

    if (!needle) return products;

    return products.filter((product) => {
      const haystack = [product.name, product.category, product.brand, product.status, product.slug].filter(Boolean).join(" ").toLowerCase();
      return haystack.includes(needle);
    });
  }, [data?.products, search]);

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyForm());
  };

  const beginEdit = (product: ApiProduct) => {
    const variant = product.variants[0];
    setEditingId(product.id);
    setForm({
      catalogId: product.catalogId == null ? "" : String(product.catalogId),
      name: product.name,
      animalType: product.animalType ?? "",
      category: product.category,
      brand: product.brand ?? "",
      description: product.description ?? "",
      status: product.status,
      images: Array.isArray(product.images) ? product.images : [],
      benefits: Array.isArray(product.benefits) ? product.benefits : [],
      ingredients: product.ingredients ?? "",
      usage: product.usage ?? "",
      seoTitle: product.seoTitle ?? "",
      seoDescription: product.seoDescription ?? "",
      variantName: variant?.name ?? "Default",
      price: String(product.price ?? variant?.price ?? ""),
      salePrice: variant?.salePrice == null ? "" : String(variant.salePrice),
      stock: String(product.stock ?? variant?.stock ?? 0),
      variantActive: variant?.isActive === false ? "false" : "true",
      variantId: variant?.id ?? "",
      benefitInput: "",
      isUploading: false,
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const files = Array.from(e.target.files);
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("images", file);
    });

    setForm((prev) => ({ ...prev, isUploading: true }));
    try {
      const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";
      const response = await fetch(`${API_BASE}/api/admin/upload`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Upload failed");
      setForm((prev) => ({
        ...prev,
        images: [...prev.images, ...data.urls],
        isUploading: false,
      }));
      toast.success("Images uploaded successfully");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
      setForm((prev) => ({ ...prev, isUploading: false }));
    }
  };

  const removeImage = (index: number) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const addBenefit = () => {
    if (!form.benefitInput.trim()) return;
    setForm((prev) => ({
      ...prev,
      benefits: [...prev.benefits, prev.benefitInput.trim()],
      benefitInput: "",
    }));
  };

  const removeBenefit = (index: number) => {
    setForm((prev) => ({
      ...prev,
      benefits: prev.benefits.filter((_, i) => i !== index),
    }));
  };

  const saveProduct = useMutation({
    mutationFn: () =>
      apiRequest(editingId ? `/api/admin/products/${editingId}` : "/api/admin/products", {
        method: editingId ? "PATCH" : "POST",
        body: JSON.stringify({
          name: form.name,
          catalogId: form.catalogId === "" ? null : Number(form.catalogId),
          animalType: form.animalType || null,
          category: form.category,
          brand: form.brand || null,
          description: form.description || null,
          status: form.status,
          images: form.images,
          benefits: form.benefits,
          ingredients: form.ingredients || null,
          usage: form.usage || null,
          seoTitle: form.seoTitle || null,
          seoDescription: form.seoDescription || null,
          price: Number(form.price || 0),
          stock: Number(form.stock || 0),
          variants: [
            {
              ...(form.variantId ? { id: form.variantId } : {}),
              name: "Default",
              price: Number(form.price || 0),
              salePrice: form.salePrice === "" ? null : Number(form.salePrice),
              gstPrice: Number(form.price || 0),
              stock: Number(form.stock || 0),
              isActive: form.variantActive === "true",
            },
          ],
        }),
      }),
    onSuccess: () => {
      toast.success(editingId ? "Product updated" : "Product created");
      resetForm();
      setIsDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["admin-summary"] });
    },
    onError: (mutationError) => toast.error(mutationError instanceof Error ? mutationError.message : "Save failed"),
  });

  const submit = (event: FormEvent) => {
    event.preventDefault();
    saveProduct.mutate();
  };

  return (
    <AdminShell
      title="Products"
      description="Create and maintain catalog records, product status, pricing, and stock without leaving the admin workspace."
      actions={
        <div className="flex items-center gap-2">
          <input type="file" id="import-excel" accept=".xlsx, .xls" className="hidden" onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const formData = new FormData();
            formData.append("file", file);
            const toastId = toast.loading("Importing products...");
            try {
              const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";
              const res = await fetch(`${API_BASE}/api/admin/import/products`, {
                method: "POST",
                body: formData,
                credentials: "include"
              });
              const data = await res.json();
              if (!res.ok) throw new Error(data.error || "Import failed");
              toast.success(`Updated ${data.updated} products`, { id: toastId });
              queryClient.invalidateQueries({ queryKey: ["admin-products"] });
            } catch (err) {
              toast.error(err instanceof Error ? err.message : "Import failed", { id: toastId });
            }
            e.target.value = "";
          }} />
          <Button variant="outline" className="rounded-full border-slate-200 bg-white text-slate-800 hover:bg-slate-100 hover:text-slate-900" onClick={() => document.getElementById("import-excel")?.click()}>
            <Upload size={16} />
            Import Excel
          </Button>
          <Button variant="outline" className="rounded-full border-slate-200 bg-white text-slate-800 hover:bg-slate-100 hover:text-slate-900" onClick={() => window.open("/api/admin/export/products", "_blank")}>
            <Download size={16} />
            Export to Excel
          </Button>
          <Button className="rounded-full bg-slate-950 text-white hover:bg-slate-800" onClick={() => { resetForm(); setIsDialogOpen(true); }}>
            <Plus size={16} />
            New product
          </Button>
        </div>
      }
    >
      {error && <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">Admin login required.</div>}

      <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col p-6 rounded-[2rem] border border-slate-200 bg-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-950 flex items-center gap-2">
              <span className="rounded-xl bg-slate-100 p-2 text-slate-700">
                <Edit3 size={18} />
              </span>
              {editingId ? "Edit Product" : "Create Product"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={submit} className="flex-1 flex flex-col overflow-hidden space-y-4">
            <div className="flex-1 pr-4 overflow-y-auto min-h-0 scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid grid-cols-4 bg-slate-100 p-1 rounded-full mb-6">
                  <TabsTrigger value="basic" className="rounded-full data-[state=active]:bg-white data-[state=active]:text-slate-950 text-slate-500 font-medium">Basic Info</TabsTrigger>
                  <TabsTrigger value="pricing" className="rounded-full data-[state=active]:bg-white data-[state=active]:text-slate-950 text-slate-500 font-medium">Pricing & Stock</TabsTrigger>
                  <TabsTrigger value="descriptions" className="rounded-full data-[state=active]:bg-white data-[state=active]:text-slate-950 text-slate-500 font-medium">Details</TabsTrigger>
                  <TabsTrigger value="images" className="rounded-full data-[state=active]:bg-white data-[state=active]:text-slate-950 text-slate-500 font-medium">Images & Perks</TabsTrigger>
                </TabsList>

                {/* Basic Info Tab */}
                <TabsContent value="basic" className="space-y-4 outline-none">
                  <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-[160px_1fr]">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Catalog ID</label>
                        <Input placeholder="Auto / optional" type="number" value={form.catalogId} onChange={(event) => setForm({ ...form, catalogId: event.target.value })} />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Product Name</label>
                        <Input placeholder="Product name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
                      </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Animal Type</label>
                        <Select value={form.animalType || "none"} onValueChange={(value) => setForm({ ...form, animalType: value === "none" ? "" : value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Animal type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">Not specified</SelectItem>
                            {(metaData?.animalTypes ?? []).map((animalType) => (
                              <SelectItem key={animalType.id} value={animalType.name}>{animalType.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Category</label>
                        <Select value={form.category} onValueChange={(value) => setForm({ ...form, category: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Category" />
                          </SelectTrigger>
                          <SelectContent>
                            {(metaData?.categories?.length ? metaData.categories : [{ id: "uncat", name: "Uncategorized", key: "uncategorized" }]).map((category) => (
                              <SelectItem key={category.id} value={category.name}>{category.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Brand</label>
                        <Input placeholder="Brand" value={form.brand} onChange={(event) => setForm({ ...form, brand: event.target.value })} />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Status</label>
                      <Select value={form.status} onValueChange={(value) => setForm({ ...form, status: value as ProductFormState["status"] })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="published">Published</SelectItem>
                          <SelectItem value="archived">Archived</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </TabsContent>

                {/* Pricing & Stock Tab */}
                <TabsContent value="pricing" className="space-y-4 outline-none">
                  <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Product Price (INR)</label>
                        <Input placeholder="Price" type="number" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} required />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Sale Price (INR - Optional)</label>
                        <Input placeholder="Sale price" type="number" value={form.salePrice} onChange={(event) => setForm({ ...form, salePrice: event.target.value })} />
                      </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Product Stock</label>
                        <Input placeholder="Stock" type="number" value={form.stock} onChange={(event) => setForm({ ...form, stock: event.target.value })} required />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Checkout Availability</label>
                        <Select value={form.variantActive} onValueChange={(value) => setForm({ ...form, variantActive: value as ProductFormState["variantActive"] })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Variant active" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="true">Active</SelectItem>
                            <SelectItem value="false">Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Details Tab */}
                <TabsContent value="descriptions" className="space-y-4 outline-none">
                  <div className="space-y-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Product Description</label>
                      <Textarea
                        placeholder="Detailed description of the product..."
                        value={form.description}
                        onChange={(event) => setForm({ ...form, description: event.target.value })}
                        className="h-24 resize-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Components & Ingredients</label>
                      <Textarea
                        placeholder="Deboned Poultry, Brown Rice, sweet potato..."
                        value={form.ingredients}
                        onChange={(event) => setForm({ ...form, ingredients: event.target.value })}
                        className="h-24 resize-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Professional Usage Instructions</label>
                      <Textarea
                        placeholder="Adjust to fit comfortably, transition slowly over 7-10 days..."
                        value={form.usage}
                        onChange={(event) => setForm({ ...form, usage: event.target.value })}
                        className="h-20 resize-none"
                      />
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">SEO Title</label>
                        <Input placeholder="Optional SEO title" value={form.seoTitle} onChange={(event) => setForm({ ...form, seoTitle: event.target.value })} />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">SEO Description</label>
                        <Textarea placeholder="Optional SEO description" value={form.seoDescription} onChange={(event) => setForm({ ...form, seoDescription: event.target.value })} className="h-20 resize-none" />
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Images & Perks Tab */}
                <TabsContent value="images" className="space-y-4 outline-none">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Key Benefits Builder</label>
                      <div className="flex gap-2">
                        <Input 
                          placeholder="Add benefit point (e.g. Rich in Omega-3 for shiny coat)" 
                          value={form.benefitInput} 
                          onChange={(e) => setForm({ ...form, benefitInput: e.target.value })}
                          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addBenefit(); } }}
                        />
                        <Button type="button" variant="outline" onClick={addBenefit}>
                          Add
                        </Button>
                      </div>
                      {form.benefits.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-2">
                          {form.benefits.map((benefit, idx) => (
                            <span key={idx} className="flex items-center gap-1 bg-slate-100 text-slate-800 text-xs font-medium px-3 py-1.5 rounded-full">
                              {benefit}
                              <button type="button" onClick={() => removeBenefit(idx)} title="Remove benefit" aria-label="Remove benefit" className="text-slate-400 hover:text-slate-600">
                                <X size={12} />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Product Images (Local Upload)</label>
                      <div className="flex flex-wrap gap-3">
                        {form.images.map((img, idx) => (
                          <div key={idx} className="w-20 h-20 rounded-2xl border border-slate-200 relative overflow-hidden group shrink-0">
                            <img src={getImageUrl(img)} className="w-full h-full object-cover" alt="product preview" />
                            <button
                              type="button"
                              onClick={() => removeImage(idx)}
                              title="Remove image"
                              aria-label="Remove image"
                              className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity rounded-2xl"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}
                        
                        <label className="w-20 h-20 rounded-2xl border-2 border-dashed border-slate-300 hover:border-slate-400 cursor-pointer flex flex-col items-center justify-center text-slate-400 hover:text-slate-500 transition-colors shrink-0">
                          <Upload size={18} />
                          <span className="text-[9px] font-bold mt-1 uppercase">Upload</span>
                          <input 
                            type="file" 
                            multiple 
                            accept="image/*" 
                            onChange={handleImageUpload} 
                            className="hidden" 
                            disabled={form.isUploading}
                          />
                        </label>
                      </div>
                      {form.isUploading && <p className="text-xs text-slate-500 animate-pulse">Uploading files...</p>}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            <DialogFooter className="pt-4 border-t border-slate-100 flex flex-row items-center gap-2">
              {editingId && (
                <Button 
                  type="button" 
                  variant="destructive" 
                  className="rounded-full bg-rose-600 hover:bg-rose-700 text-white mr-auto flex items-center gap-2 px-5"
                  onClick={() => confirmDelete(editingId)}
                >
                  <Trash size={16} />
                  Delete
                </Button>
              )}
              <Button type="button" variant="outline" className="rounded-full border-slate-200" onClick={() => { resetForm(); setIsDialogOpen(false); }}>
                Cancel
              </Button>
              <Button disabled={saveProduct.isPending || form.isUploading} className="rounded-full bg-slate-950 text-white hover:bg-slate-800 px-6" type="submit">
                {editingId ? "Save Changes" : "Create Product"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="rounded-[2.5rem] border border-slate-200 bg-white p-6">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-bold text-slate-950">Delete Product</AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-slate-600">
              Are you sure you want to delete this product? This will permanently delete the product and its variants. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4 flex gap-2">
            <AlertDialogCancel className="rounded-full border-slate-200" onClick={() => { setIsDeleteDialogOpen(false); setDeletingId(null); }}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              className="rounded-full bg-rose-600 hover:bg-rose-700 text-white animate-none" 
              onClick={() => { if(deletingId) deleteProduct.mutate(deletingId); }}
              disabled={deleteProduct.isPending}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Products List */}
      <div className="mt-6 grid gap-4">
        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="relative">
            <Search size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search products" className="pl-10" />
          </div>
        </div>

        {filteredProducts.map((product) => {
          const variant = product.variants[0];
          const lowStock = (product.stock ?? variant?.stock ?? 0) <= 10;
          const thumbnail = Array.isArray(product.images) && product.images.length > 0 ? getImageUrl(product.images[0]) : "/pawwl-logo-main-croped.webp";

          return (
            <div key={product.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex gap-4 items-start max-w-3xl">
                  <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-xl overflow-hidden shrink-0">
                    <img src={thumbnail} className="w-full h-full object-cover" alt={product.name} />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-semibold text-slate-950">{product.name}</h3>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">{product.status}</span>
                      {lowStock && <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">Low stock</span>}
                    </div>
                    <p className="mt-1 text-sm text-slate-600">
                      {[product.catalogId ? `#${product.catalogId}` : null, product.animalType, product.category, product.brand].filter(Boolean).join(" · ")}
                    </p>
                    {product.description && <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">{product.description}</p>}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button type="button" variant="outline" className="rounded-full border-slate-200" onClick={() => { beginEdit(product); setIsDialogOpen(true); }}>
                    Edit
                  </Button>
                </div>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-3">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Variant</p>
                  <p className="mt-1 font-medium text-slate-950">{product.animalType ?? "All pets"}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Price</p>
                  <p className="mt-1 font-medium text-slate-950">{formatPrice(product.price ?? variant?.price ?? 0)}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Stock</p>
                  <p className="mt-1 font-medium text-slate-950">{product.stock ?? variant?.stock ?? 0}</p>
                </div>
              </div>
            </div>
          );
        })}

        {!filteredProducts.length && <p className="text-sm text-slate-500">No products found.</p>}
      </div>
    </AdminShell>
  );
};

export default AdminProducts;
