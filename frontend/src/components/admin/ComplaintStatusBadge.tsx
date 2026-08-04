import { COMPLAINT_STATUS_LABELS, type ComplaintStatus } from "../../types/complaint";

const COLOR_CLASSES: Record<ComplaintStatus, string> = {
  OPEN: "border-vault-gold/60 text-vault-gold",
  IN_PROGRESS: "border-sky-400/50 text-sky-300",
  RESOLVED: "border-emerald-400/50 text-emerald-300",
  CLOSED: "border-vault-silver/40 bg-vault-silver/10 text-vault-silver",
};

export function ComplaintStatusBadge({ status }: { status: ComplaintStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${COLOR_CLASSES[status]}`}
    >
      {COMPLAINT_STATUS_LABELS[status]}
    </span>
  );
}
