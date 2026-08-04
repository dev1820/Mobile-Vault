export type OrderStatus =
  | "PENDING_VERIFICATION"
  | "ADVANCE_CONFIRMED"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED";

export interface Order {
  id: number;
  productId: number | null;
  productTitle: string;
  productPriceRupees: number;
  advanceAmountRupees: number;
  customerFirstName: string;
  customerLastName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
  deliveryCity: string;
  deliveryNotes: string | null;
  paymentProofUrl: string;
  paymentReference: string | null;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING_VERIFICATION: "Pending Verification",
  ADVANCE_CONFIRMED: "Advance Confirmed",
  OUT_FOR_DELIVERY: "Out for Delivery",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};
