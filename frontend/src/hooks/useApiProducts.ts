import { useQuery } from "@tanstack/react-query";
import { apiRequest, ApiProduct } from "@/lib/api";
import { products as staticProducts } from "@/data/products";

const fallbackProducts: ApiProduct[] = staticProducts.map((product) => ({
  id: product.id,
  name: product.title,
  slug: product.slug,
  description: product.description,
  category: product.category,
  brand: null,
  images: product.images,
  status: "published",
  benefits: product.benefits,
  ingredients: product.ingredients ?? null,
  usage: product.usage,
  rating: product.rating,
  reviewCount: product.reviewCount,
  variants: product.sizes.map((size, index) => ({
    id: `${product.id}-${index}`,
    productId: product.id,
    name: size,
    price: 0,
    salePrice: null,
    gstPrice: null,
    stock: 0,
    isActive: true,
  })),
}));

export const useApiProducts = () =>
  useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const data = await apiRequest<{ products: ApiProduct[] }>("/api/products");
      return data.products;
    },
    initialData: fallbackProducts,
    retry: false,
  });
