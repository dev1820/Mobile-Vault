interface WordmarkProps {
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
  className?: string;
}

const TEXT_SIZES = {
  sm: "text-lg",
  md: "text-2xl",
  lg: "text-4xl sm:text-5xl",
} as const;

export function Wordmark({ size = "md", showTagline = false, className = "" }: WordmarkProps) {
  return (
    <div className={className}>
      <span
        className={`${TEXT_SIZES[size]} font-display font-bold uppercase tracking-[0.15em] bg-gradient-to-r from-vault-gold via-vault-gold-light to-vault-gold bg-clip-text text-transparent`}
      >
        Mobile Vault
      </span>
      {showTagline && (
        <p className="mt-1 text-xs sm:text-sm uppercase tracking-[0.25em] text-vault-silver/80">
          Smartphones <span className="mx-1 text-vault-gold/60">|</span> Accessories{" "}
          <span className="mx-1 text-vault-gold/60">|</span> Trust
        </p>
      )}
    </div>
  );
}
