import { apiClient } from "./client";
import type { Page } from "../types/product";
import type {
  AccessoriesIncluded,
  RepairStatus,
  SellRequest,
  SellRequestStatus,
  SimStatus,
} from "../types/sellRequest";

export interface SellRequestPayload {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  phoneCompany: string;
  model: string;
  conditionRating: number;
  storageCapacity: string;
  simStatus: SimStatus;
  repairStatus: RepairStatus;
  accessories: AccessoriesIncluded;
  deviceSerialNumber: string;
  deviceDetails: string;
  expectedPriceRupees: number;
  photos: File[];
  video?: File | null;
}

export async function submitSellRequest(payload: SellRequestPayload): Promise<SellRequest> {
  const formData = new FormData();
  formData.append("firstName", payload.firstName);
  formData.append("lastName", payload.lastName);
  formData.append("email", payload.email);
  formData.append("phoneNumber", payload.phoneNumber);
  formData.append("phoneCompany", payload.phoneCompany);
  formData.append("model", payload.model);
  formData.append("conditionRating", String(payload.conditionRating));
  formData.append("storageCapacity", payload.storageCapacity);
  formData.append("simStatus", payload.simStatus);
  formData.append("repairStatus", payload.repairStatus);
  formData.append("accessories", payload.accessories);
  formData.append("deviceSerialNumber", payload.deviceSerialNumber);
  formData.append("deviceDetails", payload.deviceDetails);
  formData.append("expectedPriceRupees", String(payload.expectedPriceRupees));
  payload.photos.forEach((file) => formData.append("photos", file));
  if (payload.video) {
    formData.append("video", payload.video);
  }

  const { data } = await apiClient.post<SellRequest>("/sell-requests", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export interface SellRequestQuery {
  status?: SellRequestStatus;
  page?: number;
  size?: number;
  sort?: string;
}

export async function getAdminSellRequests(query: SellRequestQuery = {}): Promise<Page<SellRequest>> {
  const { data } = await apiClient.get<Page<SellRequest>>("/admin/sell-requests", { params: query });
  return data;
}

export async function getAdminSellRequest(id: number | string): Promise<SellRequest> {
  const { data } = await apiClient.get<SellRequest>(`/admin/sell-requests/${id}`);
  return data;
}

export async function updateSellRequestStatus(id: number, status: SellRequestStatus): Promise<SellRequest> {
  const { data } = await apiClient.patch<SellRequest>(`/admin/sell-requests/${id}/status`, { status });
  return data;
}

export async function deleteSellRequest(id: number): Promise<void> {
  await apiClient.delete(`/admin/sell-requests/${id}`);
}
