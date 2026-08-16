import { siteContent } from "../app/site-content";

export function IntroSection() {
  const { intro } = siteContent;

  return (
    <section className="section" aria-labelledby="intro-title">
      <div className="shell">
        <div className="section__head">
          <p className="kicker">{intro.kicker}</p>
          <h2 id="intro-title">{intro.title}</h2>
          <p className="section__body">{intro.body}</p>
        </div>
        <dl className="facts">
          {intro.facts.map((fact) => (
            <div className="facts__cell" key={fact.label}>
              <dd className="facts__value">{fact.value}</dd>
              <dt className="facts__label">{fact.label}</dt>
            </div>
          ))}
        </dl>
        <p className="section__note">{intro.factsSource}</p>
      </div>
    </section>
  );
}
