import { siteContent } from "../app/site-content";
import { BrandLockup } from "../brand/BrandLockup";

export function SiteHeader() {
  return (
    <header className="masthead">
      <div className="shell masthead__inner">
        <a href="/" aria-label="BetterKabugao home">
          <BrandLockup variant="light" />
        </a>
        <nav className="masthead__nav" aria-label="Sections">
          <a className="masthead__link" href="#transparency">Transparency</a>
          <a className="masthead__link" href="#explore">Explore Kabugao</a>
          <a className="masthead__link" href="#services">Services</a>
          <a className="masthead__link" href="#about">About</a>
        </nav>
        <p className="masthead__status">{siteContent.status}</p>
      </div>
    </header>
  );
}
