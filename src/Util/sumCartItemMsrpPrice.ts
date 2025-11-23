/* eslint-disable @typescript-eslint/no-explicit-any */
import type { CartItem } from "../types/cartTypes";

// Tính tổng giá niêm yết (MSRP)
export const sumCartItemMsrpPrice = (cartItems: CartItem[]) => {
  return cartItems.reduce((total, item) => {
    // Ưu tiên lấy giá gốc từ product (Unit Price) * quantity hiện tại
    // Để đảm bảo khi bấm tăng/giảm số lượng, giá nhảy ngay lập tức
    const unitMsrpPrice = item.product?.msrpPrice || 0;
    return total + (unitMsrpPrice * item.quantity);
  }, 0);
}

// Tính tổng giá bán thực tế (Selling Price)
export const sumCartItemSellingPrice = (cartItems: CartItem[]) => {
  return cartItems.reduce((total, item) => {
    // Ưu tiên lấy giá gốc từ product (Unit Price) * quantity hiện tại
    const unitSellingPrice = item.product?.sellingPrice || 0;
    return total + (unitSellingPrice * item.quantity);
  }, 0);
}