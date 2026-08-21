import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { PageHeader } from "../components/PageHeader";
import { MapView } from "../components/MapView";
import {
  BARANGAYS,
  BARANGAY_CENSUS,
  BARANGAY_POPULATION_TOTAL,
  findBarangay,
  formatCoordinates,
  populationRank,
  populationShare,
} from "../data/barangays";
import { BARANGAY_OFFICIALS_NOTE } from "../data/officials";
import { metaFor } from "../lib/seo";

const PLACE_LABEL: Record<string, string> = {
  quarter: "Town centre",
  village: "Village",
  hamlet: "Hamlet",
};

/**
 * Barangays directory — "Kabugao in View".
 *
 * A large live OpenStreetMap map is the working surface, paired with a filtered
 * directory. The two communicate: selecting a barangay (a row or its pin)
 * highlights the pin, centres the map, and opens a detail sheet — a bottom
 * sheet on phones, a card in the panel on desktop. Every row is a real link to
 * the barangay's own page, so the list works with no JavaScript at all, and the
 * OpenStreetMap attribution stays visible whether or not the sheet is open.
 */
export function BarangaysPage() {
  const meta = metaFor("/government/barangays");
  const [filter, setFilter] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const rowRefs = useRef<Map<string, HTMLAnchorElement | null>>(new Map());

  const shown = useMemo(() => {
    const needle = filter.trim().toLowerCase();
    if (!needle) return BARANGAYS;
    return BARANGAYS.filter(
      (b) =>
        b.name.toLowerCase().includes(needle) ||
        b.oldName?.toLowerCase().includes(needle) ||
        b.psgc.includes(needle),
    );
  }, [filter]);

  const selectedBarangay = selected ? findBarangay(selected) : undefined;

  // Escape closes the sheet and returns focus to the row it came from.
  useEffect(() => {
    if (!selected) return;
    function onKey(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      const slug = selected;
      setSelected(null);
      if (slug) rowRefs.current.get(slug)?.focus();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [selected]);

  function closeSheet() {
    const slug = selected;
    setSelected(null);
    if (slug) rowRefs.current.get(slug)?.focus();
  }

  return (
    <>
      <PageHeader
        variant="compact"
        eyebrow="Government"
        title="The 21 barangays of Kabugao"
        description={`Every barangay in Kabugao with population from the ${BARANGAY_CENSUS}, its PSGC code, location and directions — ${BARANGAY_POPULATION_TOTAL.toLocaleString("en-PH")} people across ${BARANGAYS.length} barangays.`}
        breadcrumbs={meta.breadcrumbs}
        actions={
          <div className="search">
            <div className="search__field">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
                <path d="M10 2a8 8 0 1 1-4.9 14.3l-3.4 3.4-1.4-1.4 3.4-3.4A8 8 0 0 1 10 2Zm0 2a6 6 0 1 0 0 12 6 6 0 0 0 0-12Z" />
              </svg>
              <input
                type="search"
                value={filter}
                onChange={(event) => setFilter(event.target.value)}
                placeholder="Find a barangay or PSGC…"
                aria-label="Filter barangays by name or PSGC code"
              />
            </div>
          </div>
        }
      />

      <section className="section section--slim" aria-labelledby="bgy-atlas-title">
        <div className="shell">
          <h2 id="bgy-atlas-title" className="sr-only">
            Map and directory of the barangays
          </h2>

          <div className="kv-atlas">
            <div className="kv-atlas__map">
              <MapView
                slugs={BARANGAYS.map((b) => b.slug)}
                height="tall"
                label="Map of the 21 barangays of Kabugao"
                selectedSlug={selected}
                onSelectSlug={setSelected}
              />
              <p className="kv-atlas__legend">
                Pins show the 21 published barangay locations. A municipal boundary is not shown in this
                version. Map &copy; OpenStreetMap contributors (ODbL).
              </p>
            </div>

            <div className="kv-atlas__panel">
              {selectedBarangay ? (
                <div className="kv-sheet" role="region" aria-label={`Barangay ${selectedBarangay.name} summary`}>
                  <div className="kv-sheet__grip" aria-hidden="true" />
                  <div className="kv-sheet__head">
                    <div>
                      <p className="kv-sheet__eyebrow">Barangay</p>
                      <h2 className="kv-sheet__name">{selectedBarangay.name}</h2>
                      <p className="kv-sheet__type">{PLACE_LABEL[selectedBarangay.place]}</p>
                    </div>
                    <button type="button" className="kv-sheet__close" onClick={closeSheet} aria-label="Close details">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
                        <path d="M6 6l12 12M18 6 6 18" />
                      </svg>
                    </button>
                  </div>
                  <dl className="kv-sheet__facts">
                    <div>
                      <dt>Population</dt>
                      <dd>
                        {selectedBarangay.population.toLocaleString("en-PH")} · {populationShare(selectedBarangay)}
                      </dd>
                    </div>
                    <div>
                      <dt>Rank</dt>
                      <dd>
                        {populationRank(selectedBarangay)} of {BARANGAYS.length}
                      </dd>
                    </div>
                    <div>
                      <dt>PSGC</dt>
                      <dd className="mono">{selectedBarangay.psgc}</dd>
                    </div>
                    <div>
                      <dt>Coordinates</dt>
                      <dd className="mono">{formatCoordinates(selectedBarangay)}</dd>
                    </div>
                  </dl>
                  <Link className="btn btn--solid kv-sheet__more" to={`/government/barangays/${selectedBarangay.slug}`}>
                    View full barangay page →
                  </Link>
                  <p className="kv-sheet__attr">
                    Population: {BARANGAY_CENSUS} (PSA). Location: &copy; OpenStreetMap contributors (ODbL).
                  </p>
                </div>
              ) : null}
              <p className="list-count" aria-live="polite">
                {shown.length === BARANGAYS.length
                  ? `Showing all ${BARANGAYS.length} barangays`
                  : `${shown.length} of ${BARANGAYS.length} barangays match “${filter.trim()}”`}
              </p>

              {shown.length > 0 ? (
                <div className="kv-dir" role="table" aria-label="Barangays of Kabugao">
                  <div className="kv-dir__head" role="row">
                    <span role="columnheader">Barangay</span>
                    <span role="columnheader">Population</span>
                    <span role="columnheader" className="sr-only">
                      Select
                    </span>
                  </div>
                  {shown.map((b) => (
                    <Link
                      className={selected === b.slug ? "kv-dir__row is-selected" : "kv-dir__row"}
                      role="row"
                      to={`/government/barangays/${b.slug}`}
                      key={b.psgc}
                      ref={(el) => {
                        rowRefs.current.set(b.slug, el);
                      }}
                      aria-current={selected === b.slug ? "true" : undefined}
                      onClick={(event) => {
                        event.preventDefault();
                        setSelected(b.slug);
                      }}
                    >
                      <span role="cell" className="kv-dir__name">
                        {b.slug === "poblacion" ? <span className="kv-dir__cap" aria-hidden="true" /> : null}
                        {b.name}
                        {b.oldName ? <em>formerly {b.oldName}</em> : null}
                      </span>
                      <span role="cell" className="kv-dir__pop" data-label="Population">
                        {b.population.toLocaleString("en-PH")}
                      </span>
                      <span role="cell" className="kv-dir__go" aria-hidden="true">
                        →
                      </span>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="search__empty">No barangay matches “{filter.trim()}”.</p>
              )}
            </div>
          </div>

          <p className="section__note">
            Population: {BARANGAY_CENSUS} (Philippine Statistics Authority) — the {BARANGAYS.length} figures
            sum to the municipal total. PSGC codes verified against PSA records; note that code 1408104003
            is not in use. Coordinates and schools from OpenStreetMap contributors (ODbL).
          </p>

          <aside className="notice">
            <h3>{BARANGAY_OFFICIALS_NOTE.heading}</h3>
            <p>{BARANGAY_OFFICIALS_NOTE.body}</p>
            <p className="notice__sub">{BARANGAY_OFFICIALS_NOTE.election}</p>
          </aside>

          <p className="section__note">
            Looking for something else? <Link to="/search">Search the whole site</Link>.
          </p>
        </div>
      </section>

    </>
  );
}
