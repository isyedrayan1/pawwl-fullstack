import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import AddressSelector from "@/components/AddressSelector";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { apiRequest, ApiAddress, ApiCartItem, ApiOrder, ApiProduct, formatPrice, getImageUrl } from "@/lib/api";
import { MapPin, CreditCard, ChevronRight, CheckCircle2 } from "lucide-react";

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if ((window as any).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const Checkout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [params] = useSearchParams();
  const [addressSelectorOpen, setAddressSelectorOpen] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string>();
  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);

  const productId = params.get("product");
  const variantId = params.get("variant");
  const quantity = Math.max(1, Number(params.get("qty") ?? 1));
  const isBuyNow = Boolean(productId && variantId);

  const { data: addressData } = useQuery({
    queryKey: ["addresses"],
    queryFn: () => apiRequest<{ addresses: ApiAddress[] }>("/api/addresses"),
    retry: false,
  });

  const { data: meData } = useQuery({
    queryKey: ["me"],
    queryFn: () => apiRequest<{ user: any }>("/api/auth/me"),
    retry: false,
  });

  const isLoggedIn = Boolean(meData?.user);

  const { data: cartData, isLoading: cartLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: () => apiRequest<{ items: ApiCartItem[] }>("/api/cart"),
    enabled: !isBuyNow,
    retry: false,
  });

  const { data: productData, isLoading: productLoading } = useQuery({
    queryKey: ["checkout-product", productId],
    queryFn: () => apiRequest<{ product: ApiProduct }>(`/api/products/${productId}`),
    enabled: isBuyNow && Boolean(productId),
    retry: false,
  });

  const addresses = addressData?.addresses ?? [];
  const selectedAddress = addresses.find((address) => address.id === selectedAddressId);
  const buyNowVariant = productData?.product.variants.find((variant) => variant.id === variantId);

  const summaryItems = useMemo(() => {
    if (isBuyNow && productData?.product && buyNowVariant) {
      const price = Number(buyNowVariant.salePrice ?? productData.product.price ?? buyNowVariant.price);
      return [
        {
          id: buyNowVariant.id,
          name: productData.product.name,
          variant: buyNowVariant.name === "Default" ? productData.product.category : buyNowVariant.name,
          image: getImageUrl(productData.product.images?.[0]),
          quantity,
          total: price * quantity,
        },
      ];
    }

    return (cartData?.items ?? []).map((item) => {
      const price = Number(item.variant.salePrice ?? item.product.price ?? item.variant.price);
      return {
        id: item.id,
        name: item.product.name,
        variant: item.variant.name === "Default" ? item.product.category : item.variant.name,
        image: getImageUrl(item.product.images?.[0]),
        quantity: item.quantity,
        total: price * item.quantity,
      };
    });
  }, [buyNowVariant, cartData?.items, isBuyNow, productData?.product, quantity]);

  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponDiscount, setCouponDiscount] = useState(0);

  const subtotal = summaryItems.reduce((sum, item) => sum + item.total, 0);
  const shipping = 0; // Free shipping
  const total = Math.max(0, subtotal + shipping - couponDiscount);

  // Indian GST Tax Calculations
  const isIntrastate = useMemo(() => {
    if (!selectedAddress) return true; // Default to Maharashtra (true)
    return selectedAddress.state.trim().toLowerCase() === "maharashtra";
  }, [selectedAddress]);

  const taxableValue = total / 1.18;
  const gstAmount = total - taxableValue;
  const cgst = isIntrastate ? gstAmount / 2 : 0;
  const sgst = isIntrastate ? gstAmount / 2 : 0;
  const igst = !isIntrastate ? gstAmount : 0;

  const applyCoupon = async () => {
    if (!couponInput.trim()) return;
    try {
      const data = await apiRequest<{ coupon: any }>(`/api/orders/coupons/${couponInput.trim()}/validate`);
      const coupon = data.coupon;
      const minCartAmt = Number(coupon.minCartAmt ?? 0);
      if (subtotal < minCartAmt) {
        toast.error(`Minimum order value to apply this coupon is ${formatPrice(minCartAmt)}`);
        return;
      }
      setAppliedCoupon(coupon.code);
      let calculatedDiscount = 0;
      if (coupon.type === "percentage") {
        const pctDiscount = subtotal * (Number(coupon.discount) / 100);
        const maxD = coupon.maxDiscount ? Number(coupon.maxDiscount) : pctDiscount;
        calculatedDiscount = Math.min(pctDiscount, maxD);
      } else {
        calculatedDiscount = Math.min(Number(coupon.discount), subtotal);
      }
      setCouponDiscount(calculatedDiscount);
      toast.success(`Coupon "${coupon.code}" applied successfully!`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Invalid coupon code");
    }
  };

  useEffect(() => {
    if (!selectedAddressId && addresses.length > 0) {
      setSelectedAddressId(addresses[0].id);
    }
  }, [addresses, selectedAddressId]);

  const createAddress = useMutation({
    mutationFn: (address: Omit<ApiAddress, "id">) =>
      apiRequest<{ address: ApiAddress }>("/api/addresses", {
        method: "POST",
        body: JSON.stringify(address),
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      setSelectedAddressId(data.address.id);
      setAddressSelectorOpen(false);
      toast.success("Address saved");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Could not save address");
    },
  });

  const placeOrder = useMutation({
    mutationFn: async () => {
      if (!selectedAddressId) throw new Error("Please add a delivery address");
      if (summaryItems.length === 0) throw new Error("There are no items to checkout");

      const orderResult = await apiRequest<{ order: ApiOrder }>(
        isBuyNow ? "/api/orders/buy-now" : "/api/orders",
        {
          method: "POST",
          body: JSON.stringify({
            addressId: selectedAddressId,
            ...(isBuyNow ? { productId, variantId, quantity } : {}),
            couponCode: appliedCoupon || undefined,
            paymentMethod: "razorpay",
            notes: "Order placed through Pawwl e-commerce platform.",
          }),
        }
      );

      return orderResult.order;
    },
    onSuccess: async (order) => {
      try {
        toast.loading("Preparing payment gateway...");

        // 1. Fetch Razorpay configuration (Public Key ID)
        const config = await apiRequest<{ keyId: string | null; mode: string }>("/api/payments/razorpay/config");

        // 2. Request backend to create a Razorpay order
        const rzpOrder = await apiRequest<{
          provider: string;
          orderId: string;
          amount: number | string;
          currency: string;
        }>("/api/payments/razorpay/create-order", {
          method: "POST",
          body: JSON.stringify({ orderId: order.id }),
        });

        toast.dismiss();

        // 3. Fallback check for demo mode
        if (rzpOrder.provider === "demo") {
          toast.info("Demo Mode: Completing payment simulation...");
          const verifyResult = await apiRequest<{ success: boolean }>("/api/payments/razorpay/verify", {
            method: "POST",
            body: JSON.stringify({
              orderId: order.id,
              providerOrderId: rzpOrder.orderId,
            }),
          });

          if (verifyResult.success) {
            queryClient.invalidateQueries({ queryKey: ["cart"] });
            toast.success("Order placed and payment simulated successfully!");
            navigate(`/order-success?order=${order.id}`);
          } else {
            toast.error("Failed to complete demo payment simulation.");
          }
          return;
        }

        // 4. Real Razorpay standard payment modal integration
        const loaded = await loadRazorpayScript();
        if (!loaded) {
          toast.error("Could not load Razorpay SDK. Please check your network connection.");
          return;
        }

        const options = {
          key: config.keyId,
          amount: Math.round(Number(rzpOrder.amount) * 100), // amount in paise
          currency: rzpOrder.currency || "INR",
          name: "Pawwl",
          description: `Payment for Order #${order.orderNumber}`,
          order_id: rzpOrder.orderId,
          handler: async function (response: any) {
            try {
              toast.loading("Verifying payment transaction...");
              const verifyResult = await apiRequest<{ success: boolean }>("/api/payments/razorpay/verify", {
                method: "POST",
                body: JSON.stringify({
                  orderId: order.id,
                  providerOrderId: response.razorpay_order_id,
                  providerPaymentId: response.razorpay_payment_id,
                  signature: response.razorpay_signature,
                }),
              });
              toast.dismiss();

              if (verifyResult.success) {
                queryClient.invalidateQueries({ queryKey: ["cart"] });
                toast.success("Payment verified! Order completed successfully.");
                navigate(`/order-success?order=${order.id}`);
              } else {
                toast.error("Payment verification failed. Please try again.");
              }
            } catch (err: any) {
              toast.dismiss();
              toast.error(err.message || "Payment verification failed.");
            }
          },
          prefill: {
            name: meData?.user?.name || "",
            email: meData?.user?.email || "",
            contact: selectedAddress?.phone || "",
          },
          theme: {
            color: "#134e86",
          },
          modal: {
            ondismiss: function () {
              toast.warning("Payment cancelled.");
              navigate(`/order-failure?order=${order.id}`);
            },
          },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.on("payment.failed", function (response: any) {
          toast.error(`Payment failed: ${response.error.description}`);
          navigate(`/order-failure?order=${order.id}`);
        });
        rzp.open();
      } catch (err: any) {
        toast.dismiss();
        toast.error(err instanceof Error ? err.message : "Could not initialize checkout");
      }
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Checkout failed");
    },
  });

  const loading = cartLoading || productLoading;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <main className="flex-1 section-container py-8 lg:py-12">
        <h1 className="text-3xl lg:text-4xl font-bold text-brand-dark mb-2">Checkout</h1>
        <p className="text-[#666] mb-8">Complete your purchase</p>

        <div className="grid gap-8 lg:gap-12 lg:grid-cols-[1fr_400px]">
          {/* Left Column - Delivery & Payment */}
          <div className="space-y-8">
            {/* Delivery Address Section */}
            <section className="bg-white border border-border-design rounded-xl p-6 lg:p-8">
              <div className="flex items-center gap-3 mb-6">
                <MapPin className="text-brand-blue" size={24} />
                <h2 className="text-2xl font-bold text-brand-dark">Delivery To</h2>
              </div>

              {selectedAddress ? (
                <div className="bg-gray-50 rounded-lg p-6 mb-6 border border-border-design">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-brand-dark text-lg">
                        {selectedAddress.fullName}
                      </h3>
                      <p className="text-sm text-[#666] mt-1">{selectedAddress.phone}</p>
                    </div>
                    {selectedAddress.isDefault && (
                      <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-[#555] text-sm leading-relaxed">
                    {selectedAddress.line1}
                    {selectedAddress.line2 && `, ${selectedAddress.line2}`}
                  </p>
                  <p className="text-[#555] text-sm">
                    {selectedAddress.city}, {selectedAddress.state} {selectedAddress.postalCode}
                  </p>
                </div>
              ) : (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                  <p className="text-[#666]">Add a delivery address to continue.</p>
                </div>
              )}

              <Button
                onClick={() => setAddressSelectorOpen(true)}
                variant="outline"
                className="w-full"
              >
                {selectedAddress ? "Change Address" : "Add Address"}
              </Button>

              {/* Billing Address Checkbox */}
              <div className="mt-6 pt-6 border-t border-border-design flex items-center gap-3">
                <input
                  type="checkbox"
                  id="billing-same"
                  checked={billingSameAsShipping}
                  onChange={(e) => setBillingSameAsShipping(e.target.checked)}
                  className="w-5 h-5 rounded border-border-design cursor-pointer"
                />
                <label htmlFor="billing-same" className="cursor-pointer text-[#666]">
                  Billing same as shipping address
                </label>
              </div>
            </section>

            {/* Payment Method Section */}
            <section className="bg-white border border-border-design rounded-xl p-6 lg:p-8">
              <div className="flex items-center gap-3 mb-6">
                <CreditCard className="text-brand-blue" size={24} />
                <h2 className="text-2xl font-bold text-brand-dark">Payment Method</h2>
              </div>

              <div className="inline-flex items-center gap-3 px-5 py-3 border-2 border-brand-blue bg-blue-50/50 rounded-xl">
                <div className="w-5 h-5 rounded-full bg-brand-blue flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-white"></div>
                </div>
                <img 
                  src="/assets/razorpaylogo.png" 
                  alt="Razorpay" 
                  className="h-6 object-contain"
                />
              </div>
            </section>
          </div>

          {/* Right Column - Order Summary (Sticky Sidebar) */}
          <aside className="lg:sticky lg:top-24 h-fit">
            <div className="bg-white border border-border-design rounded-xl p-6 lg:p-8 space-y-6">
              <h3 className="text-2xl font-bold text-brand-dark">Order Summary</h3>

              {/* Order Items */}
              <div className="space-y-4 pb-6 border-b border-border-design">
                {loading ? (
                  <p className="text-[#666]">Loading items...</p>
                ) : summaryItems.length === 0 ? (
                  <p className="text-[#666]">No items in order</p>
                ) : (
                  summaryItems.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 rounded-lg bg-gray-100 object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-brand-dark text-sm">
                          {item.name}
                        </p>
                        <p className="text-xs text-[#666] mt-1">
                          {item.variant} | Qty: {item.quantity}
                        </p>
                        <p className="font-bold text-brand-blue text-sm mt-2">
                          {formatPrice(item.total)}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#666]">Sub Total</span>
                  <strong className="text-brand-dark">{formatPrice(subtotal)}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#666]">Shipping</span>
                  <strong className="text-green-600">FREE!</strong>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-[#666]">Discount {appliedCoupon && `(${appliedCoupon})`}</span>
                    <strong className="text-green-600">-{formatPrice(couponDiscount)}</strong>
                  </div>
                )}
                <div className="flex justify-between pt-1 border-t border-dashed border-border-design">
                  <span className="text-[#666]">Taxable Value</span>
                  <strong className="text-brand-dark">{formatPrice(taxableValue)}</strong>
                </div>
                {isIntrastate ? (
                  <>
                    <div className="flex justify-between">
                      <span className="text-[#666]">CGST (9%)</span>
                      <strong className="text-brand-dark">{formatPrice(cgst)}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#666]">SGST (9%)</span>
                      <strong className="text-brand-dark">{formatPrice(sgst)}</strong>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-between">
                    <span className="text-[#666]">IGST (18%)</span>
                    <strong className="text-brand-dark">{formatPrice(igst)}</strong>
                  </div>
                )}
                <div className="flex justify-between pt-3 border-t border-border-design text-base">
                  <strong className="text-brand-dark">TOTAL</strong>
                  <strong className="text-brand-blue text-xl">{formatPrice(total)}</strong>
                </div>
              </div>

              {/* Coupon Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Coupon code"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  className="flex-1 px-4 py-2 border border-border-design rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
                />
                <Button variant="outline" size="sm" onClick={applyCoupon}>
                  Apply
                </Button>
              </div>

              {/* Place Order Button */}
              {!isLoggedIn ? (
                <Button
                  onClick={() =>
                    navigate(`/login?next=/checkout${window.location.search}`)
                  }
                  className="w-full h-12 bg-brand-dark hover:bg-brand-accent text-white font-semibold rounded-lg"
                >
                  Login to Continue
                </Button>
              ) : (
                <Button
                  disabled={
                    placeOrder.isPending ||
                    summaryItems.length === 0 ||
                    !selectedAddressId
                  }
                  onClick={() => placeOrder.mutate()}
                  className="w-full h-12 bg-brand-dark hover:bg-brand-accent text-white font-semibold rounded-lg flex items-center justify-center gap-2"
                >
                  {placeOrder.isPending ? (
                    "Placing Order..."
                  ) : (
                    <>
                      PLACE ORDER
                      <ChevronRight size={20} />
                    </>
                  )}
                </Button>
              )}

              {/* Info */}
              <p className="text-xs text-[#999] text-center">
                Your personal data will be used to process your order and for other purposes described in our privacy policy.
              </p>
            </div>
          </aside>
        </div>
      </main>

      {/* Address Selector Modal */}
      <AddressSelector
        open={addressSelectorOpen}
        addresses={addresses}
        selectedAddressId={selectedAddressId}
        saving={createAddress.isPending}
        onOpenChange={setAddressSelectorOpen}
        onSelect={(id) => {
          setSelectedAddressId(id);
          setAddressSelectorOpen(false);
        }}
        onCreate={(address) => createAddress.mutate(address)}
      />

      <Footer />
    </div>
  );
};

export default Checkout;
