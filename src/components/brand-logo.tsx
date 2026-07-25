import { cn } from "@/lib/utils";

export function BrandLogo({
  compact = false,
  className,
}: {
  compact?: boolean;
  className?: string;
}) {
  return (
    <span className={cn("brand-logo", className)}>
      <svg
        className="brand-logo-mark"
        viewBox="0 0 48 48"
        role="img"
        aria-label="HS Bio"
      >
        <rect width="48" height="48" rx="15" fill="currentColor" />
        <path
          d="M13.5 13.5v21m0-10.5h10m0-10.5v21"
          fill="none"
          stroke="var(--brand-cutout, #f7f5ef)"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="3.2"
        />
        <path
          d="M35.5 16.2c-1.2-2-6.9-2.5-8.2.7-1.9 4.7 8.5 4.4 8.5 10.8 0 5.3-7.9 7.1-10.7 2.8"
          fill="none"
          stroke="var(--brand-accent, #a78bfa)"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="3.2"
        />
      </svg>
      {!compact && (
        <span className="brand-logo-type">
          <strong>HS</strong>
          <span>Bio</span>
        </span>
      )}
    </span>
  );
}
