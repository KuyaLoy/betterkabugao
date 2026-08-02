import type { PointerEvent } from "react";
import { getParallaxOffset } from "../lib/parallax";

export function BrandArtwork() {
  const setOffset = (element: HTMLDivElement, x: number, y: number) => {
    element.style.setProperty("--parallax-x", `${x}px`);
    element.style.setProperty("--parallax-y", `${y}px`);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const { x, y } = getParallaxOffset(
      event.clientX,
      event.clientY,
      event.currentTarget.getBoundingClientRect(),
    );
    setOffset(event.currentTarget, x, y);
  };

  const handlePointerLeave = (event: PointerEvent<HTMLDivElement>) => {
    setOffset(event.currentTarget, 0, 0);
  };

  return (
    <div
      className="brand-stage"
      data-testid="brand-stage"
      aria-hidden="true"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <span className="contour contour-one" />
      <span className="contour contour-two" />
      <span className="contour contour-three" />
      <svg className="brand-artwork" viewBox="0 0 160 160" focusable="false">
        <use className="brand-artwork__sunrise" href="/brand/betterkabugao-mark.svg#sunrise" fill="#F2C81D" />
        <use className="brand-artwork__silhouette" href="/brand/betterkabugao-mark.svg#kabugao-silhouette" fill="#0032A0" />
      </svg>
      <span className="stage-caption">Independent civic initiative</span>
    </div>
  );
}
