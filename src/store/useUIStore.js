import { create } from 'zustand';

const useUIStore = create((set) => ({
  menuOpen: false,
  cartOpen: false,
  
  toggleMenu: () => set((state) => {
    // Lock/unlock body scroll
    if (!state.menuOpen) {
      document.body.classList.add('nav-open');
    } else if (!state.cartOpen) {
      document.body.classList.remove('nav-open');
    }
    return { menuOpen: !state.menuOpen };
  }),
  
  setMenuOpen: (isOpen) => set((state) => {
    if (isOpen) {
      document.body.classList.add('nav-open');
    } else if (!state.cartOpen) {
      document.body.classList.remove('nav-open');
    }
    return { menuOpen: isOpen };
  }),

  toggleCart: () => set((state) => {
    if (!state.cartOpen) {
      document.body.classList.add('nav-open');
    } else if (!state.menuOpen) {
      document.body.classList.remove('nav-open');
    }
    return { cartOpen: !state.cartOpen };
  }),
  
  setCartOpen: (isOpen) => set((state) => {
    if (isOpen) {
      document.body.classList.add('nav-open');
    } else if (!state.menuOpen) {
      document.body.classList.remove('nav-open');
    }
    return { cartOpen: isOpen };
  }),
  
  closeAll: () => set(() => {
    document.body.classList.remove('nav-open');
    return { menuOpen: false, cartOpen: false };
  })
}));

export default useUIStore;
