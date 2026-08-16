import { BrandMark } from "./BrandMark";

type BrandLockupProps = {
  variant?: "light" | "dark";
  className?: string;
};

/**
 * Horizontal lockup used in the header and footer: the mark beside a
 * two-line "Better / Kabugao .org" wordmark — the lockup pattern shared
 * across the BetterLGU network.
 */
export function BrandLockup({ variant = "light", className }: BrandLockupProps) {
  return (
    <span className={["brand-lockup", `brand-lockup--${variant}`, className].filter(Boolean).join(" ")}>
      <BrandMark className="brand-lockup__mark" variant={variant} />
      <span className="brand-lockup__words">
        <span className="brand-lockup__better">Better</span>
        <span className="brand-lockup__place">
          Kabugao<span className="brand-lockup__tld">.org</span>
        </span>
      </span>
    </span>
  );
}
