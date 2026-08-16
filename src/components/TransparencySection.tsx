import { siteContent } from "../app/site-content";

/**
 * The project-record schema preview: the fields the tracker will carry,
 * shown empty and labelled. It communicates the ambition without publishing
 * a single unverified figure.
 */
export function TransparencySection() {
  const { transparency } = siteContent;

  return (
    <section id="transparency" className="section section--tint" aria-labelledby="transparency-title">
      <div className="shell split">
        <div>
          <p className="kicker">
            <span className="kicker__num">{transparency.number}</span>
            {transparency.kicker}
          </p>
          <h2 id="transparency-title">{transparency.title}</h2>
          <p className="section__body">{transparency.body}</p>

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
            <h3>{transparency.schemaTitle}</h3>
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
  );
}
