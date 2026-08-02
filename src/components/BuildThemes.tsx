import { siteContent } from "../app/site-content";

export function BuildThemes() {
  return (
    <section id="what-we-are-building" className="build-themes" aria-labelledby="themes-title">
      <div className="section-heading">
        <p>First release</p>
        <h2 id="themes-title">What we’re building</h2>
      </div>
      <div className="theme-grid">
        {siteContent.themes.map((theme) => (
          <article className="theme-card" key={theme.number}>
            <span>{theme.number}</span>
            <h3>{theme.title}</h3>
            <p>{theme.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
