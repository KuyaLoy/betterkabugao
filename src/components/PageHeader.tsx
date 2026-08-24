import type { ReactNode } from "react";
import { Link } from "react-router-dom";

type Crumb = { label: string; href?: string };

type PageHeaderProps = {
  /** Small uppercase label above the title. */
  eyebrow?: string;
  title: string;
  description?: string;
  breadcrumbs: Crumb[];
  /** Search box, buttons — sits right of the title on wide screens. */
  actions?: ReactNode;
  /** Counts or status pills under the description. */
  badges?: ReactNode;
  /**
   * "hero"/"compact" are the original interior headers. "kv" is the additive
   * "Kabugao in View" interior header (solid navy, gold-rule eyebrow, kv type)
   * used by the Government hub and Officials in Checkpoint 2A — same markup,
   * one extra modifier class, so the existing variants stay unchanged.
   */
  variant?: "hero" | "compact" | "kv";
};

function Breadcrumbs({ items }: { items: Crumb[] }) {
  if (items.length < 2) return null;

  return (
    <nav className="crumbs" aria-label="Breadcrumb">
      <ol>
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`}>
            {item.href ? (
              <Link to={item.href}>{item.label}</Link>
            ) : (
              <span aria-current="page">{item.label}</span>
            )}
            {index < items.length - 1 ? (
              <span className="crumbs__sep" aria-hidden="true">
                /
              </span>
            ) : null}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  breadcrumbs,
  actions,
  badges,
  variant = "compact",
}: PageHeaderProps) {
  return (
    <div className={`page-head page-head--${variant}`}>
      <div className="shell">
        <Breadcrumbs items={breadcrumbs} />
        <div className="page-head__row">
          <div className="page-head__text">
            {eyebrow ? <p className="page-head__eyebrow">{eyebrow}</p> : null}
            <h1>{title}</h1>
            {description ? <p className="page-head__desc">{description}</p> : null}
            {badges ? <div className="page-head__badges">{badges}</div> : null}
          </div>
          {actions ? <div className="page-head__actions">{actions}</div> : null}
        </div>
      </div>
    </div>
  );
}
