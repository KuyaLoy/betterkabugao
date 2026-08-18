import { useState } from "react";
import { siteContent } from "../app/site-content";
import { BAR_HOTLINES, NATIONAL_EMERGENCY, formatInternational, telHref } from "../data/hotlines";
import { HotlineDialog } from "./HotlineDialog";

/**
 * The red strip at the top of every page: 911, then every municipal office
 * scrolling past, then a button that opens the full list as a popup.
 *
 * The scroll is CSS-only. The track is rendered twice and animated by exactly
 * half its width, so the loop is seamless with no JavaScript ticking a frame
 * counter. The second copy is `aria-hidden`, so a screen reader hears each
 * number once.
 *
 * It stops moving when any of these is true, because a number you cannot catch
 * is no use in an emergency:
 *   - the pointer is over it (`:hover`, only on devices that really hover)
 *   - something inside it has focus (keyboard users tabbing through)
 *   - a finger is on it (`:active`, which is what a touch gives us)
 *   - the reader pressed Pause — the visible control below, which is what
 *     WCAG 2.2 SC 2.2.2 actually asks for, since hover does not help a
 *     keyboard or switch user
 *   - the reader has `prefers-reduced-motion` set, in which case it never
 *     animates at all and the row becomes swipeable instead
 */
export function HotlineBar() {
  const { label } = siteContent.hotline;
  const [paused, setPaused] = useState(false);

  const numbers = BAR_HOTLINES.map((hotline) => (
    <li key={hotline.id}>
      <span className="hotline__who">{hotline.abbreviation}</span>
      <a
        href={telHref(hotline.numbers[0])}
        aria-label={`Call ${hotline.name} on ${formatInternational(hotline.numbers[0])}`}
      >
        {formatInternational(hotline.numbers[0])}
      </a>
    </li>
  ));

  return (
    <div className="hotline" role="region" aria-label="Emergency hotlines">
      <div className="shell hotline__inner">
        <span className="hotline__label">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
            <path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.2.4 2.4.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .8-.2 1l-2.3 2.2Z" />
          </svg>
          {label}
        </span>

        <a className="hotline__number" href={`tel:${NATIONAL_EMERGENCY}`}>
          {NATIONAL_EMERGENCY}
        </a>

        <span className="hotline__divider" aria-hidden="true" />

        <div className={`hotline__marquee${paused ? " is-paused" : ""}`}>
          <ul className="hotline__list">{numbers}</ul>
          {/* Second copy makes the loop seamless; hidden from assistive tech so
              the numbers are not announced twice. */}
          <ul className="hotline__list" aria-hidden="true">
            {numbers}
          </ul>
        </div>

        <button
          type="button"
          className="hotline__pause"
          onClick={() => setPaused((was) => !was)}
          aria-pressed={paused}
        >
          {paused ? "Play" : "Pause"}
          <span className="sr-only"> the scrolling hotline list</span>
        </button>

        <HotlineDialog className="hotline__all" label="All numbers" />
      </div>
    </div>
  );
}
