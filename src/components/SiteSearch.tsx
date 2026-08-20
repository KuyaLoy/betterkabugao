import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { type SearchEntry, searchSite } from "../lib/search";

type SiteSearchProps = {
  placeholder?: string;
};

/**
 * Zero-dependency site search over a build-time index.
 *
 * The network's search implementations all pull in Fuse.js or Orama for a
 * corpus of a few dozen entries. At this size a scored substring match is
 * faster, ships no extra bytes, and is easier to reason about — and unlike
 * Meilisearch (which every peer portal tried and abandoned) it needs no
 * server, no key and no index host.
 *
 * This is the compact dropdown. The /search page renders `SearchPanel`, which
 * groups its results and owns a shareable URL; both score through `searchSite`,
 * so there is one search implementation behind the two.
 */
export function SiteSearch({ placeholder = "Search barangays, officials, pages…" }: SiteSearchProps) {
  const [query, setQuery] = useState("");

  const results = useMemo<SearchEntry[]>(() => searchSite(query, 8), [query]);
  const showResults = query.trim().length >= 2;

  return (
    <div className="search">
      <div className="search__field">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
          <path d="M10 2a8 8 0 1 1-4.9 14.3l-3.4 3.4-1.4-1.4 3.4-3.4A8 8 0 0 1 10 2Zm0 2a6 6 0 1 0 0 12 6 6 0 0 0 0-12Z" />
        </svg>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={placeholder}
          aria-label="Search BetterKabugao"
        />
      </div>

      {showResults ? (
        results.length > 0 ? (
          <ul className="search__results" aria-label="Search results">
            {results.map((entry) => (
              <li key={`${entry.kind}-${entry.title}`}>
                <Link to={entry.path} onClick={() => setQuery("")}>
                  <span className="search__kind">{entry.kind}</span>
                  <span className="search__title">{entry.title}</span>
                  <span className="search__desc">{entry.summary}</span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="search__empty">No matches for “{query.trim()}”.</p>
        )
      ) : null}
    </div>
  );
}
