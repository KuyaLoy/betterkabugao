import { Link } from "react-router-dom";
import { PageHeader } from "../components/PageHeader";
import {
  EXECUTIVE,
  OFFICIALS_RETRIEVED,
  OFFICIALS_SOURCE_URL,
  OFFICIALS_TERM,
  SANGGUNIAN,
} from "../data/officials";
import { metaFor } from "../lib/seo";

export function OfficialsPage() {
  const meta = metaFor("/government/officials");

  return (
    <>
      <PageHeader
        variant="hero"
        eyebrow={`Government · ${OFFICIALS_TERM} term`}
        title="Elected municipal officials"
        description={`Kabugao is governed by an elected mayor and vice mayor, with a Sangguniang Bayan of eight elected members, serving the ${OFFICIALS_TERM} term. This list comes from the municipality's own government platform.`}
        breadcrumbs={meta.breadcrumbs}
        badges={<em className="pill">Source: Municipality of Kabugao eLGU</em>}
      />

      <section className="section" aria-labelledby="exec-title">
        <div className="shell">
          <h2 id="exec-title">Executive</h2>
          <div className="official-grid official-grid--exec">
            {EXECUTIVE.map((o) => (
              <article className="official official--lead" key={o.name}>
                <p className="official__post">{o.position}</p>
                <h3>{o.name}</h3>
              </article>
            ))}
          </div>

          <h2 className="stack-top" id="sb-title">
            Sangguniang Bayan
          </h2>
          <p className="section__body">
            Eight elected members. The ex-officio members — the Liga ng mga Barangay president and the
            Sangguniang Kabataan federation president — are not published on the municipality's platform,
            so they are not listed here.
          </p>
          <div className="official-grid official-grid--sb">
            {SANGGUNIAN.map((o) => (
              <article className="official" key={o.name}>
                <h3>{o.name}</h3>
                <p className="official__post">Sangguniang Bayan Member</p>
              </article>
            ))}
          </div>

          <p className="section__note">
            Source:{" "}
            <a href={OFFICIALS_SOURCE_URL} target="_blank" rel="noreferrer">
              Municipality of Kabugao eLGU
            </a>{" "}
            (Department of Information and Communications Technology), retrieved {OFFICIALS_RETRIEVED}.
            Cross-checked against reported COMELEC results for the May 2025 elections.
          </p>

          <aside className="notice">
            <h3>Barangay officials are a separate matter</h3>
            <p>
              No government source publishes the punong barangay or kagawad of Kabugao's barangays. We
              explain what we checked, and why we are not repeating an unverified list, on the{" "}
              <Link to="/government/barangays">barangays page</Link>.
            </p>
          </aside>
        </div>
      </section>
    </>
  );
}
