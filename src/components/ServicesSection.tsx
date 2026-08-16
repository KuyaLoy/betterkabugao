import { siteContent } from "../app/site-content";

export function ServicesSection() {
  const { services } = siteContent;

  return (
    <section id="services" className="section section--tint" aria-labelledby="services-title">
      <div className="shell">
        <div className="section__head">
          <p className="kicker">
            <span className="kicker__num">{services.number}</span>
            {services.kicker}
          </p>
          <h2 id="services-title">{services.title}</h2>
          <p className="section__body">{services.body}</p>
        </div>
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
  );
}
