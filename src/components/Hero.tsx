import { siteContent, KABUGAO } from "../app/site-content";

const TAG_LABEL: Record<string, string> = {
  done: "Live",
  progress: "In progress",
  planned: "Planned",
};

export function Hero() {
  const { buildStatus } = siteContent;

  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="shell hero__inner">
        <div>
          <span className="hero__eyebrow">{siteContent.eyebrow}</span>
          <h1 id="hero-title">{siteContent.headline}</h1>
          <p className="hero__lede">{siteContent.summary}</p>
          <div className="hero__actions">
            <a className="btn btn--primary" href="#transparency">
              See what’s being built
            </a>
            <a
              className="btn btn--ghost"
              href={siteContent.links.repository}
              target="_blank"
              rel="noreferrer"
            >
              View the repository
            </a>
          </div>
          <p className="hero__meta">
            <span><b>{KABUGAO.coordinatesLabel}</b></span>
            <span>Elevation <b>{KABUGAO.elevationLabel}</b></span>
            <span><b>{KABUGAO.barangays}</b> barangays</span>
            <span>Capital of <b>Apayao</b></span>
          </p>
        </div>

        <div className="status-card">
          <div className="status-card__head">
            <h2>{buildStatus.title}</h2>
            <span>{siteContent.version}</span>
          </div>
          <ul className="status-card__list">
            {buildStatus.items.map((item) => (
              <li className="status-card__row" key={item.label}>
                {item.label}
                <span className={`status-tag status-tag--${item.state}`}>{TAG_LABEL[item.state]}</span>
              </li>
            ))}
          </ul>
          <p className="status-card__foot">
            {buildStatus.footnote}{" "}
            <a href={siteContent.links.repository} target="_blank" rel="noreferrer">
              GitHub →
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
