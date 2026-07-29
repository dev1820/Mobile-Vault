import type { Product } from "../../types/product";

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER as string;
const PHONE_NUMBER = import.meta.env.VITE_PHONE_NUMBER as string;

export function ContactCTA({ product, className = "" }: { product: Product; className?: string }) {
  const isSold = product.status === "SOLD";

  const message = encodeURIComponent(
    `Hi Mobile Vault, I'm interested in the ${product.title} (PKR ${Number(product.priceRupees).toLocaleString("en-PK")}) listed on your website.`,
  );
  const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;

  return (
    <div className={`flex flex-col gap-3 sm:flex-row ${className}`}>
      <a
        href={isSold ? undefined : whatsappHref}
        target="_blank"
        rel="noreferrer"
        aria-disabled={isSold}
        className={`flex flex-1 items-center justify-center gap-2 rounded-md px-5 py-3 text-sm font-semibold uppercase tracking-wide transition-colors ${
          isSold
            ? "cursor-not-allowed bg-vault-charcoal text-vault-silver/40"
            : "bg-vault-gold text-vault-black hover:bg-vault-gold-light"
        }`}
        onClick={(e) => isSold && e.preventDefault()}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M12.04 2c-5.5 0-9.96 4.46-9.96 9.96 0 1.76.46 3.48 1.34 5L2 22l5.2-1.36a9.94 9.94 0 0 0 4.84 1.24h.01c5.5 0 9.96-4.46 9.96-9.96S17.54 2 12.04 2Zm5.8 14.24c-.24.68-1.4 1.3-1.94 1.38-.5.08-1.12.11-1.8-.11a16.5 16.5 0 0 1-1.63-.6c-2.86-1.24-4.73-4.1-4.87-4.29-.14-.19-1.17-1.55-1.17-2.96 0-1.4.74-2.09 1-2.38.26-.28.57-.35.76-.35.19 0 .38 0 .55.01.18.01.41-.07.64.49.24.58.81 2 .88 2.15.07.15.12.32.02.51-.1.19-.15.31-.3.48-.15.17-.31.38-.44.51-.15.14-.3.3-.13.59.17.29.76 1.25 1.63 2.03 1.12.99 2.06 1.3 2.35 1.45.29.14.46.12.63-.07.17-.19.71-.83.9-1.11.19-.29.38-.24.63-.14.26.1 1.66.78 1.94.93.29.14.48.21.55.33.07.12.07.68-.17 1.35Z" />
        </svg>
        {isSold ? "No Longer Available" : "Contact on WhatsApp"}
      </a>
      {!isSold && (
        <a
          href={`tel:${PHONE_NUMBER}`}
          className="flex flex-1 items-center justify-center gap-2 rounded-md border border-vault-gold/50 px-5 py-3 text-sm font-semibold uppercase tracking-wide text-vault-gold transition-colors hover:bg-vault-gold/10"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
            <path d="M4 4h4l2 5-2.5 1.5a12 12 0 0 0 6 6L15 14l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 2 6a2 2 0 0 1 2-2Z" />
          </svg>
          Call to Buy
        </a>
      )}
    </div>
  );
}
