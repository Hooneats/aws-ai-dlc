import type { Menu } from '@/types';

export const calcFinalPrice = (menu: Pick<Menu, 'price' | 'discountRate'>): number =>
  menu.discountRate > 0
    ? menu.price - Math.floor((menu.price * menu.discountRate) / 100)
    : menu.price;
