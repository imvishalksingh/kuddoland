import { create } from "zustand";
import { featuredProducts } from "../data/mockData";

export const useCartStore = create((set, get) => ({
  items: JSON.parse(window.localStorage.getItem("kuddosland-cart") || "[]"),
  addItem: (product, quantity = 1) =>
    set((state) => {
      const current = state.items.find((item) => item.id === product.id);
      const items = current
        ? state.items.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
          )
        : [...state.items, { ...product, quantity }];
      window.localStorage.setItem("kuddosland-cart", JSON.stringify(items));
      return { items };
    }),
  removeItem: (productId) =>
    set((state) => {
      const items = state.items.filter((item) => item.id !== productId);
      window.localStorage.setItem("kuddosland-cart", JSON.stringify(items));
      return { items };
    }),
  updateQuantity: (productId, quantity) =>
    set((state) => {
      const items = state.items
        .map((item) => (item.id === productId ? { ...item, quantity } : item))
        .filter((item) => item.quantity > 0);
      window.localStorage.setItem("kuddosland-cart", JSON.stringify(items));
      return { items };
    }),
  hydrateDemo: () => {
    const items = featuredProducts.slice(0, 2).map((item, index) => ({ ...item, quantity: index + 1 }));
    window.localStorage.setItem("kuddosland-cart", JSON.stringify(items));
    return set({ items });
  },
  clear: () =>
    set(() => {
      window.localStorage.removeItem("kuddosland-cart");
      return { items: [] };
    }),
  subtotal: () => get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
}));
