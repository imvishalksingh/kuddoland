import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchProduct, fetchProducts } from "../api/products.api";
import { featuredProducts } from "../data/mockData";

export function useProducts(params = {}) {
  return useQuery({
    queryKey: ["products", params],
    queryFn: async () => {
      try {
        const data = await fetchProducts(params);
        return data.items?.length ? data.items : featuredProducts;
      } catch {
        return featuredProducts;
      }
    },
  });
}

export function useProduct(slug) {
  const queryClient = useQueryClient();
  
  return useQuery({
    queryKey: ["product", slug],
    enabled: Boolean(slug),
    initialData: () => {
      // Look in the list-cache for the product to enable instant transitions
      const products = queryClient.getQueryData(["products", {}]) || { items: [] };
      const found = products.items?.find((p) => p.slug === slug);
      if (found) return { item: found };
      return undefined;
    },
    queryFn: async () => {
      try {
        const data = await fetchProduct(slug);
        return data; // returns { success: true, item: {...} }
      } catch {
        const mock = featuredProducts.find((p) => p.slug === slug);
        return { item: mock || featuredProducts[0] };
      }
    },
  });
}
