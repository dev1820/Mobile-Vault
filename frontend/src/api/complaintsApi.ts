import { apiClient } from "./client";
import type { Page } from "../types/product";
import type { Complaint, ComplaintStatus, ComplaintType } from "../types/complaint";

export interface ComplaintPayload {
  fullName: string;
  email: string;
  phoneNumber: string;
  orderNumber: string;
  complaintType: ComplaintType;
  description: string;
  photos: File[];
  video?: File | null;
}

export async function submitComplaint(payload: ComplaintPayload): Promise<Complaint> {
  const formData = new FormData();
  formData.append("fullName", payload.fullName);
  formData.append("email", payload.email);
  formData.append("phoneNumber", payload.phoneNumber);
  formData.append("orderNumber", payload.orderNumber);
  formData.append("complaintType", payload.complaintType);
  formData.append("description", payload.description);
  payload.photos.forEach((file) => formData.append("photos", file));
  if (payload.video) {
    formData.append("video", payload.video);
  }

  const { data } = await apiClient.post<Complaint>("/complaints", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export interface ComplaintQuery {
  status?: ComplaintStatus;
  page?: number;
  size?: number;
  sort?: string;
}

export async function getAdminComplaints(query: ComplaintQuery = {}): Promise<Page<Complaint>> {
  const { data } = await apiClient.get<Page<Complaint>>("/admin/complaints", { params: query });
  return data;
}

export async function getAdminComplaint(id: number | string): Promise<Complaint> {
  const { data } = await apiClient.get<Complaint>(`/admin/complaints/${id}`);
  return data;
}

export async function updateComplaintStatus(id: number, status: ComplaintStatus): Promise<Complaint> {
  const { data } = await apiClient.patch<Complaint>(`/admin/complaints/${id}/status`, { status });
  return data;
}

export async function deleteComplaint(id: number): Promise<void> {
  await apiClient.delete(`/admin/complaints/${id}`);
}
