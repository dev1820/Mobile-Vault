interface Badge {
  label: string;
  icon: React.ReactNode;
}

const iconProps = {
  width: 22,
  height: 22,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const BADGES: Badge[] = [
  {
    label: "100% Original",
    icon: (
      <svg {...iconProps}>
        <circle cx="12" cy="12" r="9" />
        <path d="m8.5 12.5 2.5 2.5 4.5-5" />
      </svg>
    ),
  },
  {
    label: "Secure Purchase",
    icon: (
      <svg {...iconProps}>
        <path d="M12 3 4.5 6v6c0 4.5 3.2 7.4 7.5 9 4.3-1.6 7.5-4.5 7.5-9V6L12 3Z" />
      </svg>
    ),
  },
  {
    label: "Warranty Assured",
    icon: (
      <svg {...iconProps}>
        <circle cx="12" cy="9" r="5.5" />
        <path d="M8.5 13.5 7 21l5-2.5 5 2.5-1.5-7.5" />
      </svg>
    ),
  },
  {
    label: "Expert Support",
    icon: (
      <svg {...iconProps}>
        <path d="M4 13a8 8 0 0 1 16 0" />
        <rect x="3" y="13" width="4" height="6" rx="1.5" />
        <rect x="17" y="13" width="4" height="6" rx="1.5" />
      </svg>
    ),
  },
];

export function TrustBadges({ className = "" }: { className?: string }) {
  return (
    <div className={`grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 ${className}`}>
      {BADGES.map((badge) => (
        <div key={badge.label} className="flex flex-col items-center gap-2 text-center">
          <span className="flex h-11 w-11 items-center justify-center rounded-full border border-vault-gold/40 text-vault-gold">
            {badge.icon}
          </span>
          <span className="text-xs sm:text-sm uppercase tracking-wide text-vault-silver">
            {badge.label}
          </span>
        </div>
      ))}
    </div>
  );
}
