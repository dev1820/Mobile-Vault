import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "danger" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    "bg-vault-gold text-vault-black hover:bg-vault-gold-light disabled:hover:bg-vault-gold",
  secondary:
    "bg-transparent border border-vault-gold/50 text-vault-gold hover:bg-vault-gold/10",
  danger: "bg-red-900/80 text-red-100 hover:bg-red-800",
  ghost: "bg-transparent text-vault-silver hover:text-vault-white",
};

export function Button({ variant = "primary", className = "", disabled, ...props }: ButtonProps) {
  return (
    <button
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-semibold uppercase tracking-wide transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${VARIANT_CLASSES[variant]} ${className}`}
      {...props}
    />
  );
}
