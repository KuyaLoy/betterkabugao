import { Link, useParams } from "react-router-dom";
import { MapView } from "../components/MapView";
import { PageHeader } from "../components/PageHeader";
import {
  BARANGAYS,
  BARANGAY_CENSUS,
  directionsLink,
  findBarangay,
  formatCoordinates,
  mapLink,
  nearest,
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

export function BarangayDetailPage() {
  const { slug } = useParams();
  const barangay = findBarangay(slug);

  if (!barangay) {
    return (
      <>
        <PageHeader
          title="Barangay not found"
          description="That barangay does not exist in Kabugao."
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Government", href: "/government" },
            { label: "Barangays", href: "/government/barangays" },
            { label: "Not found" },
          ]}
        />
        <section className="section">
          <div className="shell">
            <p className="section__body">
              Kabugao has {BARANGAYS.length} barangays.{" "}
              <Link to="/government/barangays">See the full list</Link>.
            </p>
          </div>
        </section>
      </>
    );
  }

  const meta = metaFor(`/government/barangays/${barangay.slug}`);
  const rank = populationRank(barangay);
  const neighbours = nearest(barangay);

  return (
    <>
      <PageHeader
        eyebrow={`Barangay · Kabugao, Apayao`}
        title={barangay.name}
        description={
          barangay.oldName
            ? `Also recorded under its former name, ${barangay.oldName}.`
            : `One of the ${BARANGAYS.length} barangays of Kabugao.`
        }
        breadcrumbs={meta.breadcrumbs}
        badges={
          <>
            <em className="pill">{PLACE_LABEL[barangay.place]}</em>
            <em className="pill">
              {rank === 1 ? "Largest by population" : `${rank}th largest of ${BARANGAYS.length}`}
            </em>
          </>
        }
        actions={
          <div className="detail-actions">
            <a className="btn btn--solid" href={mapLink(barangay)} target="_blank" rel="noreferrer">
              View on map
            </a>
            <a className="btn btn--outline" href={directionsLink(barangay)} target="_blank" rel="noreferrer">
              Directions
            </a>
          </div>
        }
      />

      <section className="section" aria-labelledby="bgy-facts">
        <div className="shell split">
          <div>
            <h2 id="bgy-facts">Barangay {barangay.name} at a glance</h2>
            <p className="section__body">
              Barangay {barangay.name} has{" "}
              <strong>{barangay.population.toLocaleString("en-PH")} residents</strong> as of the{" "}
              {BARANGAY_CENSUS}, which is {populationShare(barangay)} of Kabugao's population. It sits at{" "}
              {formatCoordinates(barangay)}.
            </p>

            {barangay.schools.length > 0 ? (
              <>
                <h3 className="sub-head">
                  {barangay.schools.length > 1 ? "Schools" : "School"} recorded here
                </h3>
                <ul className="plain-list">
                  {barangay.schools.map((school) => (
                    <li key={school}>{school}</li>
                  ))}
                </ul>
              </>
            ) : (
              <p className="section__note">
                No school is currently mapped in barangay {barangay.name}. That may mean none exists, or
                simply that it has not been recorded in OpenStreetMap yet.
              </p>
            )}

            <h3 className="sub-head">Nearest barangays</h3>
            <ul className="plain-list">
              {neighbours.map(({ barangay: other, km }) => (
                <li key={other.slug}>
                  <Link to={`/government/barangays/${other.slug}`}>{other.name}</Link>
                  <span className="plain-list__meta">{km.toFixed(1)} km away</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="fact-card">
              <div className="fact-card__row">
                <span>Population ({BARANGAY_CENSUS})</span>
                <b>{barangay.population.toLocaleString("en-PH")}</b>
              </div>
              <div className="fact-card__row">
                <span>Share of Kabugao</span>
                <b>{populationShare(barangay)}</b>
              </div>
              <div className="fact-card__row">
                <span>Rank by population</span>
                <b>
                  {rank} of {BARANGAYS.length}
                </b>
              </div>
              <div className="fact-card__row">
                <span>PSGC code</span>
                <b className="mono">{barangay.psgc}</b>
              </div>
              <div className="fact-card__row">
                <span>Coordinates</span>
                <b className="mono">{formatCoordinates(barangay)}</b>
              </div>
              <div className="fact-card__row">
                <span>Classification</span>
                <b>{PLACE_LABEL[barangay.place]}</b>
              </div>
              {barangay.oldName ? (
                <div className="fact-card__row">
                  <span>Former name</span>
                  <b>{barangay.oldName}</b>
                </div>
              ) : null}
              <p className="fact-card__note">
                Population from the Philippine Statistics Authority. PSGC verified against PSA records.
                Coordinates from OpenStreetMap contributors (ODbL).
              </p>
            </div>

            <MapView
              slugs={[barangay.slug, ...neighbours.map(({ barangay: other }) => other.slug)]}
              primarySlug={barangay.slug}
              maxZoom={13}
              height="short"
              label={`Map showing barangay ${barangay.name} and its nearest neighbours`}
            />
          </div>
        </div>
      </section>

      <section className="section section--slim section--tint">
        <div className="shell">
          <aside className="notice">
            <h3>Officials of this barangay are not published</h3>
            <p>{BARANGAY_OFFICIALS_NOTE.body}</p>
            <p className="notice__sub">{BARANGAY_OFFICIALS_NOTE.election}</p>
          </aside>
          <p className="section__note">
            <Link to="/government/barangays">← All {BARANGAYS.length} barangays</Link>
          </p>
        </div>
      </section>
    </>
  );
}
