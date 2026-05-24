import { FormEvent, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Edit3, Plus, Search } from "lucide-react";
import AdminShell from "@/components/AdminShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { apiRequest, ApiProduct, formatPrice } from "@/lib/api";
import { toast } from "sonner";

type ProductFormState = {
  name: string;
  category: string;
  brand: string;
  description: string;
  status: ApiProduct["status"];
  variantName: string;
  price: string;
  salePrice: string;
  stock: string;
  variantActive: "true" | "false";
  variantId: string;
};

const emptyForm = (): ProductFormState => ({
  name: "",
  category: "Uncategorized",
  brand: "",
  description: "",
  status: "draft",
  variantName: "Standard",
  price: "",
  salePrice: "",
  stock: "0",
  variantActive: "true",
  variantId: "",
});

const AdminProducts = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductFormState>(emptyForm());

  const { data, error } = useQuery({
    queryKey: ["admin-products"],
    queryFn: () => apiRequest<{ products: ApiProduct[] }>("/api/admin/products"),
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
      name: product.name,
      category: product.category,
      brand: product.brand ?? "",
      description: product.description ?? "",
      status: product.status,
      variantName: variant?.name ?? "Standard",
      price: String(variant?.price ?? ""),
      salePrice: variant?.salePrice == null ? "" : String(variant.salePrice),
      stock: String(variant?.stock ?? 0),
      variantActive: variant?.isActive === false ? "false" : "true",
      variantId: variant?.id ?? "",
    });
  };

  const saveProduct = useMutation({
    mutationFn: () =>
      apiRequest(editingId ? `/api/admin/products/${editingId}` : "/api/admin/products", {
        method: editingId ? "PATCH" : "POST",
        body: JSON.stringify({
          name: form.name,
          category: form.category,
          brand: form.brand || null,
          description: form.description || null,
          status: form.status,
          images: [],
          variants: [
            {
              ...(form.variantId ? { id: form.variantId } : {}),
              name: form.variantName,
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
        <Button variant="outline" className="rounded-full border-slate-200 bg-white text-slate-800 hover:bg-slate-100" onClick={resetForm}>
          <Plus size={16} />
          New product
        </Button>
      }
    >
      {error && <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">Admin login required.</div>}

      <form onSubmit={submit} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-2xl bg-slate-100 p-3 text-slate-700">
            <Edit3 size={20} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-950">{editingId ? "Edit product" : "Create product"}</h2>
            <p className="text-sm text-slate-500">Keep the catalog ready for publishing and fulfillment.</p>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <Input placeholder="Product name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
          <Input placeholder="Category" value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} />
          <Input placeholder="Brand" value={form.brand} onChange={(event) => setForm({ ...form, brand: event.target.value })} />
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
          <Input placeholder="Variant name" value={form.variantName} onChange={(event) => setForm({ ...form, variantName: event.target.value })} />
          <Input placeholder="Price" type="number" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} required />
          <Input placeholder="Sale price" type="number" value={form.salePrice} onChange={(event) => setForm({ ...form, salePrice: event.target.value })} />
          <Input placeholder="Stock" type="number" value={form.stock} onChange={(event) => setForm({ ...form, stock: event.target.value })} required />
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

        <Textarea
          placeholder="Description"
          value={form.description}
          onChange={(event) => setForm({ ...form, description: event.target.value })}
          className="mt-3"
        />

        <div className="mt-4 flex flex-wrap gap-2">
          <Button disabled={saveProduct.isPending} className="rounded-full bg-slate-950 text-white hover:bg-slate-800" type="submit">
            {editingId ? "Save changes" : "Create product"}
          </Button>
          {editingId && (
            <Button type="button" variant="outline" className="rounded-full border-slate-200" onClick={resetForm}>
              Cancel edit
            </Button>
          )}
        </div>
      </form>

      <div className="mt-6 grid gap-4">
        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="relative">
            <Search size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search products" className="pl-10" />
          </div>
        </div>

        {filteredProducts.map((product) => {
          const variant = product.variants[0];
          const lowStock = (variant?.stock ?? 0) <= 10;

          return (
            <div key={product.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-3xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-semibold text-slate-950">{product.name}</h3>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">{product.status}</span>
                    {lowStock && <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">Low stock</span>}
                  </div>
                  <p className="mt-1 text-sm text-slate-600">{product.category}{product.brand ? ` · ${product.brand}` : ""}</p>
                  {product.description && <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">{product.description}</p>}
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button type="button" variant="outline" className="rounded-full border-slate-200" onClick={() => beginEdit(product)}>
                    Edit
                  </Button>
                </div>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-3">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Variant</p>
                  <p className="mt-1 font-medium text-slate-950">{variant?.name ?? "No variant"}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Price</p>
                  <p className="mt-1 font-medium text-slate-950">{variant ? formatPrice(variant.price) : "-"}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Stock</p>
                  <p className="mt-1 font-medium text-slate-950">{variant?.stock ?? 0}</p>
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
