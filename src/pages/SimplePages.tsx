import { Link } from "react-router-dom";
import { PageHeader } from "../components/PageHeader";
import { SiteSearch } from "../components/SiteSearch";
import { siteContent } from "../app/site-content";
import { BARANGAYS } from "../data/barangays";
import { EXECUTIVE, OFFICIALS_TERM } from "../data/officials";
import { metaFor } from "../lib/seo";

/** /government — hub page with real content, never a redirect. */
export function GovernmentPage() {
  const meta = metaFor("/government");
  return (
    <>
      <PageHeader
        variant="hero"
        eyebrow="Kabugao, Apayao"
        title="Government of Kabugao"
        description="Who governs Kabugao, and the 21 barangays that make it up."
        breadcrumbs={meta.breadcrumbs}
      />
      <section className="section">
        <div className="shell">
          <div className="card-grid">
            <Link className="nav-card" to="/government/officials">
              <span className="nav-card__kicker">Available now</span>
              <h3>Elected officials</h3>
              <p>
                Mayor {EXECUTIVE[0].name.split(" ").slice(-1)}, the vice mayor and the eight elected
                Sangguniang Bayan members for {OFFICIALS_TERM}.
              </p>
              <span className="nav-card__go" aria-hidden="true">→</span>
            </Link>
            <Link className="nav-card" to="/government/barangays">
              <span className="nav-card__kicker">Available now</span>
              <h3>All {BARANGAYS.length} barangays</h3>
              <p>Population, PSGC code, coordinates, schools and directions — each with its own page.</p>
              <span className="nav-card__go" aria-hidden="true">→</span>
            </Link>
            <Link className="nav-card" to="/transparency">
              <span className="nav-card__kicker">In progress</span>
              <h3>Transparency</h3>
              <p>Budgets, procurement and public projects, with every figure traced to its source.</p>
              <span className="nav-card__go" aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

/** /transparency — states the plan honestly, publishes no unverified figure. */
export function TransparencyPage() {
  const meta = metaFor("/transparency");
  const { transparency } = siteContent;

  return (
    <>
      <PageHeader
        variant="hero"
        eyebrow={transparency.kicker}
        title={transparency.title}
        description={transparency.body}
        breadcrumbs={meta.breadcrumbs}
        badges={<em className="pill">In preparation</em>}
      />
      <section className="section">
        <div className="shell split">
          <div>
            <h2>{transparency.schemaTitle}</h2>
            <p className="section__body">
              These are the fields every project record will carry. They are shown empty on purpose: no
              budget, contractor or project name is published here until it is verified against an official
              source.
            </p>
            <div className="sources">
              <h3>{transparency.sourcesTitle}</h3>
              <ul>
                {transparency.sources.map((source) => (
                  <li key={source.label}>
                    <a href={source.href} target="_blank" rel="noreferrer">
                      {source.label}
                      <span aria-hidden="true">↗</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="schema">
            <div className="schema__head">
              <h3>Project record</h3>
              <span className="schema__badge">Preview</span>
            </div>
            <dl className="schema__grid">
              {transparency.schema.map((field) => (
                <div className="schema__field" key={field}>
                  <dt>{field}</dt>
                  <dd>Awaiting verified data</dd>
                </div>
              ))}
            </dl>
            <p className="schema__foot">{transparency.schemaNote}</p>
          </div>
        </div>
      </section>
    </>
  );
}

/** /explore */
export function ExplorePage() {
  const meta = metaFor("/explore");
  const { explore } = siteContent;

  return (
    <>
      <PageHeader
        variant="hero"
        eyebrow={explore.kicker}
        title={explore.title}
        description={explore.body}
        breadcrumbs={meta.breadcrumbs}
        badges={<em className="pill">Planned</em>}
      />
      <section className="section">
        <div className="shell split">
          <div>
            <h2>What this section will cover</h2>
            <ul className="topics">
              {explore.topics.map((topic) => (
                <li key={topic}>{topic}</li>
              ))}
            </ul>
            <p className="section__note">
              Local history and culture will be documented with the community, not about it.
            </p>
          </div>
          <div className="geo">
            {explore.geo.map((row) => (
              <div className="geo__row" key={row.label}>
                <span className="geo__label">{row.label}</span>
                <span className="geo__value">{row.value}</span>
              </div>
            ))}
            <p className="geo__caption">
              Kabugao sits in the Cordillera highlands of northern Luzon, along the Apayao river system.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

/** /services */
export function ServicesPage() {
  const meta = metaFor("/services");
  const { services } = siteContent;

  return (
    <>
      <PageHeader
        variant="hero"
        eyebrow={services.kicker}
        title={services.title}
        description={services.body}
        breadcrumbs={meta.breadcrumbs}
        badges={<em className="pill">Planned</em>}
      />
      <section className="section">
        <div className="shell">
          <div className="service-groups">
            {services.groups.map((group) => (
              <div className="service-group" key={group.title}>
                <h3>{group.title}</h3>
                <ul>
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="section__note">{services.note}</p>
        </div>
      </section>
    </>
  );
}

/** /about */
export function AboutPage() {
  const meta = metaFor("/about");
  const { mission, costs, developer } = siteContent;

  return (
    <>
      <PageHeader
        variant="hero"
        eyebrow={mission.kicker}
        title={mission.title}
        description={mission.body}
        breadcrumbs={meta.breadcrumbs}
      />
      <section className="section">
        <div className="shell split">
          <div>
            <h2>How this is funded</h2>
            <p className="section__body">
              No public money is involved. The domain was paid for personally by the developer; hosting runs
              on a free tier. {mission.networkNote}
            </p>
            <h3 className="sub-head">Who builds it</h3>
            <p className="section__body">
              {developer.name} — {developer.role.toLowerCase()}. Contributions are welcome through the{" "}
              <a href={siteContent.links.repository} target="_blank" rel="noreferrer">
                open-source repository
              </a>
              .
            </p>
            <h3 className="sub-head">Corrections</h3>
            <p className="section__body">
              If a figure here is wrong, we want to fix it. Open an issue on GitHub with the correct value
              and its source, and it will be corrected with attribution.
            </p>
          </div>
          <div className="cost-panel cost-panel--light">
            <div className="cost-row cost-row--zero">
              <span className="cost-row__label">{costs.toPeople.label}</span>
              <span className="cost-row__value">{costs.toPeople.value}</span>
            </div>
            <div className="cost-row cost-row--build">
              <span className="cost-row__label">{costs.toBuild.label}</span>
              <span className="cost-row__value">{costs.toBuild.value}</span>
            </div>
            <p className="cost-panel__note">{costs.toBuild.note}</p>
          </div>
        </div>
      </section>
    </>
  );
}

/** /search */
export function SearchPage() {
  const meta = metaFor("/search");
  return (
    <>
      <PageHeader
        variant="hero"
        title="Search"
        description="Everything published on BetterKabugao — barangays, officials and pages."
        breadcrumbs={meta.breadcrumbs}
      />
      <section className="section">
        <div className="shell narrow">
          <SiteSearch inline limit={20} />
        </div>
      </section>
    </>
  );
}

/** 404 */
export function NotFoundPage() {
  return (
    <>
      <PageHeader
        title="Page not found"
        description="That page does not exist on BetterKabugao."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Not found" }]}
      />
      <section className="section">
        <div className="shell narrow">
          <p className="section__body">Try one of these instead:</p>
          <ul className="plain-list">
            <li><Link to="/government/barangays">All {BARANGAYS.length} barangays</Link></li>
            <li><Link to="/government/officials">Elected officials</Link></li>
            <li><Link to="/search">Search the site</Link></li>
          </ul>
        </div>
      </section>
    </>
  );
}
