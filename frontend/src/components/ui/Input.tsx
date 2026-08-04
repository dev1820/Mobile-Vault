import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  rightSlot?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, id, className = "", rightSlot, ...props },
  ref,
) {
  return (
    <label className="block">
      {label && (
        <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-vault-silver">
          {label}
        </span>
      )}
      <div className="relative">
        <input
          ref={ref}
          id={id}
          className={`w-full rounded-md border border-vault-silver/25 bg-vault-charcoal px-3 py-2.5 text-vault-white placeholder:text-vault-silver/40 outline-none focus:border-vault-gold focus:ring-1 focus:ring-vault-gold ${rightSlot ? "pr-10" : ""} ${className}`}
          {...props}
        />
        {rightSlot && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">{rightSlot}</div>
        )}
      </div>
      {error && <span className="mt-1 block text-xs text-red-400">{error}</span>}
    </label>
  );
});
