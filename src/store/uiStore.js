import { create } from "zustand";

export const useUiStore = create((set) => ({
  mobileNavOpen: false,
  toggleMobileNav: () => set((state) => ({ mobileNavOpen: !state.mobileNavOpen })),
  closeMobileNav: () => set({ mobileNavOpen: false }),
}));
