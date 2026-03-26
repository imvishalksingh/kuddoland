import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set, get) => ({
      cartItems: [],
      
      addToCart: (productId) => set((state) => {
        const existingItem = state.cartItems.find(item => item.productId === productId);
        if (existingItem) {
          return {
            cartItems: state.cartItems.map(item => 
              item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item
            )
          };
        }
        return { cartItems: [...state.cartItems, { productId, quantity: 1 }] };
      }),
      
      updateQuantity: (productId, quantity) => set((state) => {
        if (quantity <= 0) {
          return { cartItems: state.cartItems.filter(item => item.productId !== productId) };
        }
        return {
          cartItems: state.cartItems.map(item =>
            item.productId === productId ? { ...item, quantity } : item
          )
        };
      }),
      
      removeFromCart: (productId) => set((state) => ({
        cartItems: state.cartItems.filter(item => item.productId !== productId)
      })),
      
      clearCart: () => set({ cartItems: [] }),
      
      getCartTotalQuantity: () => {
        return get().cartItems.reduce((total, item) => total + item.quantity, 0);
      }
    }),
    {
      name: 'kuddoland-cart-storage',
    }
  )
);

export default useCartStore;
