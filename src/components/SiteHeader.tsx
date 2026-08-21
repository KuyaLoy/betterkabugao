import { useEffect, useId, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { SEARCH_TRIGGER_ID } from "../lib/search-overlay";
import { SearchTrigger } from "./SearchOverlay";

/**
 * Site header for the "Kabugao in View" design.
 *
 * Two states from one component:
 * - On the homepage it sits *over* the photo hero, transparent, so the image
 *   runs to the top of the viewport (`--over`).
 * - Everywhere else it is a solid navy bar, sticky (`--solid`).
 *
 * Both surfaces are dark, so the header always uses the inverse (light) logo —
 * the real repository asset, never an HTML wordmark. The emergency action and
 * the search trigger are present on every page; the four task links collapse
 * behind a disclosure button on narrow screens.
 */
const NAV = [
  { to: "/government/barangays", label: "Barangays" },
  { to: "/government/officials", label: "Officials" },
  { to: "/emergency", label: "Hotlines" },
  { to: "/about", label: "About" },
] as const;

export function SiteHeader() {
  const { pathname } = useLocation();
  const over = pathname === "/";
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const burger = useRef<HTMLButtonElement | null>(null);

  // Escape closes the disclosure and returns focus to the button.
  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        burger.current?.focus();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className={over ? "mast mast--over" : "mast mast--solid"}>
      <div className="shell mast__inner">
        <Link className="mast__home" to="/" aria-label="BetterKabugao.org home">
          <img
            className="mast__logo"
            src="/brand/betterkabugao-logo-inverse.svg"
            alt="BetterKabugao.org"
            width="469"
            height="160"
          />
        </Link>

        <nav className="mast__nav" aria-label="Primary">
          {NAV.map((item) => (
            <Link className="mast__link" to={item.to} key={item.to}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mast__actions">
          <SearchTrigger id={SEARCH_TRIGGER_ID} className="mast__search" ariaLabel="Search">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
              <path d="M10 2a8 8 0 1 1-4.9 14.3l-3.4 3.4-1.4-1.4 3.4-3.4A8 8 0 0 1 10 2Zm0 2a6 6 0 1 0 0 12 6 6 0 0 0 0-12Z" />
            </svg>
            <span className="mast__search-label">Search</span>
          </SearchTrigger>

          <Link className="mast__emerg" to="/emergency" aria-label="Emergency — call 911 and see local hotlines">
            <span className="mast__emerg-dot" aria-hidden="true" />
            <span className="mast__emerg-long">Emergency </span>911
          </Link>

          <button
            ref={burger}
            type="button"
            className="mast__burger"
            aria-expanded={open}
            aria-controls={menuId}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
          >
            <span className="mast__burger-icon" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Mobile disclosure: same task links, one per row, inert when closed. */}
      <nav
        id={menuId}
        className={open ? "mast__menu mast__menu--open" : "mast__menu"}
        aria-label="Menu"
        hidden={!open}
      >
        {NAV.map((item) => (
          <Link className="mast__menu-link" to={item.to} key={item.to} onClick={() => setOpen(false)}>
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
