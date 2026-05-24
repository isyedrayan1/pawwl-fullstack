const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

export type ApiUser = {
  id: string;
  name: string;
  username?: string | null;
  email: string;
  phone?: string | null;
  role: "customer" | "admin";
  status: "active" | "disabled";
  createdAt?: string;
};

export type ApiAdminUser = ApiUser & {
  walletBalance?: string | number;
  orderCount?: number;
  addressCount?: number;
  sessionCount?: number;
};

export type ApiVariant = {
  id: string;
  productId: string;
  name: string;
  sku?: string | null;
  price: string | number;
  salePrice?: string | number | null;
  gstPrice?: string | number | null;
  stock: number;
  isActive: boolean;
};

export type ApiProduct = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  category: string;
  brand?: string | null;
  images?: string[] | null;
  status: "draft" | "published" | "archived";
  benefits?: string[] | null;
  ingredients?: string | null;
  usage?: string | null;
  rating?: string | null;
  reviewCount?: number | null;
  variants: ApiVariant[];
};

export type ApiCartItem = {
  id: string;
  quantity: number;
  product: ApiProduct;
  variant: ApiVariant;
};

export type ApiAddress = {
  id: string;
  label?: "home" | "work" | null;
  fullName: string;
  phone: string;
  line1: string;
  line2?: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
};

export type ApiOrderItem = {
  id: string;
  productId?: string | null;
  variantId?: string | null;
  productName: string;
  variantName: string;
  sku?: string | null;
  quantity: number;
  unitPrice: string | number;
  lineTotal: string | number;
};

export type ApiPayment = {
  id: string;
  provider: string;
  amount: string | number;
  status: "pending" | "paid" | "failed" | "refunded";
  providerOrderId?: string | null;
  providerPaymentId?: string | null;
};

export type ApiOrder = {
  id: string;
  orderNumber: string;
  addressSnapshot: ApiAddress | Record<string, unknown>;
  subtotal: string | number;
  deliveryFee: string | number;
  total: string | number;
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  fulfillmentStatus: "pending" | "processing" | "out_for_delivery" | "delivered" | "cancelled";
  notes?: string | null;
  createdAt: string;
  items: ApiOrderItem[];
  payments: ApiPayment[];
};

export type ApiAdminOrder = ApiOrder & {
  user: ApiUser;
};

export type ApiLowStockVariant = ApiVariant & {
  product: {
    id: string;
    name: string;
    slug: string;
    status: "draft" | "published" | "archived";
  };
};

export type ApiAuditLog = {
  id: string;
  adminUserId: string;
  action: string;
  entityType: string;
  entityId?: string | null;
  metadata?: string | null;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
};

export type ApiAdminSummary = {
  summary: {
    usersTotal: number;
    activeUsers: number;
    disabledUsers: number;
    productsTotal: number;
    publishedProducts: number;
    draftProducts: number;
    archivedProducts: number;
    lowStockVariants: number;
    pendingOrders: number;
    processingOrders: number;
    deliveredOrders: number;
    revenueTotal: string | number;
  };
  recentOrders: ApiAdminOrder[];
  recentUsers: ApiAdminUser[];
  lowStockVariants: ApiLowStockVariant[];
  recentAuditLogs: ApiAuditLog[];
};

export const apiRequest = async <T>(path: string, options: RequestInit = {}): Promise<T> => {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error ?? "Request failed");
  }
  return data as T;
};

export const formatPrice = (value: string | number | null | undefined) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value ?? 0));
