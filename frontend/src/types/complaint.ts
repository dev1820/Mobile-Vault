export type ComplaintType =
  | "ORDER_ISSUE"
  | "PRODUCT_DEFECT"
  | "DELIVERY_ISSUE"
  | "PAYMENT_ISSUE"
  | "WARRANTY_CLAIM"
  | "OTHER";

export type ComplaintStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";

export interface ComplaintImage {
  id: number;
  url: string;
  sortOrder: number;
}

export interface Complaint {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  orderNumber: string;
  complaintType: ComplaintType;
  description: string;
  videoUrl: string | null;
  status: ComplaintStatus;
  createdAt: string;
  updatedAt: string;
  images: ComplaintImage[];
}

export const COMPLAINT_TYPE_LABELS: Record<ComplaintType, string> = {
  ORDER_ISSUE: "Order Issue",
  PRODUCT_DEFECT: "Product Defect",
  DELIVERY_ISSUE: "Delivery Issue",
  PAYMENT_ISSUE: "Payment Issue",
  WARRANTY_CLAIM: "Warranty Claim",
  OTHER: "Other",
};

export const COMPLAINT_STATUS_LABELS: Record<ComplaintStatus, string> = {
  OPEN: "Open",
  IN_PROGRESS: "In Progress",
  RESOLVED: "Resolved",
  CLOSED: "Closed",
};
