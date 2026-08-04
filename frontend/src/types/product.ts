export type ProductCategory = "PHONE" | "ACCESSORY";

export type ProductStatus = "AVAILABLE" | "RESERVED" | "SOLD";

export type ProductCondition =
  | "NEW"
  | "USED_EXCELLENT"
  | "USED_GOOD"
  | "USED_FAIR";

export interface ProductImage {
  id: number;
  url: string;
  sortOrder: number;
}

export interface Product {
  id: number;
  title: string;
  description: string | null;
  category: ProductCategory;
  model: string | null;
  storageCapacity: string | null;
  color: string | null;
  condition: ProductCondition | null;
  priceRupees: number;
  batteryHealthPercent: number | null;
  status: ProductStatus;
  createdAt: string;
  updatedAt: string;
  images: ProductImage[];
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export const CONDITION_LABELS: Record<ProductCondition, string> = {
  NEW: "New",
  USED_EXCELLENT: "Used — Excellent",
  USED_GOOD: "Used — Good",
  USED_FAIR: "Used — Fair",
};

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  PHONE: "iPhone",
  ACCESSORY: "Accessory",
};
