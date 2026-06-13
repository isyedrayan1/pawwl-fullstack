import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { apiRequest, ApiCartItem, formatPrice } from "@/lib/api";

const Cart = () => {
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ["cart"],
    queryFn: () => apiRequest<{ items: ApiCartItem[] }>("/api/cart"),
    retry: false,
  });

  const removeItem = useMutation({
    mutationFn: (id: string) => apiRequest(`/api/cart/items/${id}`, { method: "DELETE" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });

  const items = data?.items ?? [];
  const subtotal = items.reduce((sum, item) => {
    const price = Number(item.variant.salePrice ?? item.product.price ?? item.variant.price);
    return sum + price * item.quantity;
  }, 0);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="section-container py-16">
        <h1 className="text-4xl font-extrabold text-brand-dark mb-8">Cart</h1>
        {isLoading && <p>Loading...</p>}
        {error && <p className="text-red-600 mb-4">Login required for synced cart. The WhatsApp drawer still works as fallback.</p>}
        <div className="grid lg:grid-cols-[1fr_360px] gap-8">
          <div className="flex flex-col gap-4">
            {items.map((item) => (
              <div key={item.id} className="border border-border-design rounded-xl p-4 flex gap-4">
                <img src={item.product.images?.[0] ?? "/pawwl-logo-main-croped.webp"} alt={item.product.name} className="w-20 h-20 rounded-lg object-cover bg-brand-light" />
                <div className="flex-1">
                  <h2 className="font-bold text-brand-dark">{item.product.name}</h2>
                  <p className="text-sm text-[#555]">
                    {[item.product.animalType, item.product.category].filter(Boolean).join(" · ")}
                    {item.variant.name !== "Default" ? ` · ${item.variant.name}` : ""} | Qty {item.quantity}
                  </p>
                  <p className="font-bold text-brand-blue mt-2">{formatPrice(Number(item.variant.salePrice ?? item.product.price ?? item.variant.price) * item.quantity)}</p>
                </div>
                <Button variant="outline" onClick={() => removeItem.mutate(item.id)}>Remove</Button>
              </div>
            ))}
            {items.length === 0 && <p>Your synced cart is empty.</p>}
          </div>
          <aside className="border border-border-design rounded-xl p-6 h-fit">
            <h2 className="text-xl font-bold text-brand-dark mb-4">Summary</h2>
            <div className="flex justify-between mb-2"><span>Subtotal</span><strong>{formatPrice(subtotal)}</strong></div>
            <div className="flex justify-between mb-6"><span>Delivery</span><strong>{formatPrice(0)}</strong></div>
            <Button asChild className="w-full h-12 bg-brand-blue hover:bg-brand-dark">
              <Link to="/checkout">Checkout</Link>
            </Button>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Cart;
