import type { HomeCategory } from "./homeCategoryTypes";

export interface Deal {
  id?: number;
  discount: number;
  image?: string;
  category: HomeCategory;
}

export interface ApiResponse {
  message: string;
  status: boolean;
}

export interface DealState {
  deals: Deal[];
  loading: boolean;
  error: string | null;
  dealCreated: boolean;
  dealUpdated: boolean;
}