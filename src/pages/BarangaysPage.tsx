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

const OSM_COPYRIGHT = "https://www.openstreetmap.org/copyright";

/** Whether a barangay matches the directory filter needle (already lowercased). */
function matchesFilter(b: (typeof BARANGAYS)[number], needle: string): boolean {
  if (!needle) return true;
  return (
    b.name.toLowerCase().includes(needle) ||
    (b.oldName ? b.oldName.toLowerCase().includes(needle) : false) ||
    b.psgc.includes(needle)
  );
}

/**
 * Barangays directory — "Kabugao in View".
 *
 * A large live OpenStreetMap map is the working surface, paired with a filtered
 * directory. Each directory row is a **real, crawlable link** to the barangay's
 * own page — normal navigation, Ctrl/Cmd-click and open-in-new-tab all work, and
 * the list is fully usable with no JavaScript. A **separate** "show on map"
 * button previews the barangay: it highlights the pin, centres the map, and
 * opens a detail sheet (a bottom sheet on phones, a card in the panel on
 * desktop) without navigating. A linked OpenStreetMap attribution stays visible
 * whether or not the sheet is open.
 */
export function BarangaysPage() {
  const meta = metaFor("/government/barangays");
  const [filter, setFilter] = useState("");
  const [selected, setSelected] = useState<string | null>(null);

  const filterRef = useRef<HTMLInputElement | null>(null);
  const mapRegionRef = useRef<HTMLDivElement | null>(null);
  const sheetCloseRef = useRef<HTMLButtonElement | null>(null);
  // The control that opened the sheet, so Escape/Close return focus to it
  // exactly — never to <body>.
  const invokerRef = useRef<HTMLElement | null>(null);

  const shown = useMemo(() => {
    const needle = filter.trim().toLowerCase();
    return needle ? BARANGAYS.filter((b) => matchesFilter(b, needle)) : BARANGAYS;
  }, [filter]);

  // Filtering the selected barangay out of view closes the sheet and moves
  // focus to the filter — handled here in the change event, not in an effect
  // (react-hooks/set-state-in-effect), so focus never lands on <body>.
  function onFilterChange(value: string) {
    setFilter(value);
    if (!selected) return;
    const current = findBarangay(selected);
    if (current && !matchesFilter(current, value.trim().toLowerCase())) {
      setSelected(null);
      filterRef.current?.focus();
    }
  }

  const selectedBarangay = selected ? findBarangay(selected) : undefined;

  /** Preview from the list: the invoker is that row's button. */
  function selectFromRow(slug: string, invoker: HTMLElement) {
    invokerRef.current = invoker;
    setSelected(slug);
  }

  /** Preview from a map pin: return focus to the map region on close. */
  function selectFromMap(slug: string) {
    invokerRef.current = mapRegionRef.current;
    setSelected(slug);
  }

  function closeSheet() {
    const invoker = invokerRef.current ?? filterRef.current;
    setSelected(null);
    invoker?.focus();
  }

  // When the sheet opens, move focus into it (its close button).
  useEffect(() => {
    if (selected) sheetCloseRef.current?.focus();
  }, [selected]);

  // Escape closes the sheet and returns focus to the invoker (never <body>).
  useEffect(() => {
    if (!selected) return;
    function onKey(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      event.preventDefault();
      const invoker = invokerRef.current ?? filterRef.current;
      setSelected(null);
      invoker?.focus();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [selected]);

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
                ref={filterRef}
                type="search"
                value={filter}
                onChange={(event) => onFilterChange(event.target.value)}
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
            <div className="kv-atlas__map" ref={mapRegionRef} tabIndex={-1}>
              <MapView
                slugs={BARANGAYS.map((b) => b.slug)}
                height="tall"
                label="Map of the 21 barangays of Kabugao"
                selectedSlug={selected}
                onSelectSlug={selectFromMap}
              />
              <p className="kv-atlas__legend">
                Pins show the 21 published barangay locations. A municipal boundary is not shown in this
                version. Map data &copy;{" "}
                <a href={OSM_COPYRIGHT} target="_blank" rel="noreferrer">
                  OpenStreetMap
                </a>{" "}
                contributors (ODbL).
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
                    <button
                      ref={sheetCloseRef}
                      type="button"
                      className="kv-sheet__close"
                      onClick={closeSheet}
                      aria-label="Close details"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true" focusable="false">
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
                    Population: {BARANGAY_CENSUS} (PSA). Location &copy;{" "}
                    <a href={OSM_COPYRIGHT} target="_blank" rel="noreferrer">
                      OpenStreetMap
                    </a>{" "}
                    contributors (ODbL).
                  </p>
                </div>
              ) : null}
              <p className="list-count" aria-live="polite">
                {shown.length === BARANGAYS.length
                  ? `Showing all ${BARANGAYS.length} barangays`
                  : `${shown.length} of ${BARANGAYS.length} barangays match “${filter.trim()}”`}
              </p>

              {shown.length > 0 ? (
                <ul className="kv-dir" aria-label="Barangays of Kabugao">
                  <li className="kv-dir__head" aria-hidden="true">
                    <span>Barangay</span>
                    <span>Population</span>
                  </li>
                  {shown.map((b) => (
                    <li className={selected === b.slug ? "kv-dir__row is-selected" : "kv-dir__row"} key={b.psgc}>
                      <Link className="kv-dir__link" to={`/government/barangays/${b.slug}`}>
                        <span className="kv-dir__name">
                          {b.slug === "poblacion" ? <span className="kv-dir__cap" aria-hidden="true" /> : null}
                          {b.name}
                          {b.oldName ? <em>formerly {b.oldName}</em> : null}
                        </span>
                        <span className="kv-dir__pop" data-label="Population">
                          {b.population.toLocaleString("en-PH")}
                        </span>
                      </Link>
                      <button
                        type="button"
                        className="kv-dir__preview"
                        aria-pressed={selected === b.slug}
                        aria-label={`Show ${b.name} on the map`}
                        onClick={(event) => selectFromRow(b.slug, event.currentTarget)}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" focusable="false">
                          <path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11Z" />
                          <circle cx="12" cy="10" r="2.5" />
                        </svg>
                      </button>
                    </li>
                  ))}
                </ul>
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
