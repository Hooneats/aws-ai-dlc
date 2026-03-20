import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, Menu } from '@/types';
import { calcFinalPrice } from '@/utils/price';

interface CartState {
  items: CartItem[];
  totalAmount: number;
  addItem: (menu: Menu) => void;
  removeItem: (menuId: number) => void;
  updateQuantity: (menuId: number, qty: number) => void;
  clear: () => void;
}

const calcTotal = (items: CartItem[]) =>
  items.reduce((sum, i) => sum + i.finalPrice * i.quantity, 0);

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      totalAmount: 0,
      addItem: (menu) =>
        set((s) => {
          const existing = s.items.find((i) => i.menuId === menu.id);
          const items = existing
            ? s.items.map((i) => i.menuId === menu.id ? { ...i, quantity: i.quantity + 1 } : i)
            : [...s.items, {
                menuId: menu.id, menuName: menu.name, price: menu.price,
                discountRate: menu.discountRate, finalPrice: calcFinalPrice(menu),
                quantity: 1, imageUrl: menu.imageUrl,
              }];
          return { items, totalAmount: calcTotal(items) };
        }),
      removeItem: (menuId) =>
        set((s) => {
          const items = s.items.filter((i) => i.menuId !== menuId);
          return { items, totalAmount: calcTotal(items) };
        }),
      updateQuantity: (menuId, qty) =>
        set((s) => {
          if (qty <= 0) {
            const items = s.items.filter((i) => i.menuId !== menuId);
            return { items, totalAmount: calcTotal(items) };
          }
          const items = s.items.map((i) => i.menuId === menuId ? { ...i, quantity: qty } : i);
          return { items, totalAmount: calcTotal(items) };
        }),
      clear: () => set({ items: [], totalAmount: 0 }),
    }),
    { name: 'cart-storage' },
  ),
);
