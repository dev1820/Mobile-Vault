import { forwardRef, type TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, error, id, className = "", ...props },
  ref,
) {
  return (
    <label className="block">
      {label && (
        <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-vault-silver">
          {label}
        </span>
      )}
      <textarea
        ref={ref}
        id={id}
        className={`w-full rounded-md border border-vault-silver/25 bg-vault-charcoal px-3 py-2.5 text-vault-white placeholder:text-vault-silver/40 outline-none focus:border-vault-gold focus:ring-1 focus:ring-vault-gold ${className}`}
        {...props}
      />
      {error && <span className="mt-1 block text-xs text-red-400">{error}</span>}
    </label>
  );
});
