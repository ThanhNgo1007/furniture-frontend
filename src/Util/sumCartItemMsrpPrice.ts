import type { CartItem } from "../types/cartTypes"

export const sumCartItemMsrpPrice = (cartItems: CartItem[]) => {
  return cartItems.reduce((total, item) => total + item.msrpPrice * item.quantity, 0)
}

export const sumCartItemSellingPrice = (cartItems: CartItem[]) => {
  return cartItems.reduce((total, item) => total + item.sellingPrice * item.quantity, 0)
}
