import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Logo } from "../brand/Logo";
import { Wordmark } from "../brand/Wordmark";

const NAV_LINKS = [
  { to: "/", label: "Home", end: true },
  { to: "/catalog", label: "Catalog", end: false },
];

function navLinkClass({ isActive }: { isActive: boolean }) {
  return `text-sm uppercase tracking-wide transition-colors ${
    isActive ? "text-vault-gold" : "text-vault-silver hover:text-vault-white"
  }`;
}

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-vault-silver/10 bg-vault-black/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <NavLink to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <Logo size="sm" />
          <Wordmark size="sm" />
        </NavLink>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end} className={navLinkClass}>
              {link.label}
            </NavLink>
          ))}
          <NavLink to="/admin" className="text-xs uppercase tracking-wide text-vault-silver/50 hover:text-vault-gold">
            Admin
          </NavLink>
        </nav>

        <button
          type="button"
          aria-label="Toggle menu"
          className="flex h-9 w-9 items-center justify-center rounded-md border border-vault-silver/20 text-vault-white md:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-vault-silver/10 bg-vault-black px-4 py-3 md:hidden">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `rounded-md px-3 py-2.5 text-sm uppercase tracking-wide ${
                  isActive ? "bg-vault-charcoal text-vault-gold" : "text-vault-silver"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <NavLink
            to="/admin"
            onClick={() => setOpen(false)}
            className="rounded-md px-3 py-2.5 text-sm uppercase tracking-wide text-vault-silver/50"
          >
            Admin
          </NavLink>
        </nav>
      )}
    </header>
  );
}
