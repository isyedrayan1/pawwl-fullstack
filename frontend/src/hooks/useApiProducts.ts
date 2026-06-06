import { useQuery } from "@tanstack/react-query";
import { apiRequest, ApiProduct } from "@/lib/api";

export const useApiProducts = () =>
  useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const data = await apiRequest<{ products: ApiProduct[] }>("/api/products");
      return data.products;
    },
    retry: false,
  });
