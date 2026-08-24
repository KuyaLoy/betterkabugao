import { Link } from "react-router-dom";
import { siteContent } from "../app/site-content";

/**
 * Site footer for the "Kabugao in View" design.
 *
 * Dark surface, so it uses the inverse (light) repository logo. Cost figures
 * (₱0 to the public, ₱670 to build) live on /about only now — never in the
 * global footer. The brand column carries the consolidated independence and
 * BetterGov-network disclaimer once; the bottom row states where published
 * information is sourced, plus the build credit. A short set of destinations
 * sits between them.
 */
export function SiteFooter() {
  const { links, developer } = siteContent;

  return (
    <footer className="footer">
      <div className="shell footer__top">
        <div className="footer__brand">
          <img
            className="footer__logo"
            src="/brand/betterkabugao-logo-inverse.svg"
            alt="BetterKabugao.org"
            width="469"
            height="160"
          />
          <p className="footer__about">{siteContent.disclaimer}</p>
        </div>

        <nav className="footer__col" aria-label="Site">
          <h3>Find</h3>
          <div className="footer__links">
            <Link to="/government/barangays">The 21 barangays</Link>
            <Link to="/government/officials">Municipal officials</Link>
            <Link to="/emergency">Emergency hotlines</Link>
            <Link to="/about">About &amp; sources</Link>
            <Link to="/sitemap">Sitemap</Link>
          </div>
        </nav>

        <div className="footer__col">
          <h3>Network</h3>
          <div className="footer__links">
            <a href={links.repository} target="_blank" rel="noreferrer">GitHub repository</a>
            <a href={links.betterGov} target="_blank" rel="noreferrer">BetterGov.ph</a>
            <a href={links.directory} target="_blank" rel="noreferrer">BetterLGU Directory</a>
            <a href={links.apayao} target="_blank" rel="noreferrer">Province of Apayao</a>
          </div>
        </div>
      </div>

      <div className="shell footer__bottom">
        <p className="footer__disclaimer">{siteContent.sourceNote}</p>
        <p className="footer__built">
          Built by <b>{developer.name}</b> · {siteContent.license} · v{siteContent.version}
        </p>
      </div>
    </footer>
  );
}
