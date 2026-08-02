export function BrandArtwork() {
  return (
    <div className="brand-stage" data-testid="brand-stage" aria-hidden="true">
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
