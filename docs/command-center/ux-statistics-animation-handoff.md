# UX handoff — Statistics line-graph animation

Status: implemented and locally verified on 13 September 2026. The production
change, focused tests and evidence ship together; resolve the release SHA from
Git history.

## Recommended motion

Enhance the existing population SVG with a one-time, CSS-driven line draw from
the earliest observation (1960) to the latest (2024). Reveal the nine data
points in the same chronological order as the line reaches them.

Use SVG `pathLength="1"` with `stroke-dasharray` and `stroke-dashoffset` for
the polyline. Add a single `is-visible` class when the chart enters the
viewport. Avoid per-frame React state, chart libraries, SVG morphing, and
scroll-linked animation.

## Timing and trigger

- Trigger once when approximately 20% of the chart is visible.
- Use `IntersectionObserver`; disconnect it after the first trigger.
- Line duration: 1,100ms.
- Easing: `cubic-bezier(0.22, 0.8, 0.28, 1)`.
- Point reveals: chronological order, 140ms each, staggered approximately
  105ms from left to right.
- The final point settles by approximately 1,100ms.
- No loop, replay control, hover animation, or continuous scroll animation.

The chart must render in its complete final state before JavaScript enhancement;
animation is additive only.

## Reduced motion

When `prefers-reduced-motion: reduce` is active, show the complete line and all
points immediately. Do not apply animation classes, or force all animation
durations and delays to `0ms`. Keep the existing caption, description, and table
unchanged.

## Accessibility and performance constraints

- Preserve the existing SVG `role="img"`, title, and description.
- Keep the full data table as the authoritative text alternative.
- Do not announce individual points through a live region.
- Do not make points interactive unless a separate keyboard-accessible data
  inspection design is approved.
- Animate only `stroke-dashoffset`, `opacity`, and a small point transform.
- Do not animate grid lines, axes, labels, or the table.
- Do not delay interaction or source access while the animation runs.
- Keep the responsive `viewBox` and avoid horizontal scrolling at narrow widths.
- JavaScript-disabled and print output must remain static and complete.
- Add no dependency and do not block rendering on the observer.

## Acceptance criteria

- The chart is complete and readable with JavaScript disabled.
- With motion allowed, the line visibly progresses from 1960 to 2024 once.
- Points appear in chronological order, with 2024 as the final reveal.
- The animation starts only after the chart enters the viewport.
- Scrolling away and back does not replay it.
- Reduced-motion mode has zero animation delay and an immediate static chart.
- No React state updates occur per animation frame.
- SVG labels, caption, table, and sources remain usable at 305px, 390px,
  768px, and desktop widths.
- Existing tests, prerendering, CSP, and accessibility contracts remain green.

## Implementation record

- `PopulationChart` adds one `IntersectionObserver` at a 0.2 threshold and
  disconnects after the first trigger; it uses no React animation state.
- CSS draws the normalized polyline for 1,100ms and reveals the nine points at
  105ms intervals. The final observation is 2024.
- Reduced-motion, print and JavaScript-off output remain complete and static.
- `npm run qa:statistics` is the focused browser gate and writes its report and
  390/1440/reduced-motion screenshots to `docs/qa/checkpoint-statistics/`.
