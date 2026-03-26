import { create } from "zustand";

const storageKey = "kuddosland-wishlist";

function readIds() {
  return JSON.parse(window.localStorage.getItem(storageKey) || "[]");
}

export const useWishlistStore = create((set) => ({
  ids: readIds(),
  sync(ids) {
    window.localStorage.setItem(storageKey, JSON.stringify(ids));
    set({ ids });
  },
  toggle(productId) {
    set((state) => {
      const ids = state.ids.includes(productId)
        ? state.ids.filter((item) => item !== productId)
        : [...state.ids, productId];
      window.localStorage.setItem(storageKey, JSON.stringify(ids));
      return { ids };
    });
  },
}));
