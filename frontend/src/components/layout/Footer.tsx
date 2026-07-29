import { Logo } from "../brand/Logo";
import { Wordmark } from "../brand/Wordmark";
import { TrustBadges } from "../brand/TrustBadges";

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER as string;
const PHONE_NUMBER = import.meta.env.VITE_PHONE_NUMBER as string;

export function Footer() {
  return (
    <footer className="border-t border-vault-silver/10 bg-vault-charcoal/40">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <TrustBadges />

        <div className="mt-10 flex flex-col items-center gap-4 border-t border-vault-silver/10 pt-8 text-center">
          <div className="flex items-center gap-3">
            <Logo size="sm" />
            <Wordmark size="sm" />
          </div>
          <p className="max-w-md text-sm text-vault-silver">
            Premium new &amp; used iPhones in Pakistan. Every device checked, every sale backed by trust.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-vault-silver">
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noreferrer"
              className="hover:text-vault-gold"
            >
              WhatsApp: {PHONE_NUMBER}
            </a>
            <a href={`tel:${PHONE_NUMBER}`} className="hover:text-vault-gold">
              Call: {PHONE_NUMBER}
            </a>
          </div>
          <p className="text-xs uppercase tracking-widest text-vault-silver/40">
            &copy; {new Date().getFullYear()} Mobile Vault. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
