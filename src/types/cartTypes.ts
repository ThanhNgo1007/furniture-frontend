import type { Product } from "./ProductTypes";
import type { User } from "./userTypes";

export interface CartItem {
  id: number,
  cart?: Cart,
  product: Product,
  quantity: number,
  msrpPrice: number,
  sellingPrice: number,
  userId: number,
}

export interface Cart {
  id: number,
  user: User,
  cartItemsInBag: CartItem[],
  totalSellingPrice: number,
  totalItem: number,
  totalMsrpPrice: number,
  discount: number,
  couponCode: string | null,
}