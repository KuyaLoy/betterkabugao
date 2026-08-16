import { siteContent } from "../app/site-content";

export function MissionSection() {
  const { mission, costs } = siteContent;

  return (
    <section id="about" className="mission" aria-labelledby="mission-title">
      <div className="shell mission__inner">
        <div>
          <p className="kicker">{mission.kicker}</p>
          <h2 id="mission-title">{mission.title}</h2>
          <p className="mission__body">{mission.body}</p>
          <p className="mission__note">{mission.networkNote}</p>
          <div className="mission__actions">
            <a className="btn btn--primary" href={siteContent.links.repository} target="_blank" rel="noreferrer">
              Contribute on GitHub
            </a>
            <a className="btn btn--ghost" href={siteContent.links.directory} target="_blank" rel="noreferrer">
              BetterLGU Directory
            </a>
          </div>
        </div>

        <div className="cost-panel">
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
  );
}
