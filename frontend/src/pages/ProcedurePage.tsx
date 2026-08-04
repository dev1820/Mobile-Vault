import { Link } from "react-router-dom";
import { Logo } from "../components/brand/Logo";
import { Button } from "../components/ui/Button";

// Placeholder contact details — replace with your real numbers and names.
const CONTACTS = [
  { label: "0300-1234567 — Ahmad Tahseen" },
  { label: "0300-7654321 — Support Team" },
];
const INSTAGRAM_HANDLE = import.meta.env.VITE_INSTAGRAM_HANDLE as string;

export function ProcedurePage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <div className="flex flex-col items-center gap-3 text-center">
        <Logo size="md" />
        <h1 className="font-display text-3xl font-semibold text-vault-white">Selling Procedure</h1>
        <p className="max-w-lg text-vault-silver">
          Want to sell your phone, trade it in, or get a fair valuation? Here&apos;s exactly how it
          works — no hidden steps, no lowball surprises.
        </p>
      </div>

      <div className="mt-8 flex flex-col gap-2">
        {CONTACTS.map((contact) => (
          <div
            key={contact.label}
            className="rounded-md border border-vault-silver/15 bg-vault-charcoal px-5 py-3 text-center text-sm text-vault-white"
          >
            {contact.label}
          </div>
        ))}
        <p className="mt-1 text-center text-sm text-vault-silver">
          Instagram:{" "}
          <a
            href={`https://instagram.com/${INSTAGRAM_HANDLE}`}
            target="_blank"
            rel="noreferrer"
            className="text-vault-gold hover:underline"
          >
            @{INSTAGRAM_HANDLE}
          </a>
        </p>
      </div>

      <div className="mt-10">
        <h2 className="font-display text-xl font-semibold uppercase tracking-wide text-vault-white">
          Selling Procedure
        </h2>
        <p className="mt-3 leading-relaxed text-vault-silver">
          To sell your device, please{" "}
          <Link to="/sell" className="text-vault-gold underline underline-offset-2 hover:text-vault-gold-light">
            fill out the sell your device form here
          </Link>
          . Once you&apos;ve submitted your details, our team will review your submission and reach
          out to confirm a rate and guide you through drop-off or pickup. Payment is cleared once
          the device has been received and verified.
        </p>
      </div>

      <div className="mt-10 flex justify-center">
        <Link to="/sell" className="w-full sm:w-auto">
          <Button className="w-full rounded-full px-10 py-4 text-sm sm:w-auto">Sell Your Device</Button>
        </Link>
      </div>
    </div>
  );
}
