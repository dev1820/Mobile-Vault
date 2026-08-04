export type SimStatus = "PTA_APPROVED" | "NON_PTA" | "FACTORY_UNLOCKED" | "CARRIER_LOCKED";

export type RepairStatus = "ORIGINAL" | "SCREEN_REPLACED" | "BATTERY_REPLACED" | "OTHER_REPAIR";

export type AccessoriesIncluded = "BOX_ONLY" | "BOX_AND_CHARGER" | "ALL_ACCESSORIES" | "NONE";

export type SellRequestStatus = "PENDING" | "CONTACTED" | "ACCEPTED" | "REJECTED" | "COMPLETED";

export interface SellRequestImage {
  id: number;
  url: string;
  sortOrder: number;
}

export interface SellRequest {
  id: number;
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
  videoUrl: string | null;
  status: SellRequestStatus;
  createdAt: string;
  updatedAt: string;
  images: SellRequestImage[];
}

export const SIM_STATUS_LABELS: Record<SimStatus, string> = {
  PTA_APPROVED: "PTA Approved",
  NON_PTA: "Non-PTA",
  FACTORY_UNLOCKED: "Factory Unlocked",
  CARRIER_LOCKED: "Carrier Locked",
};

export const REPAIR_STATUS_LABELS: Record<RepairStatus, string> = {
  ORIGINAL: "Original / Unrepaired",
  SCREEN_REPLACED: "Screen Replaced",
  BATTERY_REPLACED: "Battery Replaced",
  OTHER_REPAIR: "Other Repair",
};

export const ACCESSORIES_LABELS: Record<AccessoriesIncluded, string> = {
  BOX_ONLY: "Box Only",
  BOX_AND_CHARGER: "Box & Charger",
  ALL_ACCESSORIES: "All Accessories",
  NONE: "None",
};

export const SELL_REQUEST_STATUS_LABELS: Record<SellRequestStatus, string> = {
  PENDING: "Pending",
  CONTACTED: "Contacted",
  ACCEPTED: "Accepted",
  REJECTED: "Rejected",
  COMPLETED: "Completed",
};
