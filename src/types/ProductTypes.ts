import type { Seller } from "./SellerTypes";

export interface Product {
  id?: number;
  title: string;
  description: string;
  msrpPrice: number;
  sellingPrice: number;
  discountPercent: number;
  quantity?: number;
  color: string;
  images: string[];
  numRatings?: number;
  category?: Category;
  seller?: Seller;
  createdAt?: Date;
  isActive?: boolean; // true = available, false = seller disabled
}

export interface Category {
  id?: number;
  name: string;
  categoryId: string;
  parentCategory?: Category;
  level: number;
}