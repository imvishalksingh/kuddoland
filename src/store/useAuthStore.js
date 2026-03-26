import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      user: null, // { id, name, email, token }
      isAuthenticated: false,
      
      login: (userData) => set({
        user: userData,
        isAuthenticated: true
      }),
      
      logout: () => set({
        user: null,
        isAuthenticated: false
      }),
      
      updateUser: (data) => set((state) => ({
        user: { ...state.user, ...data }
      }))
    }),
    {
      name: 'kuddoland-auth-storage',
    }
  )
);

export default useAuthStore;
