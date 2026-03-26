import { create } from 'zustand';
import { getStorefront } from '../api';

const useDataStore = create((set, get) => ({
  storefront: null,
  loading: true,
  error: "",
  
  fetchStorefront: async () => {
    if (get().storefront) return; // Don't fetch if already loaded
    set({ loading: true, error: "" });
    try {
      const data = await getStorefront();
      set({ storefront: data, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  }
}));

export default useDataStore;
