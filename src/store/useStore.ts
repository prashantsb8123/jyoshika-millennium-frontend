import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, CartItem, User } from '../types';

export type Currency = 'INR' | 'USD' | 'EUR' | 'GBP' | 'AED';

interface CurrencyRate {
  code: Currency;
  symbol: string;
  rateToINR: number; // Multiply INR by this factor
}

export const CURRENCIES: Record<Currency, CurrencyRate> = {
  INR: { code: 'INR', symbol: '₹', rateToINR: 1 },
  USD: { code: 'USD', symbol: '$', rateToINR: 0.012 },
  EUR: { code: 'EUR', symbol: '€', rateToINR: 0.011 },
  GBP: { code: 'GBP', symbol: '£', rateToINR: 0.0094 },
  AED: { code: 'AED', symbol: 'د.إ', rateToINR: 0.044 },
};

interface AppState {
  // User Auth
  user: User | null;
  token: string | null;
  setUser: (user: User | null, token?: string | null) => void;
  logout: () => void;

  // Currency
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatPrice: (priceInINR: number) => string;

  // Shopping Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;

  // Wishlist
  wishlist: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;

  // Compare
  compareList: Product[];
  addToCompare: (product: Product) => void;
  removeFromCompare: (productId: string) => void;
  isInCompare: (productId: string) => boolean;
  clearCompare: () => void;

  // Recently Viewed
  recentlyViewed: Product[];
  addRecentlyViewed: (product: Product) => void;

  // Modals & Drawers
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;

  // Toast System
  toastMessage: { text: string; type: 'success' | 'error' | 'info' } | null;
  showToast: (text: string, type?: 'success' | 'error' | 'info') => void;
  hideToast: () => void;

  // Theme
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Auth State
      user: null,
      token: null,
      setUser: (user, token = null) => set({ user, token: token || get().token }),
      logout: () => set({
        user: null,
        token: null,
        cart: [],
        wishlist: [],
        compareList: [],
        isCartOpen: false,
      }),

      // Currency
      currency: 'INR',
      setCurrency: () => set({ currency: 'INR' }),
      formatPrice: (priceInINR: number) => {
        return `₹${Math.round(priceInINR).toLocaleString('en-IN')}`;
      },

      // Cart
      cart: [],
      addToCart: (product, quantity = 1) => {
        const cart = get().cart;
        const existingIndex = cart.findIndex((item) => item.product.id === product.id);

        if (existingIndex > -1) {
          const updated = [...cart];
          updated[existingIndex].quantity += quantity;
          set({ cart: updated, isCartOpen: true });
        } else {
          set({
            cart: [...cart, { product, quantity }],
            isCartOpen: true,
          });
        }
        get().showToast(`Added "${product.title}" to cart`, 'success');
      },
      removeFromCart: (productId) => {
        set((state) => ({
          cart: state.cart.filter((item) => item.product.id !== productId),
        }));
        get().showToast('Item removed from cart', 'info');
      },
      updateCartQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(productId);
          return;
        }
        set((state) => ({
          cart: state.cart.map((item) => {
            if (item.product.id === productId) {
              return { ...item, quantity };
            }
            return item;
          }),
        }));
      },
      clearCart: () => set({ cart: [] }),
      isCartOpen: false,
      setIsCartOpen: (open) => set({ isCartOpen: open }),

      // Wishlist
      wishlist: [],
      addToWishlist: (product) => {
        const wishlist = get().wishlist;
        if (!wishlist.some((p) => p.id === product.id)) {
          set({ wishlist: [...wishlist, product] });
          get().showToast('Added to wishlist', 'success');
        }
      },
      removeFromWishlist: (productId) => {
        set((state) => ({
          wishlist: state.wishlist.filter((p) => p.id !== productId),
        }));
        get().showToast('Removed from wishlist', 'info');
      },
      toggleWishlist: (product) => {
        const wishlist = get().wishlist;
        const exists = wishlist.some((p) => p.id === product.id);
        if (exists) {
          get().removeFromWishlist(product.id);
        } else {
          get().addToWishlist(product);
        }
      },
      isInWishlist: (productId) => get().wishlist.some((p) => p.id === productId),

      // Compare
      compareList: [],
      addToCompare: (product) => {
        const list = get().compareList;
        if (list.length >= 4) {
          get().showToast('Compare list is full (Max 4 items)', 'error');
          return;
        }
        if (!list.some((p) => p.id === product.id)) {
          set({ compareList: [...list, product] });
          get().showToast('Added to product comparison', 'success');
        }
      },
      removeFromCompare: (productId) => {
        set((state) => ({
          compareList: state.compareList.filter((p) => p.id !== productId),
        }));
      },
      isInCompare: (productId) => get().compareList.some((p) => p.id === productId),
      clearCompare: () => set({ compareList: [] }),

      // Recently Viewed
      recentlyViewed: [],
      addRecentlyViewed: (product) => {
        const list = get().recentlyViewed.filter((p) => p.id !== product.id);
        set({ recentlyViewed: [product, ...list].slice(0, 10) });
      },

      // Modals
      quickViewProduct: null,
      setQuickViewProduct: (product) => set({ quickViewProduct: product }),
      isSearchOpen: false,
      setIsSearchOpen: (open) => set({ isSearchOpen: open }),

      // Toast
      toastMessage: null,
      showToast: (text, type = 'success') => {
        set({ toastMessage: { text, type } });
        setTimeout(() => {
          set({ toastMessage: null });
        }, 3500);
      },
      hideToast: () => set({ toastMessage: null }),

      // Theme (Enforced Light Theme)
      isDarkMode: false,
      toggleDarkMode: () => set({ isDarkMode: false }),
    }),
    {
      name: 'jyoshika-millennium-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        cart: state.cart,
        wishlist: state.wishlist,
        compareList: state.compareList,
        recentlyViewed: state.recentlyViewed,
        currency: state.currency,
      }),
    }
  )
);
