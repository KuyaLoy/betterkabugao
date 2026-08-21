import { Link } from "react-router-dom";
import { MapView } from "../components/MapView";
import { SearchTrigger } from "../components/SearchOverlay";
import { KABUGAO, siteContent } from "../app/site-content";
import {
  BARANGAYS,
  BARANGAY_CENSUS,
  BARANGAY_POPULATION_TOTAL,
  BY_POPULATION,
  populationShare,
} from "../data/barangays";
import { HOTLINES } from "../data/hotlines";
import { EXECUTIVE, OFFICIALS_TERM } from "../data/officials";

/**
 * The front-desk actions. Four, deliberately: search already sits above them,
 * and a fifth item turns a quick decision into a list to read. Every
 * destination is a real route that also exists in the masthead or footer, so
 * the homepage answers "where do I go?" without requiring a scroll.
 */
const FRONT_DESK = [
  { to: "/government/barangays", label: "All 21 barangays", sub: "population, maps, directions" },
  { to: "/emergency", label: "Emergency hotlines", sub: `911 and ${HOTLINES.length} local offices` },
  { to: "/government/officials", label: "Elected officials", sub: OFFICIALS_TERM },
  { to: "/about", label: "About & sources", sub: "who runs this, what it costs" },
] as const;

/** What is genuinely usable today. Emergency was missing from the old grid. */
const READY = [
  {
    to: "/government/barangays",
    title: `All ${BARANGAYS.length} barangays`,
    body: "Population, PSGC code, location and driving directions for every barangay — each with its own page.",
  },
  {
    to: "/government/officials",
    title: "Elected officials",
    body: `The mayor, vice mayor and Sangguniang Bayan for ${OFFICIALS_TERM}, from the municipality's own platform.`,
  },
  {
    to: "/emergency",
    title: "Emergency hotlines",
    body: "Every number the municipality has published, in +63 form so family abroad can dial too.",
  },
] as const;

const BUILDING = [
  {
    to: "/transparency",
    tag: "In progress",
    title: "Public money and projects",
    body: "Budgets, procurement and public works — the fields each record will carry, and where the data comes from.",
  },
  {
    to: "/explore",
    tag: "Planned",
    title: "Explore Kabugao",
    body: "Rivers, mountains, barangay profiles, Isnag heritage and responsible tourism.",
  },
  {
    to: "/services",
    tag: "Planned",
    title: "Services and offices",
    body: "Plain-language guides to certificates, permits, offices and contacts.",
  },
] as const;

export function HomePage() {
  const top = BY_POPULATION.slice(0, 6);

  return (
    <>
      {/* ------- First viewport: the command area ------- */}
      <section className="home-hero" aria-labelledby="home-title">
        <div className="shell home-hero__inner">
          <div className="home-hero__lead">
            <p className="home-hero__eyebrow">{siteContent.eyebrow}</p>
            <h1 id="home-title">Public information about Kabugao, in one place.</h1>
            <p className="home-hero__lede">
              An independent, volunteer-run portal for Kabugao, the capital of Apayao — the{" "}
              {BARANGAYS.length} barangays, the officials who represent you, the emergency numbers
              the municipality has published, and public spending as records are verified. Every
              figure names its source.
            </p>

            <div className="home-hero__search">
              <SearchTrigger className="search__field search__trigger" ariaLabel="Search BetterKabugao">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
                  <path d="M10 2a8 8 0 1 1-4.9 14.3l-3.4 3.4-1.4-1.4 3.4-3.4A8 8 0 0 1 10 2Zm0 2a6 6 0 1 0 0 12 6 6 0 0 0 0-12Z" />
                </svg>
                <span className="search__placeholder">Search a barangay, an official, a hotline…</span>
                <kbd className="search__key">/</kbd>
              </SearchTrigger>
            </div>

            <nav className="home-desk" aria-label="Start here">
              {FRONT_DESK.map((item) => (
                <Link className="home-desk__item" to={item.to} key={item.to}>
                  <span className="home-desk__label">{item.label}</span>
                  <span className="home-desk__sub">{item.sub}</span>
                </Link>
              ))}
            </nav>

            <p className="home-hero__trust">
              Not the official website of the Municipality of Kabugao — independent and volunteer-run.
            </p>
          </div>

          {/* The record card: the municipality's headline facts, presented the
              way a registry record would be — labels, values, and the source. */}
          <dl className="glance">
            <p className="glance__title">
              Kabugao at a glance
              <span className="glance__source">{BARANGAY_CENSUS} · PSA</span>
            </p>
            <div>
              <dt>Population</dt>
              <dd>{BARANGAY_POPULATION_TOTAL.toLocaleString("en-PH")}</dd>
            </div>
            <div>
              <dt>Barangays</dt>
              <dd>
                {BARANGAYS.length}
                <span>largest: {top[0].name}</span>
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

      {/* ------- The portal index: rows, not a card wall ------- */}
      <section className="section section--dense" aria-labelledby="what-title">
        <div className="shell">
          <div className="section__head">
            <p className="kicker">What's here</p>
            <h2 id="what-title">Start with what's published</h2>
            <p className="section__body">
              This site ships one section at a time, and says plainly which parts are ready. Nothing is
              published until it can be traced to an official source.
            </p>
          </div>

          <div className="home-index">
            <section className="home-index__group" aria-labelledby="ready-title">
              <h3 id="ready-title" className="home-index__heading">
                Ready now
              </h3>
              <ul className="home-index__list">
                {READY.map((item) => (
                  <li key={item.to}>
                    <Link className="home-index__row" to={item.to}>
                      <span className="home-index__text">
                        <span className="home-index__title">{item.title}</span>
                        <span className="home-index__body">{item.body}</span>
                      </span>
                      <span className="home-index__go" aria-hidden="true">→</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>

            <section className="home-index__group" aria-labelledby="building-title">
              <h3 id="building-title" className="home-index__heading">
                Being built
              </h3>
              <ul className="home-index__list">
                {BUILDING.map((item) => (
                  <li key={item.to}>
                    <Link className="home-index__row" to={item.to}>
                      <span className="home-index__text">
                        <span className="home-index__title">
                          {item.title}
                          <em className="home-index__tag">{item.tag}</em>
                        </span>
                        <span className="home-index__body">{item.body}</span>
                      </span>
                      <span className="home-index__go" aria-hidden="true">→</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </section>

      {/* ------- Barangays: the map with its data beside it ------- */}
      <section className="section--tint section section--dense" aria-labelledby="map-title">
        <div className="shell">
          <div className="section__head">
            <p className="kicker">The {BARANGAYS.length} barangays</p>
            <h2 id="map-title">Spread along the Apayao river valley</h2>
            <p className="section__body">
              Every barangay at its recorded coordinates. Select a marker for its population and a link
              to its page — or start from the largest.
            </p>
          </div>

          <div className="home-map">
            <MapView
              slugs={BARANGAYS.map((b) => b.slug)}
              height="tall"
              label={`Map of all ${BARANGAYS.length} barangays of Kabugao`}
            />
            <div className="home-bgy">
              <p className="home-bgy__title">Largest by population</p>
              <ol className="home-bgy__list">
                {top.map((b) => (
                  <li key={b.slug}>
                    <Link to={`/government/barangays/${b.slug}`}>
                      <span className="home-bgy__name">{b.name}</span>
                      <span className="home-bgy__num">
                        {b.population.toLocaleString("en-PH")}
                        <span className="home-bgy__share">{populationShare(b)}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ol>
              <Link className="home-bgy__all" to="/government/barangays">
                All {BARANGAYS.length} barangays, with directions →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ------- Who represents you (unchanged) ------- */}
      <section className="section section--dense" aria-labelledby="rep-title">
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

      {/* ------- Mission and cost (unchanged) ------- */}
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
