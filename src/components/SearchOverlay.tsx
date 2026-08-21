import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SEARCH_KINDS, QUICK_SEARCHES, type SearchEntry, searchSite } from "../lib/search";
import {
  closeSearchOverlay,
  getOverlayServerState,
  getOverlayState,
  isSearchShortcut,
  openSearchOverlay,
  overlayFocusTarget,
  subscribeOverlay,
} from "../lib/search-overlay";

/**
 * Site-wide search overlay.
 *
 * Built on the native `<dialog>` element, the same choice as `HotlineDialog`:
 * the browser supplies the focus trap, Escape-to-close, the backdrop and the
 * top-layer stacking. A hand-rolled palette has to reimplement all four and
 * usually gets the focus trap wrong.
 *
 * Progressive enhancement, unchanged from the rest of the site: every trigger
 * is a real `<a href="/search">`, and the click is only cancelled when
 * `showModal` actually exists. With scripting off, or in a browser without
 * `<dialog>`, Search still takes the visitor to the fallback page — which is
 * why /search keeps its own form, empty state and plain anchors.
 *
 * The open state lives in `src/lib/search-overlay.ts`.
 */

type SearchTriggerProps = {
  className: string;
  /** Visible label. The hero shows placeholder-style text, the masthead a word. */
  children: React.ReactNode;
  id?: string;
  ariaLabel?: string;
};

export function SearchTrigger({ className, children, id, ariaLabel }: SearchTriggerProps) {
  return (
    <a
      id={id}
      className={className}
      href="/search"
      aria-label={ariaLabel}
      aria-keyshortcuts="/"
      onClick={(event) => {
        if (typeof HTMLDialogElement === "undefined") return;
        if (typeof HTMLDialogElement.prototype.showModal !== "function") return;
        event.preventDefault();
        openSearchOverlay(event.currentTarget);
      }}
    >
      {children}
    </a>
  );
}

/** Moves focus between the result anchors, and back up into the input. */
function useResultKeys(inputRef: React.RefObject<HTMLInputElement | null>) {
  return function onKeyDown(event: React.KeyboardEvent<HTMLElement>) {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;

    const container = event.currentTarget.closest(".palette");
    if (!container) return;
    const links = [...container.querySelectorAll<HTMLAnchorElement>("a[data-result]")];
    if (links.length === 0) return;

    event.preventDefault();
    const index = links.indexOf(document.activeElement as HTMLAnchorElement);

    if (event.key === "ArrowDown") {
      links[index < 0 ? 0 : Math.min(index + 1, links.length - 1)]?.focus();
      return;
    }
    if (index <= 0) inputRef.current?.focus();
    else links[index - 1]?.focus();
  };
}

export function SearchOverlay() {
  const { open } = useSyncExternalStore(subscribeOverlay, getOverlayState, getOverlayServerState);
  const dialog = useRef<HTMLDialogElement | null>(null);
  const input = useRef<HTMLInputElement | null>(null);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const onResultKeys = useResultKeys(input);

  const trimmed = query.trim();
  const groups = useMemo(() => {
    const results = searchSite(trimmed, 12);
    return SEARCH_KINDS.map((kind) => ({
      kind,
      entries: results.filter((entry) => entry.kind === kind),
    })).filter((group) => group.entries.length > 0);
  }, [trimmed]);

  const total = groups.reduce((count, group) => count + group.entries.length, 0);

  // Drive the DOM from the store rather than the other way round: no state is
  // set from inside an effect, which `react-hooks/set-state-in-effect` forbids
  // and which caused a hydration mismatch the last time it was tried here.
  useEffect(() => {
    const node = dialog.current;
    if (!node || typeof node.showModal !== "function") return;

    if (open && !node.open) {
      node.showModal();
      input.current?.focus();
    } else if (!open && node.open) {
      node.close();
    }
  }, [open]);

  // Escape and the backdrop both fire `close`; that is where focus goes back.
  useEffect(() => {
    const node = dialog.current;
    if (!node) return;

    function onClose() {
      const target = overlayFocusTarget();
      closeSearchOverlay();
      setQuery("");
      target?.focus();
    }

    node.addEventListener("close", onClose);
    return () => node.removeEventListener("close", onClose);
  }, []);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (!isSearchShortcut(event)) return;
      if (getOverlayState().open) return;

      event.preventDefault();
      openSearchOverlay(null);
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!trimmed) return;
    // Enter with nothing focused goes to the shareable page, so a query is
    // never lost — that page is also the no-JavaScript route.
    navigate(`/search?q=${encodeURIComponent(trimmed)}`);
    closeSearchOverlay();
  }

  return (
    <dialog
      ref={dialog}
      className="palette"
      aria-label="Search BetterKabugao"
      onClick={() => dialog.current?.close()}
      onKeyDown={(event) => {
        if (event.key !== "Escape") return;
        // `<input type="search">` eats the first Escape to clear itself, so the
        // native dialog cancel never fires and the overlay stays open with a
        // query typed. Take Escape over explicitly, from anywhere inside.
        event.preventDefault();
        dialog.current?.close();
      }}
    >
      {/* The backdrop is the dialog element itself, so a click that lands on
          the panel must not bubble up and close it. */}
      <div className="palette__panel" onClick={(event) => event.stopPropagation()} role="presentation">
        <form method="get" action="/search" onSubmit={submit}>
          <label className="sr-only" htmlFor="palette-input">
            Search barangays, officials, hotlines and pages
          </label>
          <div className="palette__field">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
              <path d="M10 2a8 8 0 1 1-4.9 14.3l-3.4 3.4-1.4-1.4 3.4-3.4A8 8 0 0 1 10 2Zm0 2a6 6 0 1 0 0 12 6 6 0 0 0 0-12Z" />
            </svg>
            <input
              id="palette-input"
              ref={input}
              className="palette__input"
              type="search"
              name="q"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={onResultKeys}
              placeholder="A barangay, an official, a hotline, a PSGC code…"
              autoComplete="off"
            />
            <button type="button" className="palette__close" onClick={() => dialog.current?.close()}>
              Close
            </button>
          </div>
        </form>

        <div className="palette__body">
          <p className="sr-only" aria-live="polite">
            {trimmed.length < 2 ? "" : `${total} ${total === 1 ? "result" : "results"} for ${trimmed}`}
          </p>

          {trimmed.length < 2 ? (
            <div className="palette__hint">
              <p className="palette__hint-label">Try</p>
              <ul className="palette__chips">
                {QUICK_SEARCHES.map((term) => (
                  <li key={term}>
                    <button type="button" onClick={() => setQuery(term)}>
                      {term}
                    </button>
                  </li>
                ))}
              </ul>
              <p className="palette__note">
                Open this from any page with <kbd className="palette__kbd">/</kbd> or{" "}
                <kbd className="palette__kbd">Ctrl</kbd> <kbd className="palette__kbd">K</kbd>.
                Enter opens the shareable results page; Escape closes.
              </p>
            </div>
          ) : total > 0 ? (
            groups.map((group) => (
              <section className="palette__group" key={group.kind}>
                <ul className="palette__list">
                  {group.entries.map((entry) => (
                    <PaletteResult key={`${entry.kind}-${entry.title}`} entry={entry} onKeyDown={onResultKeys} />
                  ))}
                </ul>
              </section>
            ))
          ) : (
            <p className="palette__none">
              Nothing matches “{trimmed}”. <Link to="/sitemap" onClick={closeSearchOverlay}>Browse every page</Link>
            </p>
          )}
        </div>
      </div>
    </dialog>
  );
}

function PaletteResult({
  entry,
  onKeyDown,
}: {
  entry: SearchEntry;
  onKeyDown: (event: React.KeyboardEvent<HTMLElement>) => void;
}) {
  return (
    <li>
      <Link to={entry.path} data-result="" onKeyDown={onKeyDown} onClick={closeSearchOverlay}>
        <span className="search__kind">{entry.kind}</span>
        <span className="search__title">{entry.title}</span>
        <span className="search__desc">{entry.summary}</span>
      </Link>
    </li>
  );
}
