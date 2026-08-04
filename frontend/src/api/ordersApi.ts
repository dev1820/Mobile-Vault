import { apiClient } from "./client";
import type { Page } from "../types/product";
import type { Order, OrderStatus } from "../types/order";

export interface OrderPayload {
  productId: number;
  customerFirstName: string;
  customerLastName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
  deliveryCity: string;
  deliveryNotes?: string;
  paymentReference?: string;
  paymentProof: File;
}

export async function submitOrder(payload: OrderPayload): Promise<Order> {
  const formData = new FormData();
  formData.append("productId", String(payload.productId));
  formData.append("customerFirstName", payload.customerFirstName);
  formData.append("customerLastName", payload.customerLastName);
  formData.append("customerEmail", payload.customerEmail);
  formData.append("customerPhone", payload.customerPhone);
  formData.append("deliveryAddress", payload.deliveryAddress);
  formData.append("deliveryCity", payload.deliveryCity);
  if (payload.deliveryNotes) formData.append("deliveryNotes", payload.deliveryNotes);
  if (payload.paymentReference) formData.append("paymentReference", payload.paymentReference);
  formData.append("paymentProof", payload.paymentProof);

  const { data } = await apiClient.post<Order>("/orders", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export interface OrderQuery {
  status?: OrderStatus;
  page?: number;
  size?: number;
  sort?: string;
}

export async function getAdminOrders(query: OrderQuery = {}): Promise<Page<Order>> {
  const { data } = await apiClient.get<Page<Order>>("/admin/orders", { params: query });
  return data;
}

export async function getAdminOrder(id: number | string): Promise<Order> {
  const { data } = await apiClient.get<Order>(`/admin/orders/${id}`);
  return data;
}

export async function updateOrderStatus(id: number, status: OrderStatus): Promise<Order> {
  const { data } = await apiClient.patch<Order>(`/admin/orders/${id}/status`, { status });
  return data;
}

export async function deleteOrder(id: number): Promise<void> {
  await apiClient.delete(`/admin/orders/${id}`);
}
