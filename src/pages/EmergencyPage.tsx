import { PageHeader } from "../components/PageHeader";
import {
  HOTLINES,
  HOTLINE_SOURCE,
  NATIONAL_EMERGENCY,
  formatInternational,
  telHref,
} from "../data/hotlines";
import { metaFor } from "../lib/seo";

/**
 * Every published Kabugao emergency number, in one tappable list.
 *
 * Both formats are shown on purpose. The local 0-prefix is how the numbers are
 * read out and remembered in Kabugao; the +63 form is what a relative overseas
 * needs. The link itself is always +63, which works for both.
 */
export function EmergencyPage() {
  const meta = metaFor("/emergency");

  return (
    <>
      <PageHeader
        variant="hero"
        eyebrow="Emergency"
        title="Emergency hotlines for Kabugao"
        description="The numbers the Municipality of Kabugao published for emergencies, written so they dial from anywhere — including from abroad, for a relative at home."
        breadcrumbs={meta.breadcrumbs}
        badges={<em className="pill">Source published {HOTLINE_SOURCE.published}</em>}
      />

      <section className="section" aria-labelledby="hotline-list">
        <div className="shell">
          <h2 id="hotline-list" className="sr-only">
            Hotline list
          </h2>

          <a className="hotline-card" href={`tel:${NATIONAL_EMERGENCY}`}>
            <span className="hotline-card__kicker">Anywhere in the Philippines</span>
            <span className="hotline-card__name">National emergency hotline</span>
            <span className="hotline-card__number">{NATIONAL_EMERGENCY}</span>
            <span className="hotline-card__note">
              Police, fire and medical, free from any phone. Use this if a number below does not
              connect.
            </span>
          </a>

          <h3 className="sub-head stack-top">Kabugao offices</h3>
          <ul className="hotline-list">
            {HOTLINES.map((hotline) => (
              <li key={hotline.id} className="hotline-row">
                <div className="hotline-row__who">
                  <span className="hotline-row__abbr">{hotline.abbreviation}</span>
                  <span className="hotline-row__name">{hotline.name}</span>
                  <span className="hotline-row__purpose">{hotline.purpose}</span>
                </div>
                <div className="hotline-row__numbers">
                  {hotline.numbers.map((number) => (
                    <a
                      key={number}
                      className="hotline-row__call"
                      href={telHref(number)}
                      aria-label={`Call ${hotline.name} on ${formatInternational(number)}`}
                    >
                      {formatInternational(number)}
                    </a>
                  ))}
                </div>
              </li>
            ))}
          </ul>

          <div className="notice stack-top">
            <h3>How to dial these</h3>
            <p>
              Every number above is written the way it dials from anywhere in the world. Inside the
              Philippines you can dial the same number starting <strong>0</strong> instead of{" "}
              <strong>+63</strong>. They are all mobile numbers, so a call from abroad is charged at
              your provider's international rate.
            </p>
            <p className="notice__sub">
              Mobile numbers can change. If one does not connect, call {NATIONAL_EMERGENCY}. If you
              find a number that is wrong, please tell us so we can correct it — this is a volunteer
              project, not the municipal government.
            </p>
          </div>

          <p className="section__note">
            Source:{" "}
            <a href={HOTLINE_SOURCE.url} target="_blank" rel="noreferrer">
              {HOTLINE_SOURCE.label}
            </a>
            , published {HOTLINE_SOURCE.published}. Retrieved and transcribed 18 August 2026.
          </p>
        </div>
      </section>
    </>
  );
}
