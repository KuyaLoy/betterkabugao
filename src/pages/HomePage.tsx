import { Link } from "react-router-dom";
import { MapView } from "../components/MapView";
import { SearchTrigger } from "../components/SearchOverlay";
import { KABUGAO } from "../app/site-content";
import { BARANGAYS, BARANGAY_CENSUS, BARANGAY_POPULATION_TOTAL } from "../data/barangays";
import { HOTLINES } from "../data/hotlines";
import { OFFICIALS_TERM } from "../data/officials";

/**
 * Homepage — "Kabugao in View".
 *
 * The real place carries the design: a full-bleed, self-hosted photograph of
 * the Apayao river at Barangay Dibagat (public domain, Andrew Garnett /
 * Wikimedia Commons) fills the first viewport, with the header over it, an
 * integrated search that opens the site-wide overlay, and one Emergency 911
 * action in the header. Below the hero, one unframed task strip; then a place
 * band that pairs the copy with the live OpenStreetMap map of all 21 barangays.
 */

const HERO_WIDTHS = [480, 640, 960, 1280] as const;
const heroSrcSet = (ext: string) =>
  HERO_WIDTHS.map((w) => `/hero/dibagat-river-${w}.${ext} ${w}w`).join(", ");

const TASKS = [
  { to: "/government/barangays", label: "Barangays", sub: `All ${BARANGAYS.length}, on the map`, icon: "pin" },
  { to: "/government/officials", label: "Officials", sub: `Your ${OFFICIALS_TERM} leaders`, icon: "people" },
  { to: "/emergency", label: "Hotlines", sub: `911 and ${HOTLINES.length} local offices`, icon: "phone" },
  { to: "/about", label: "About", sub: "Who runs this, and how", icon: "info" },
] as const;

function TaskIcon({ name }: { name: string }) {
  const paths: Record<string, React.ReactNode> = {
    pin: (
      <>
        <path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11Z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
    people: (
      <>
        <circle cx="9" cy="8" r="3.2" />
        <path d="M3.5 20a5.5 5.5 0 0 1 11 0" />
        <path d="M16 8h5M18.5 5.5v5" />
      </>
    ),
    phone: <path d="M5 4h4l2 5-3 2a12 12 0 0 0 5 5l2-3 5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />,
    info: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 11v5" />
        <circle cx="12" cy="7.6" r="1.1" fill="currentColor" stroke="none" />
      </>
    ),
  };
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" focusable="false">
      {paths[name]}
    </svg>
  );
}

export function HomePage() {
  return (
    <>
      <section className="kv-hero" aria-labelledby="home-title">
        <picture>
          <source type="image/avif" srcSet={heroSrcSet("avif")} sizes="100vw" />
          <source type="image/webp" srcSet={heroSrcSet("webp")} sizes="100vw" />
          <img
            className="kv-hero__img"
            src="/hero/dibagat-river-1280.jpg"
            srcSet={heroSrcSet("jpg")}
            sizes="100vw"
            width="1280"
            height="950"
            fetchPriority="high"
            alt="The Apayao river winding between forested Cordillera mountains at Barangay Dibagat, Kabugao"
          />
        </picture>
        <div className="kv-hero__scrim" aria-hidden="true" />
        <div className="shell kv-hero__inner">
          <p className="kv-hero__eyebrow">Kabugao · Apayao</p>
          <h1 id="home-title" className="kv-hero__title">
            Know your Kabugao.
          </h1>
          <p className="kv-hero__sub">
            Public information for Kabugao, Apayao — its {BARANGAYS.length} barangays, elected officials, and
            emergency numbers, each traced to its source.
          </p>
          <SearchTrigger className="kv-hero__search" ariaLabel="Search BetterKabugao">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
              <path d="M10 2a8 8 0 1 1-4.9 14.3l-3.4 3.4-1.4-1.4 3.4-3.4A8 8 0 0 1 10 2Zm0 2a6 6 0 1 0 0 12 6 6 0 0 0 0-12Z" />
            </svg>
            <span className="kv-hero__search-text">Search a barangay, an official, a hotline…</span>
            <kbd className="kv-hero__search-key">/</kbd>
          </SearchTrigger>
        </div>
        <span className="kv-hero__cue" aria-hidden="true">
          Explore
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true" focusable="false">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </span>
      </section>

      <nav className="kv-desk" aria-label="Main sections">
        <div className="shell kv-desk__inner">
          {TASKS.map((task) => (
            <Link className="kv-desk__item" to={task.to} key={task.to}>
              <span className="kv-desk__ic">
                <TaskIcon name={task.icon} />
              </span>
              <span className="kv-desk__text">
                <span className="kv-desk__label">{task.label}</span>
                <span className="kv-desk__sub">{task.sub}</span>
              </span>
            </Link>
          ))}
        </div>
      </nav>

      <section className="kv-place" aria-labelledby="place-title">
        <div className="shell kv-place__inner">
          <div className="kv-place__text">
            <h2 id="place-title" className="kv-place__title">
              Explore Kabugao&rsquo;s {BARANGAYS.length} barangays.
            </h2>
            <p className="kv-place__lede">
              Find population, location, directions, and source details for every barangay.
            </p>
            <dl className="kv-place__figs">
              <div className="kv-place__fig">
                <dt>Barangays</dt>
                <dd>{BARANGAYS.length}</dd>
              </div>
              <div className="kv-place__fig">
                <dt>Residents</dt>
                <dd>{BARANGAY_POPULATION_TOTAL.toLocaleString("en-PH")}</dd>
              </div>
              <div className="kv-place__fig">
                <dt>Land area</dt>
                <dd>{KABUGAO.areaLabel}</dd>
              </div>
            </dl>
            <Link className="btn btn--solid kv-place__link" to="/government/barangays">
              Explore the barangays →
            </Link>
            <p className="kv-place__source">
              Population: {BARANGAY_CENSUS} (Philippine Statistics Authority). Photograph: Dibagat River,
              Kabugao — Andrew Garnett / Wikimedia Commons, Public Domain. Map data &copy; OpenStreetMap
              contributors (ODbL).
            </p>
          </div>
          <div className="kv-place__map">
            <MapView
              slugs={BARANGAYS.map((b) => b.slug)}
              height="tall"
              label={`Map of all ${BARANGAYS.length} barangays of Kabugao`}
            />
          </div>
        </div>
      </section>
    </>
  );
}
