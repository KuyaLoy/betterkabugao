import { Link } from "react-router-dom";
import { BrandLockup } from "../brand/BrandLockup";

export function SiteHeader() {
  return (
    <header className="masthead">
      <div className="shell masthead__inner">
        <Link to="/" aria-label="BetterKabugao home">
          <BrandLockup variant="light" />
        </Link>
        <nav className="masthead__nav" aria-label="Main">
          <Link className="masthead__link" to="/government">Government</Link>
          <Link className="masthead__link" to="/government/barangays">Barangays</Link>
          <Link className="masthead__link" to="/transparency">Transparency</Link>
          <Link className="masthead__link" to="/explore">Explore</Link>
          <Link className="masthead__link" to="/services">Services</Link>
          <Link className="masthead__link" to="/about">About</Link>
        </nav>
        <Link className="masthead__search" to="/search" aria-label="Search">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
            <path d="M10 2a8 8 0 1 1-4.9 14.3l-3.4 3.4-1.4-1.4 3.4-3.4A8 8 0 0 1 10 2Zm0 2a6 6 0 1 0 0 12 6 6 0 0 0 0-12Z" />
          </svg>
          <span>Search</span>
        </Link>
      </div>
    </header>
  );
}
