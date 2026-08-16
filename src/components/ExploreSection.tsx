import { siteContent } from "../app/site-content";

export function ExploreSection() {
  const { explore } = siteContent;

  return (
    <section id="explore" className="section" aria-labelledby="explore-title">
      <div className="shell split">
        <div>
          <p className="kicker">
            <span className="kicker__num">{explore.number}</span>
            {explore.kicker}
          </p>
          <h2 id="explore-title">{explore.title}</h2>
          <p className="section__body">{explore.body}</p>
          <ul className="topics">
            {explore.topics.map((topic) => (
              <li key={topic}>{topic}</li>
            ))}
          </ul>
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
  );
}
