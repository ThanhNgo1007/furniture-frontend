import type { Deal } from "./dealTypes";

export interface HomeData {
  id: number;
  grid: HomeCategory[];
  deals: Deal[];
  dealCategories: HomeCategory[];
}

export interface HomeCategory {
  id?: number;
  categoryId: string;
  section?: string;
  name?: string;
  image: string;
  parentCategoryId?: string;
  displayOrder?: number;
  isActive?: boolean;
}