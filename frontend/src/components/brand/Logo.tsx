import logoSrc from "../../assets/logo.png";

const SIZES = {
  sm: 36,
  md: 48,
  lg: 96,
} as const;

interface LogoProps {
  size?: keyof typeof SIZES;
  className?: string;
}

// Real Mobile Vault logo mark (src/assets/logo.png). The `<Logo size="md" />`
// API is kept stable so call sites don't need to change if the asset is swapped again.
export function Logo({ size = "md", className = "" }: LogoProps) {
  const height = SIZES[size];

  return (
    <img
      src={logoSrc}
      alt="Mobile Vault"
      height={height}
      style={{ height, width: "auto" }}
      className={className}
    />
  );
}
