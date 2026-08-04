import { apiClient } from "./client";
import type { Page, ProductCategory } from "../types/product";
import type { DeviceRequest, DeviceRequestStatus } from "../types/deviceRequest";

export interface DeviceRequestPayload {
  category: ProductCategory;
  itemName: string;
  details: string;
  budgetRupees: number | null;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
}

export async function submitDeviceRequest(payload: DeviceRequestPayload): Promise<DeviceRequest> {
  const { data } = await apiClient.post<DeviceRequest>("/device-requests", payload);
  return data;
}

export interface DeviceRequestQuery {
  status?: DeviceRequestStatus;
  page?: number;
  size?: number;
  sort?: string;
}

export async function getAdminDeviceRequests(query: DeviceRequestQuery = {}): Promise<Page<DeviceRequest>> {
  const { data } = await apiClient.get<Page<DeviceRequest>>("/admin/device-requests", { params: query });
  return data;
}

export async function getAdminDeviceRequest(id: number | string): Promise<DeviceRequest> {
  const { data } = await apiClient.get<DeviceRequest>(`/admin/device-requests/${id}`);
  return data;
}

export async function updateDeviceRequestStatus(id: number, status: DeviceRequestStatus): Promise<DeviceRequest> {
  const { data } = await apiClient.patch<DeviceRequest>(`/admin/device-requests/${id}/status`, { status });
  return data;
}

export async function deleteDeviceRequest(id: number): Promise<void> {
  await apiClient.delete(`/admin/device-requests/${id}`);
}
