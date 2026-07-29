import { forwardRef, type SelectHTMLAttributes } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, error, id, className = "", children, ...props },
  ref,
) {
  return (
    <label className="block">
      {label && (
        <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-vault-silver">
          {label}
        </span>
      )}
      <select
        ref={ref}
        id={id}
        className={`w-full rounded-md border border-vault-silver/25 bg-vault-charcoal px-3 py-2.5 text-vault-white outline-none focus:border-vault-gold focus:ring-1 focus:ring-vault-gold ${className}`}
        {...props}
      >
        {children}
      </select>
      {error && <span className="mt-1 block text-xs text-red-400">{error}</span>}
    </label>
  );
});
