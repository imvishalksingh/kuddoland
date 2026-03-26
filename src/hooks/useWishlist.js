import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { addWishlistItem, getWishlist, removeWishlistItem } from "../api/users.api";
import { useAuthStore } from "../store/authStore";
import { useWishlistStore } from "../store/wishlistStore";

export function useWishlist() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const localIds = useWishlistStore((state) => state.ids);
  const syncLocal = useWishlistStore((state) => state.sync);
  const toggleLocal = useWishlistStore((state) => state.toggle);

  const wishlistQuery = useQuery({
    queryKey: ["wishlist"],
    queryFn: getWishlist,
    enabled: Boolean(user),
  });

  const ids = user
    ? (wishlistQuery.data?.items || []).map((item) => item.id)
    : localIds;

  const mutation = useMutation({
    mutationFn: async ({ productId, isWishlisted }) => {
      if (!user) {
        toggleLocal(productId);
        return null;
      }

      if (isWishlisted) {
        return removeWishlistItem(productId);
      }

      return addWishlistItem(productId);
    },
    onSuccess: () => {
      if (user) {
        queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      } else {
        syncLocal([...useWishlistStore.getState().ids]);
      }
    },
    onError: (error) => toast.error(error.response?.data?.message || "Wishlist update failed"),
  });

  return {
    wishlistIds: ids,
    isWishlisted: (productId) => ids.includes(productId),
    toggleWishlist: (productId) => mutation.mutate({ productId, isWishlisted: ids.includes(productId) }),
    isPending: mutation.isPending,
  };
}
