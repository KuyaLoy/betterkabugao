import { useEffect, useId, useMemo, useState } from "react";
import { directionsLink, findBarangay, mapLink } from "../data/barangays";

/**
 * OpenStreetMap map, mounted after hydration.
 *
 * Why it is built this way:
 *
 * - **Leaflet is loaded lazily.** The map is not needed to read the page, and
 *   every route here is prerendered to static HTML. A dynamic import keeps
 *   Leaflet out of the initial bundle, so a visitor on mobile data pays for it
 *   only when a page that shows a map is opened.
 * - **It never runs during prerendering.** Leaflet touches `window`, so the
 *   server render emits the fallback below instead: the same place links a
 *   visitor without JavaScript would need. The fallback is what Facebook and
 *   Viber see, which is fine — they cannot use a map anyway.
 * - **Barangays are addressed by slug, not passed as objects.** The props stay
 *   primitives, so the effect's dependencies are stable and the map is not torn
 *   down and rebuilt on every render.
 * - **Its stylesheet is bundled, not injected.** `leaflet.css` is imported from
 *   `src/styles.css`, so it arrives in our own stylesheet over a `<link>`. A
 *   dynamic `import("leaflet/dist/leaflet.css")` would have Vite inject a
 *   `<style>` element at runtime, which `style-src 'self'` blocks.
 * - **CSP.** Leaflet 1.9.4 positions layers with CSSOM property writes
 *   (`el.style.transform = …`), which the Content-Security-Policy permits; it
 *   never calls `setAttribute("style", …)`, which the policy blocks. It ships
 *   no `eval`. Verified against `node_modules/leaflet` — re-check on upgrade.
 *   Tiles come from `tile.openstreetmap.org`, the only host added to `img-src`
 *   in `public/_headers`.
 * - **Markers are `divIcon`s, not the default pins.** Leaflet's default icon
 *   resolves image paths at runtime and breaks under a bundler; a `divIcon` is
 *   a plain element styled from our own stylesheet, so it needs no image
 *   request and matches the BetterGov palette.
 */

type MapViewProps = {
  /** Barangay slugs to plot. Unknown slugs are ignored. */
  slugs: readonly string[];
  /** The subject of the page — drawn in gold and opened first. */
  primarySlug?: string;
  /**
   * Ceiling for the fitted zoom. The view always frames every pin — a fixed
   * zoom silently cropped the farthest neighbour off a local map — but a tight
   * cluster would otherwise zoom in past anything recognisable.
   */
  maxZoom?: number;
  height: "tall" | "short";
  /** Accessible name for the map region. */
  label: string;
};

const TILE_URL = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
const TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors';

/** Escapes text before it goes into a Leaflet popup, which takes HTML. */
function escapeHtml(value: string): string {
  return value.replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string,
  );
}

export function MapView({ slugs, primarySlug, maxZoom, height, label }: MapViewProps) {
  const [holder, setHolder] = useState<HTMLDivElement | null>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const fallbackId = useId();

  // A primitive key so the effect below re-runs only when the plotted set
  // genuinely changes, not on every render of the parent page.
  const key = `${slugs.join(",")}|${primarySlug ?? ""}`;
  const subject = findBarangay(primarySlug ?? slugs[0]);
  const barangays = useMemo(
    () => key.split("|")[0].split(",").map(findBarangay).filter((b) => b !== undefined),
    [key],
  );

  useEffect(() => {
    if (!holder || barangays.length === 0) return;

    let cancelled = false;
    // Kept so the cleanup can dispose the map even if the import resolves after
    // this effect has been torn down by a route change.
    let created: { remove: () => void } | null = null;

    async function mount() {
      let L: typeof import("leaflet");
      try {
        L = await import("leaflet");
      } catch {
        if (!cancelled) setFailed(true);
        return;
      }
      if (cancelled || !holder) return;

      const map = L.map(holder, {
        scrollWheelZoom: false, // never hijack the page scroll
        attributionControl: true,
      });
      created = map;

      L.tileLayer(TILE_URL, { attribution: TILE_ATTRIBUTION, maxZoom: 17, minZoom: 8 }).addTo(map);

      // Measure before fitting, not after: Leaflet sizes the container when the
      // map is created, and on a freshly navigated route that can happen before
      // layout has settled. Fitting against a stale size left pins off-screen.
      map.invalidateSize();
      map.fitBounds(L.latLngBounds(barangays.map((b) => [b.lat, b.lon] as [number, number])), {
        padding: [30, 30],
        maxZoom: maxZoom ?? 15,
      });

      // 21 name labels on one municipal view collide into noise. Label the small
      // local maps; on the overview the name is in the tooltip and the popup.
      const withLabels = barangays.length <= 6;

      for (const b of barangays) {
        const isLead = b.slug === primarySlug;
        const people = b.population.toLocaleString("en-PH");
        const marker = L.marker([b.lat, b.lon], {
          title: `${b.name} — ${people} residents`,
          alt: `${b.name} on the map`,
          keyboard: true,
          icon: L.divIcon({
            className: `map-pin${isLead ? " map-pin--primary" : ""}`,
            html: `<span class="map-pin__dot"></span>${
              withLabels ? `<span class="map-pin__label">${escapeHtml(b.name)}</span>` : ""
            }`,
            iconSize: [14, 14],
            iconAnchor: [7, 7],
            popupAnchor: [0, -8],
          }),
        });
        marker.bindPopup(
          [
            '<div class="map-popup">',
            `<strong>${escapeHtml(b.name)}</strong>`,
            `<span>${people} residents &middot; 2024 POPCEN</span>`,
            isLead ? '<em class="map-popup__here">This barangay</em>' : "",
            `<a href="/government/barangays/${encodeURIComponent(b.slug)}">Open barangay page</a>`,
            "</div>",
          ].join(""),
        );
        marker.addTo(map);
      }

      if (!cancelled) setReady(true);
    }

    void mount();

    return () => {
      cancelled = true;
      created?.remove();
      created = null;
      setReady(false);
    };
  }, [holder, barangays, primarySlug, maxZoom]);

  if (!subject) return null;

  return (
    <div className={`map map--${height}`}>
      <div
        ref={setHolder}
        className="map__canvas"
        role="region"
        aria-label={label}
        aria-describedby={ready ? undefined : fallbackId}
      />
      {/* Server-rendered, and shown until Leaflet mounts, so the page is never a
          dead grey box — and a visitor with JavaScript off still gets the same
          destinations. */}
      {!ready ? (
        <div className="map__fallback" id={fallbackId}>
          <p className="map__fallback-text">
            {failed ? "The interactive map could not load." : "Loading the interactive map…"} You can
            open {subject.name} directly:
          </p>
          <p className="map__fallback-links">
            <a href={mapLink(subject)} target="_blank" rel="noreferrer">
              View on map
            </a>
            <a href={directionsLink(subject)} target="_blank" rel="noreferrer">
              Directions
            </a>
          </p>
        </div>
      ) : null}
      <p className="map__note">
        Map data, tiles and barangay coordinates &copy; OpenStreetMap contributors (ODbL).
      </p>
    </div>
  );
}
