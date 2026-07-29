import { apiClient } from "./client";
import type {
  Page,
  Product,
  ProductCategory,
  ProductStatus,
} from "../types/product";

export interface ProductQuery {
  category?: ProductCategory;
  status?: ProductStatus;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  size?: number;
  sort?: string;
}

export interface ProductPayload {
  title: string;
  description: string;
  category: ProductCategory;
  model: string;
  storageCapacity: string;
  color: string;
  condition: string;
  priceRupees: number;
  batteryHealthPercent: number | null;
}

export async function getProducts(query: ProductQuery = {}): Promise<Page<Product>> {
  const { data } = await apiClient.get<Page<Product>>("/products", { params: query });
  return data;
}

export async function getProduct(id: number | string): Promise<Product> {
  const { data } = await apiClient.get<Product>(`/products/${id}`);
  return data;
}

export async function getAdminProducts(query: ProductQuery = {}): Promise<Page<Product>> {
  const { data } = await apiClient.get<Page<Product>>("/admin/products", { params: query });
  return data;
}

export async function createProduct(payload: ProductPayload): Promise<Product> {
  const { data } = await apiClient.post<Product>("/admin/products", payload);
  return data;
}

export async function updateProduct(id: number, payload: ProductPayload): Promise<Product> {
  const { data } = await apiClient.put<Product>(`/admin/products/${id}`, payload);
  return data;
}

export async function setProductStatus(id: number, status: ProductStatus): Promise<Product> {
  const { data } = await apiClient.patch<Product>(`/admin/products/${id}/status`, { status });
  return data;
}

export async function deleteProduct(id: number): Promise<void> {
  await apiClient.delete(`/admin/products/${id}`);
}

export async function uploadImages(id: number, files: File[]): Promise<Product> {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));
  const { data } = await apiClient.post<Product>(`/admin/products/${id}/images`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function deleteImage(id: number, imageId: number): Promise<Product> {
  const { data } = await apiClient.delete<Product>(`/admin/products/${id}/images/${imageId}`);
  return data;
}
