import { useQuery } from "@tanstack/react-query";
import { fetchCategories } from "../api/categories.api";

// Fallback categories shown while backend is loading or unreachable
const FALLBACK_CATEGORIES = [
  { id: "1", name: "Stuffed Animals", slug: "stuffed-animals", image: "/cat1.png" },
  { id: "2", name: "Soft Dolls",      slug: "soft-dolls",      image: "/cat2.png" },
  { id: "3", name: "Teddies",         slug: "teddies",         image: "/cat3.png" },
  { id: "4", name: "Fantasy Animals", slug: "fantasy-animals", image: "/cat4.png" },
  { id: "5", name: "Pull Toys",       slug: "pull-toys",       image: "/cat5.png" },
];

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    staleTime: 5 * 60 * 1000, // 5 min cache
    queryFn: async () => {
      try {
        const data = await fetchCategories();
        return data.items?.length ? data.items : FALLBACK_CATEGORIES;
      } catch {
        return FALLBACK_CATEGORIES;
      }
    },
  });
}
