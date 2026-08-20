import { useMemo, useState, useSyncExternalStore } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { BARANGAYS } from "../data/barangays";
import { RECOVERY_LINKS } from "../lib/seo";
import {
  QUICK_SEARCHES,
  SEARCH_KINDS,
  SEARCH_KIND_LABELS,
  type SearchEntry,
  searchSite,
} from "../lib/search";

/**
 * There is no store to subscribe to — this reports only whether hydration has
 * finished. `?q=` cannot be read on the first client render: every route is
 * prerendered without a query string, so reading it immediately would make the
 * first client render disagree with the served HTML and React would report a
 * hydration mismatch. `useSyncExternalStore` uses the server snapshot during
 * hydration and re-renders once, which is the same trick the clock uses.
 */
const NO_SUBSCRIBE = () => () => {};

function useHydrated(): boolean {
  return useSyncExternalStore(
    NO_SUBSCRIBE,
    () => true,
    () => false,
  );
}

function ResultLink({ entry }: { entry: SearchEntry }) {
  return (
    <li>
      <Link to={entry.path}>
        <span className="search__title">{entry.title}</span>
        <span className="search__desc">{entry.summary}</span>
      </Link>
    </li>
  );
}

/**
 * The /search page.
 *
 * Distinct from `SiteSearch`, which is the compact masthead dropdown: this one
 * owns a URL (`/search?q=…` is shareable), groups its results by kind, and has
 * something to show before anything is typed. Both score through the same
 * `searchSite` index, so there is one search, rendered two ways.
 */
export function SearchPanel() {
  const hydrated = useHydrated();
  const [params, setParams] = useSearchParams();
  const urlQuery = hydrated ? (params.get("q") ?? "") : "";

  // `null` means "the visitor has not typed yet", so the box follows the URL
  // until they do. Avoids syncing state from a prop inside an effect.
  const [typed, setTyped] = useState<string | null>(null);
  const query = typed ?? urlQuery;
  const trimmed = query.trim();

  const groups = useMemo(() => {
    const results = searchSite(trimmed);
    return SEARCH_KINDS.map((kind) => ({
      kind,
      entries: results.filter((entry) => entry.kind === kind),
    })).filter((group) => group.entries.length > 0);
  }, [trimmed]);

  const total = groups.reduce((count, group) => count + group.entries.length, 0);

  return (
    <div className="finder">
      {/* A real form, so the query survives a submit and lands on a shareable
          URL. The handler keeps it a same-page update when scripting is on. */}
      <form
        className="finder__form"
        method="get"
        action="/search"
        onSubmit={(event) => {
          event.preventDefault();
          setParams(trimmed ? { q: trimmed } : {});
        }}
      >
        <label className="finder__label" htmlFor="site-search">
          Search everything published here
        </label>
        <div className="finder__row">
          <input
            id="site-search"
            className="finder__input"
            type="search"
            name="q"
            value={query}
            onChange={(event) => setTyped(event.target.value)}
            placeholder="A barangay, an official, a hotline, a PSGC code…"
            autoComplete="off"
          />
          <button className="btn btn--solid" type="submit">
            Search
          </button>
        </div>
      </form>

      {trimmed.length < 2 ? (
        <div className="finder__start">
          <section aria-labelledby="finder-try">
            <h2 id="finder-try">Try a search</h2>
            <ul className="finder__chips">
              {QUICK_SEARCHES.map((term) => (
                <li key={term}>
                  <Link to={`/search?q=${encodeURIComponent(term)}`}>{term}</Link>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="finder-browse">
            <h2 id="finder-browse">Or browse</h2>
            <ul className="plain-list">
              {RECOVERY_LINKS.filter((link) => link.to !== "/search").map((link) => (
                <li key={link.to}>
                  <Link to={link.to}>{link.label}</Link>
                  <span className="plain-list__meta">{link.to}</span>
                </li>
              ))}
            </ul>
          </section>

          <p className="finder__note">
            Results appear as you type, which needs JavaScript. Every page is also
            listed on the <Link to="/sitemap">sitemap</Link>.
          </p>
        </div>
      ) : total > 0 ? (
        <div className="finder__results">
          <p className="list-count">
            {total} {total === 1 ? "result" : "results"} for “{trimmed}”
          </p>
          {groups.map((group) => (
            <section key={group.kind} aria-labelledby={`finder-${group.kind}`}>
              <div className="finder__kind">
                <h2 id={`finder-${group.kind}`}>{SEARCH_KIND_LABELS[group.kind]}</h2>
                <span className="finder__count">{group.entries.length}</span>
              </div>
              <ul className="finder__list">
                {group.entries.map((entry) => (
                  <ResultLink key={`${entry.kind}-${entry.title}`} entry={entry} />
                ))}
              </ul>
            </section>
          ))}
        </div>
      ) : (
        <div className="finder__empty">
          <h2>Nothing matches “{trimmed}”</h2>
          <p className="section__body">
            The index covers the {BARANGAYS.length} barangays, the elected municipal
            officials, the published hotlines and every page on the site. Transparency
            records are not in it yet, because they are not published yet.
          </p>
          <ul className="plain-list" aria-label="Recovery links">
            {RECOVERY_LINKS.filter((link) => link.to !== "/search").map((link) => (
              <li key={link.to}>
                <Link to={link.to}>{link.label}</Link>
                <span className="plain-list__meta">{link.to}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
