import geometry from "./geometry.json";

type BrandMarkProps = {
  variant?: "light" | "dark";
  className?: string;
};

/**
 * The BetterKabugao mark: the Kabugao silhouette beneath a three-ray sunrise.
 * This is the project's original logo — the geometry is fixed. Only colour
 * changes between the light and dark surfaces.
 */
export function BrandMark({ variant = "light", className }: BrandMarkProps) {
  const land = variant === "dark" ? "var(--color-white)" : "var(--color-primary-800)";

  return (
    <svg className={className} viewBox={geometry.viewBox} focusable="false" aria-hidden="true">
      <g fill="var(--color-gold)">
        {geometry.rays.map((ray) => (
          <path key={ray} d={ray} />
        ))}
      </g>
      <path d={geometry.kabugao} fill={land} />
    </svg>
  );
}
