import { Link, useNavigate } from "react-router-dom";
import { PageHeader } from "../components/PageHeader";
import { SearchPanel } from "../components/SearchPanel";
import { siteContent } from "../app/site-content";
import { BARANGAYS } from "../data/barangays";
import { EXECUTIVE, OFFICIALS_TERM } from "../data/officials";
import { RECOVERY_LINKS, metaFor } from "../lib/seo";

/** /government — hub page: an editorial wayfinding list into the real
 *  government destinations, never a redirect and never a card wall. */
export function GovernmentPage() {
  const meta = metaFor("/government");
  return (
    <>
      <PageHeader
        variant="kv"
        eyebrow="Kabugao, Apayao"
        title="Government of Kabugao"
        description="Who governs Kabugao, and the 21 barangays that make it up."
        breadcrumbs={meta.breadcrumbs}
      />
      <section className="section">
        <div className="shell">
          <p className="kv-intro">
            Start with the people and the places that make up the municipal government. Each section
            opens its own page; records still being prepared are labelled so.
          </p>
          <ul className="kv-guide">
            <li className="kv-guide__item">
              <Link className="kv-guide__link" to="/government/officials">
                <span className="kv-guide__main">
                  <span className="kv-guide__title">Elected officials</span>
                  <span className="kv-guide__desc">
                    Mayor {EXECUTIVE[0].name.split(" ").slice(-1)}, the vice mayor and the eight elected
                    Sangguniang Bayan members for {OFFICIALS_TERM}.
                  </span>
                </span>
                <span className="kv-guide__meta">
                  <span className="kv-guide__status kv-guide__status--live">Available</span>
                  <span className="kv-guide__go" aria-hidden="true">→</span>
                </span>
              </Link>
            </li>
            <li className="kv-guide__item">
              <Link className="kv-guide__link" to="/government/barangays">
                <span className="kv-guide__main">
                  <span className="kv-guide__title">All {BARANGAYS.length} barangays</span>
                  <span className="kv-guide__desc">
                    Population, PSGC code, coordinates, schools and directions — each barangay with its
                    own page and map.
                  </span>
                </span>
                <span className="kv-guide__meta">
                  <span className="kv-guide__status kv-guide__status--live">Available</span>
                  <span className="kv-guide__go" aria-hidden="true">→</span>
                </span>
              </Link>
            </li>
            <li className="kv-guide__item">
              <Link className="kv-guide__link" to="/transparency">
                <span className="kv-guide__main">
                  <span className="kv-guide__title">Transparency</span>
                  <span className="kv-guide__desc">
                    Public records for Kabugao, in preparation — every figure traced to its official
                    source before it is published.
                  </span>
                </span>
                <span className="kv-guide__meta">
                  <span className="kv-guide__status kv-guide__status--soon">In preparation</span>
                  <span className="kv-guide__go" aria-hidden="true">→</span>
                </span>
              </Link>
            </li>
          </ul>
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
              These are the fields each record will use. They are shown empty on purpose: nothing is
              published here until it is verified against an official source.
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

/** /search — grouped results, and useful before anything is typed. */
export function SearchPage() {
  const meta = metaFor("/search");
  return (
    <>
      <PageHeader
        variant="hero"
        eyebrow="Search"
        title="Find anything published here"
        description={`The ${BARANGAYS.length} barangays, the elected municipal officials, the published emergency hotlines and every page. A query can be shared as a link: /search?q=poblacion`}
        breadcrumbs={meta.breadcrumbs}
      />
      <section className="section">
        <div className="shell">
          <SearchPanel />
        </div>
      </section>
    </>
  );
}

/**
 * 404 — a recovery screen, not a joke page.
 *
 * A visitor here has usually mistyped an address or followed a stale link from
 * Facebook. The search box and the six links are the whole point: the links are
 * ordinary anchors, so they work even when the box does not.
 */
export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <>
      <PageHeader
        variant="hero"
        eyebrow="404"
        title="That page does not exist"
        description="The address may be mistyped, or the page may never have existed. Search the site below, or go straight to one of these."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Not found" }]}
      />
      <section className="section">
        <div className="shell">
          <div className="recover">
            {/* A real GET form. The CSP now allows `form-action 'self'`, so a
                submission works even with scripting off; the handler still
                intercepts it to keep the navigation client-side when it can.
                Every link below is a plain anchor regardless: the box can fail
                and the page still works. */}
            <form
              className="recover__form"
              method="get"
              action="/search"
              onSubmit={(event) => {
                event.preventDefault();
                const q = new FormData(event.currentTarget).get("q");
                const query = typeof q === "string" ? q.trim() : "";
                navigate(query ? `/search?q=${encodeURIComponent(query)}` : "/search");
              }}
            >
              <label className="recover__label" htmlFor="notfound-q">
                Search BetterKabugao
              </label>
              <div className="recover__row">
                <input
                  id="notfound-q"
                  className="recover__input"
                  type="search"
                  name="q"
                  placeholder="A barangay, an official, a hotline…"
                  autoComplete="off"
                />
                <button className="btn btn--solid" type="submit">
                  Search
                </button>
              </div>
            </form>

            <nav className="recover__links" aria-labelledby="recover-title">
              <h2 id="recover-title">Or go straight to</h2>
              <ul className="plain-list">
                {RECOVERY_LINKS.filter((link) => link.to !== "/search").map((link) => (
                  <li key={link.to}>
                    <Link to={link.to}>{link.label}</Link>
                    <span className="plain-list__meta">{link.to}</span>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </section>
    </>
  );
}
