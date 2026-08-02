import { siteContent } from "../app/site-content";
import { BrandArtwork } from "./BrandArtwork";

export function LaunchHero() {
  return (
    <section className="launch-hero" aria-labelledby="launch-title">
      <div className="hero-copy">
        <p className="status-label"><span aria-hidden="true" />{siteContent.status}</p>
        <h1 id="launch-title">{siteContent.headline}</h1>
        <p className="hero-summary">{siteContent.summary}</p>
        <div className="hero-actions">
          <a className="primary-action" href="#what-we-are-building">See what we’re building</a>
          <a className="secondary-action" href={siteContent.repositoryUrl} target="_blank" rel="noreferrer">
            View the project on GitHub
          </a>
        </div>
      </div>
      <BrandArtwork />
    </section>
  );
}
