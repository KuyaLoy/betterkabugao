import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { PageHeader } from "../components/PageHeader";
import {
  BARANGAYS,
  BARANGAY_CENSUS,
  BARANGAY_POPULATION_TOTAL,
  populationShare,
} from "../data/barangays";
import { BARANGAY_OFFICIALS_NOTE } from "../data/officials";
import { metaFor } from "../lib/seo";

const PLACE_LABEL: Record<string, string> = {
  quarter: "Town centre",
  village: "Village",
  hamlet: "Hamlet",
};

export function BarangaysPage() {
  const meta = metaFor("/government/barangays");
  const [filter, setFilter] = useState("");

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

  return (
    <>
      <PageHeader
        variant="hero"
        eyebrow="Government"
        title="The 21 barangays of Kabugao"
        description={`Every barangay in Kabugao, with population from the ${BARANGAY_CENSUS}, its PSGC code, location and directions. Together they hold ${BARANGAY_POPULATION_TOTAL.toLocaleString("en-PH")} people across 935.12 km².`}
        breadcrumbs={meta.breadcrumbs}
        actions={
          <div className="search search--inline">
            <div className="search__field">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
                <path d="M10 2a8 8 0 1 1-4.9 14.3l-3.4 3.4-1.4-1.4 3.4-3.4A8 8 0 0 1 10 2Zm0 2a6 6 0 1 0 0 12 6 6 0 0 0 0-12Z" />
              </svg>
              <input
                type="search"
                value={filter}
                onChange={(event) => setFilter(event.target.value)}
                placeholder="Find a barangay…"
                aria-label="Filter barangays by name or PSGC code"
              />
            </div>
          </div>
        }
      />

      <section className="section" aria-labelledby="bgy-list-title">
        <div className="shell">
          <h2 id="bgy-list-title" className="sr-only">
            Barangay list
          </h2>

          <p className="list-count">
            {shown.length === BARANGAYS.length
              ? `Showing all ${BARANGAYS.length} barangays`
              : `${shown.length} of ${BARANGAYS.length} barangays match “${filter.trim()}”`}
          </p>

          {shown.length > 0 ? (
            <div className="bgy-table" role="table" aria-label="Barangays of Kabugao">
              <div className="bgy-table__head" role="row">
                <span role="columnheader">Barangay</span>
                <span role="columnheader">Population</span>
                <span role="columnheader">Share</span>
                <span role="columnheader">PSGC</span>
                <span role="columnheader">Type</span>
                <span role="columnheader" className="sr-only">
                  Link
                </span>
              </div>
              {shown.map((b) => (
                <Link
                  className="bgy-table__row"
                  role="row"
                  to={`/government/barangays/${b.slug}`}
                  key={b.psgc}
                >
                  <span role="cell" className="bgy-table__name">
                    {b.name}
                    {b.oldName ? <em>formerly {b.oldName}</em> : null}
                  </span>
                  {/* data-label surfaces the column name on narrow screens,
                      where the header row is hidden and bare numbers would be
                      ambiguous. */}
                  <span role="cell" className="bgy-table__num" data-label="Population">
                    {b.population.toLocaleString("en-PH")}
                  </span>
                  <span role="cell" className="bgy-table__num" data-label="Share of Kabugao">
                    {populationShare(b)}
                  </span>
                  <span role="cell" className="bgy-table__mono" data-label="PSGC">
                    {b.psgc}
                  </span>
                  <span role="cell">
                    <em className="pill">{PLACE_LABEL[b.place]}</em>
                  </span>
                  <span role="cell" className="bgy-table__go" aria-hidden="true">
                    →
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="search__empty">No barangay matches “{filter.trim()}”.</p>
          )}

          <p className="section__note">
            Population: {BARANGAY_CENSUS} (Philippine Statistics Authority) — the 21 figures sum to the
            municipal total. PSGC codes verified against PSA records; note that code 1408104003 is not in
            use. Coordinates and schools from OpenStreetMap contributors (ODbL).
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
