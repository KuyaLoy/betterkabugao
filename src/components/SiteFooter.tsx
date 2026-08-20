import { Link } from "react-router-dom";
import { siteContent } from "../app/site-content";
import { BrandLockup } from "../brand/BrandLockup";

export function SiteFooter() {
  const { links, costs, developer } = siteContent;

  return (
    <footer className="footer">
      <div className="shell footer__top">
        <div>
          <BrandLockup variant="dark" />
          <p className="footer__about">
            A volunteer-run civic portal for Kabugao, the capital of Apayao. Independent of the
            municipal government.
          </p>
        </div>

        <div>
          <h3>Project</h3>
          <div className="footer__links">
            <a href={links.repository} target="_blank" rel="noreferrer">GitHub repository</a>
            <Link to="/government/barangays">The 21 barangays</Link>
            <Link to="/government/officials">Municipal officials</Link>
            <Link to="/emergency">Emergency hotlines</Link>
            <Link to="/transparency">Transparency</Link>
            <Link to="/explore">Explore Kabugao</Link>
            <Link to="/services">Services</Link>
            <Link to="/about">About</Link>
            <Link to="/sitemap">Sitemap</Link>
          </div>
        </div>

        <div>
          <h3>Resources</h3>
          <div className="footer__links">
            <a href={links.openData} target="_blank" rel="noreferrer">Open Data Philippines</a>
            <a href={links.foi} target="_blank" rel="noreferrer">Freedom of Information</a>
            <a href={links.dilgFdp} target="_blank" rel="noreferrer">DILG Full Disclosure</a>
            <a href={links.philGeps} target="_blank" rel="noreferrer">PhilGEPS</a>
            <a href={links.apayao} target="_blank" rel="noreferrer">Province of Apayao</a>
          </div>
        </div>

        <div>
          <h3>Cost transparency</h3>
          <div className="footer__chips">
            <span className="chip chip--zero">
              {costs.toPeople.label} <b>{costs.toPeople.value}</b>
            </span>
            <span className="chip chip--build">
              {costs.toBuild.label} <b>{costs.toBuild.value}</b>
            </span>
          </div>
          <div className="footer__links footer__cta">
            <a href={links.betterGov} target="_blank" rel="noreferrer">BetterGov.ph</a>
            <a href={links.directory} target="_blank" rel="noreferrer">BetterLGU Directory</a>
          </div>
        </div>
      </div>

      <div className="shell footer__bottom">
        <p className="footer__disclaimer">
          {siteContent.disclaimer} {siteContent.sourceNote}
        </p>
        <p className="footer__built">
          Built by <b>{developer.name}</b> · {siteContent.license} · v{siteContent.version}
        </p>
      </div>
    </footer>
  );
}
