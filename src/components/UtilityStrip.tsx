import { useKabugaoNow, useKabugaoWeather } from "../lib/useKabugaoNow";

/**
 * Live utility strip — the band the BetterLGU network puts above the header.
 * Everything shown is real: weather is fetched for Kabugao's coordinates and
 * the clock runs in Philippine Standard Time. Nothing is faked; if the
 * weather request fails the reading is simply omitted.
 */
export function UtilityStrip() {
  const now = useKabugaoNow();
  const weather = useKabugaoWeather();

  return (
    <div className="utility">
      <div className="shell utility__inner">
        {weather.status === "ready" ? (
          <span className="utility__item">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
              <path d="M6.5 19a4.5 4.5 0 0 1-.7-8.9 6 6 0 0 1 11.6-1.6A4 4 0 0 1 18 19H6.5Z" />
            </svg>
            <span>
              Kabugao <span className="utility__value">{weather.temperature}</span>
              {weather.description ? ` · ${weather.description}` : null}
            </span>
          </span>
        ) : null}
        <span className="utility__item">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
            <path d="M7 2v2h10V2h2v2h1a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1V2h2Zm13 8H4v10h16V10Z" />
          </svg>
          <span>
            <span className="utility__value">{now.day}</span>, {now.date}
          </span>
        </span>
        <span className="utility__item">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
            <path d="M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20Zm1 5h-2v6l5 3 1-1.7-4-2.3V7Z" />
          </svg>
          <span>
            <span className="utility__value">{now.time}</span> PHT
          </span>
        </span>
      </div>
    </div>
  );
}
