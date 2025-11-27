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

export interface PaymentDetails {
  paymentId?: string;
  paymentLinkId?: string;
  status?: 'PENDING' | 'COMPLETED' | 'FAILED';
  paymentMethod?: 'VNPAY' | 'COD';
}

export interface Order {
  id: number,
  orderId: string,
  user: User,
  sellerId: number,
  orderItems: OrderItem[],
  orderDate: string,
  shippingAddress: Address,
  paymentDetails: PaymentDetails,
  paymentStatus?: string, // PENDING, COMPLETED, FAILED
  totalMsrpPrice: number,
  totalSellingPrice?: number,
  discount?: number,
  orderStatus: OrderStatus,
  totalItem: number,
  deliveryDate: string,
}

export enum OrderStatus {
  PENDING = "PENDING",
  PLACED = "PLACED",
  CONFIRMED = "CONFIRMED",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
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


