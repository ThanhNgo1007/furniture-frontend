import type { Product } from "./ProductTypes";
import type { Address, User } from "./userTypes";

export interface OrderState {
  orders: Order[],
  orderItem: OrderItem | null,
  currentOrder: Order | null,
  paymentOrder: any | null,
  loading: boolean,
  error: string | null,
  orderCanceled: boolean,
}

export interface Order {
  id: number,
  orderId: string,
  user: User,
  sellerId: number,
  orderItems: OrderItem[],
  orderDate: string,
  shippingAddress: Address,
  paymentDetails: any,
  totalMsrpPrice: number,
  totalSellingPrice?: number,
  discount?: number,
  orderStatus: OrderStatus,
  totalItem: number,
  deliveryDate: string,
}

export enum OrderStatus {
  PENDING = "PENDING",
  PLACED = "PLACED",         // <--- Thêm cái này
  CONFIRMED = "CONFIRMED",   // <--- Thêm cái này
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",   // <--- Sửa thành 2 chữ L (khớp Backend)

  // Lưu ý: Backend không có ARRIVING, nhưng nếu bạn muốn giữ logic FE không lỗi đỏ thì cứ thêm vào.
  // Tuy nhiên, logic check (orderStatus === 'ARRIVING') sẽ không bao giờ true nếu BE không trả về.
  ARRIVING = "ARRIVING",
  FAILED = "FAILED"
}

export interface OrderItem {
  id: number,
  order: Order,
  product: Product,
  quantity: number,
  msrpPrice: number,
  sellingPrice: number,
  userId: number,
}


