import { Link } from "react-router-dom";
import { MapView } from "../components/MapView";
import { SiteSearch } from "../components/SiteSearch";
import { KABUGAO, siteContent } from "../app/site-content";
import { BARANGAYS, BARANGAY_POPULATION_TOTAL, BY_POPULATION } from "../data/barangays";
import { EXECUTIVE, OFFICIALS_TERM } from "../data/officials";

const AVAILABLE = [
  {
    to: "/government/barangays",
    kicker: "Available now",
    title: `All ${BARANGAYS.length} barangays`,
    body: "Population, PSGC code, location and driving directions for every barangay — each with its own page.",
  },
  {
    to: "/government/officials",
    kicker: "Available now",
    title: "Elected officials",
    body: `The mayor, vice mayor and Sangguniang Bayan for ${OFFICIALS_TERM}, from the municipality's own platform.`,
  },
  {
    to: "/transparency",
    kicker: "In progress",
    title: "Public money and projects",
    body: "Budgets, procurement and public works — the fields each record will carry, and where the data comes from.",
  },
  {
    to: "/explore",
    kicker: "Planned",
    title: "Explore Kabugao",
    body: "Rivers, mountains, barangay profiles, Isnag heritage and responsible tourism.",
  },
  {
    to: "/services",
    kicker: "Planned",
    title: "Services and offices",
    body: "Plain-language guides to certificates, permits, offices and contacts.",
  },
  {
    to: "/about",
    kicker: "About",
    title: "Who runs this, and how",
    body: "An independent volunteer project. What it costs, who built it, and how to contribute.",
  },
];

export function HomePage() {
  const largest = BY_POPULATION[0];

  return (
    <>
      <section className="home-hero" aria-labelledby="home-title">
        <div className="shell home-hero__inner">
          <div>
            <p className="home-hero__eyebrow">{siteContent.eyebrow}</p>
            <h1 id="home-title">Public information about Kabugao, in one place.</h1>
            <p className="home-hero__lede">
              An independent, volunteer-run portal for Kabugao, the capital of Apayao — starting with the{" "}
              {BARANGAYS.length} barangays and the officials who represent you, and building towards public
              spending and public projects. Every figure names its source.
            </p>
            <div className="home-hero__search">
              <SiteSearch placeholder="Search a barangay, an official, a page…" />
            </div>
            <p className="home-hero__quick">
              Popular:{" "}
              <Link to="/government/barangays/poblacion">Poblacion</Link>
              <Link to="/government/barangays">All barangays</Link>
              <Link to="/government/officials">Officials</Link>
            </p>
          </div>

          <dl className="glance">
            <p className="glance__title">Kabugao at a glance</p>
            <div>
              <dt>Population</dt>
              <dd>
                {BARANGAY_POPULATION_TOTAL.toLocaleString("en-PH")}
                <span>{KABUGAO.populationYear} POPCEN</span>
              </dd>
            </div>
            <div>
              <dt>Barangays</dt>
              <dd>
                {BARANGAYS.length}
                <span>largest: {largest.name}</span>
              </dd>
            </div>
            <div>
              <dt>Land area</dt>
              <dd>
                {KABUGAO.areaLabel}
                <span>capital of Apayao</span>
              </dd>
            </div>
            <div>
              <dt>Income class</dt>
              <dd>
                {KABUGAO.incomeClass}
                <span>PSGC {KABUGAO.psgc}</span>
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="section" aria-labelledby="what-title">
        <div className="shell">
          <div className="section__head">
            <p className="kicker">What's here</p>
            <h2 id="what-title">Start with what's published</h2>
            <p className="section__body">
              This site ships one section at a time, and says plainly which parts are ready. Nothing is
              published until it can be traced to an official source.
            </p>
          </div>

          <div className="card-grid">
            {AVAILABLE.map((item) => (
              <Link className="nav-card" to={item.to} key={item.to}>
                <span className="nav-card__kicker">{item.kicker}</span>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
                <span className="nav-card__go" aria-hidden="true">
                  →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--tint" aria-labelledby="map-title">
        <div className="shell">
          <div className="section__head">
            <p className="kicker">Where things are</p>
            <h2 id="map-title">Where they are</h2>
            <p className="section__body">
              Every barangay at its recorded coordinates, spread along the Apayao river valley. Select
              a marker for its population and a link to its page.
            </p>
          </div>
          <MapView
            slugs={BARANGAYS.map((b) => b.slug)}
            height="tall"
            label={`Map of all ${BARANGAYS.length} barangays of Kabugao`}
          />
        </div>
      </section>

      <section className="section" aria-labelledby="rep-title">
        <div className="shell split">
          <div>
            <p className="kicker">Who represents you</p>
            <h2 id="rep-title">Kabugao's executive, {OFFICIALS_TERM}</h2>
            <p className="section__body">
              Sourced from the municipality's own government platform rather than a third-party directory.
              The full Sangguniang Bayan is on the officials page.
            </p>
            <p className="section__note">
              <Link to="/government/officials">See all elected officials →</Link>
            </p>
          </div>
          <div className="official-grid official-grid--exec">
            {EXECUTIVE.map((o) => (
              <article className="official official--lead" key={o.name}>
                <p className="official__post">{o.position}</p>
                <h3>{o.name}</h3>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mission" aria-labelledby="mission-title">
        <div className="shell mission__inner">
          <div>
            <p className="kicker">{siteContent.mission.kicker}</p>
            <h2 id="mission-title">{siteContent.mission.title}</h2>
            <p className="mission__body">{siteContent.mission.body}</p>
            <p className="mission__note">{siteContent.mission.networkNote}</p>
            <div className="mission__actions">
              <a className="btn btn--primary" href={siteContent.links.repository} target="_blank" rel="noreferrer">
                Contribute on GitHub
              </a>
              <Link className="btn btn--ghost" to="/about">
                About this project
              </Link>
            </div>
          </div>
          <div className="cost-panel">
            <div className="cost-row cost-row--zero">
              <span className="cost-row__label">{siteContent.costs.toPeople.label}</span>
              <span className="cost-row__value">{siteContent.costs.toPeople.value}</span>
            </div>
            <div className="cost-row cost-row--build">
              <span className="cost-row__label">{siteContent.costs.toBuild.label}</span>
              <span className="cost-row__value">{siteContent.costs.toBuild.value}</span>
            </div>
            <p className="cost-panel__note">{siteContent.costs.toBuild.note}</p>
          </div>
        </div>
      </section>
    </>
  );
}
