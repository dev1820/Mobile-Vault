import type { ProductCategory } from "./product";

export type DeviceRequestStatus = "PENDING" | "IN_PROGRESS" | "FULFILLED" | "CLOSED";

export interface DeviceRequest {
  id: number;
  category: ProductCategory;
  itemName: string;
  details: string;
  budgetRupees: number | null;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  status: DeviceRequestStatus;
  createdAt: string;
  updatedAt: string;
}

export const DEVICE_REQUEST_STATUS_LABELS: Record<DeviceRequestStatus, string> = {
  PENDING: "Pending",
  IN_PROGRESS: "In Progress",
  FULFILLED: "Fulfilled",
  CLOSED: "Closed",
};
