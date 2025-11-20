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
  deliverDate: string,
}

export enum OrderStatus {
  PENDING = "PENDING",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELED = "CANCELED",
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


