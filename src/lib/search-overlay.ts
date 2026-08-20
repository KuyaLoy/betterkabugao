/**
 * Open state for the site-wide search overlay.
 *
 * Kept out of the component file for the same reason as `src/lib/routes.ts`: a
 * module that exports anything other than components breaks fast refresh
 * (`react-refresh/only-export-components`). It also happens to be the better
 * shape — the state lives outside React so any trigger, and the document-level
 * key handler, can open the one mounted overlay without prop drilling or a
 * context provider.
 */

/** The id the masthead trigger carries, so `/` knows where to hand focus back. */
export const SEARCH_TRIGGER_ID = "site-search-trigger";

export type OverlayState = {
  open: boolean;
  /** Element focus returns to when the overlay closes. */
  trigger: HTMLElement | null;
};

/**
 * One frozen object shared by the server snapshot and the initial client state,
 * so `useSyncExternalStore` sees no change during hydration. Every route is
 * prerendered with the overlay closed; a different object here would be a
 * hydration mismatch.
 */
export const CLOSED: OverlayState = Object.freeze({ open: false, trigger: null });

let state: OverlayState = CLOSED;
const listeners = new Set<() => void>();

function emit(): void {
  for (const listener of listeners) listener();
}

export function subscribeOverlay(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getOverlayState(): OverlayState {
  return state;
}

export function getOverlayServerState(): OverlayState {
  return CLOSED;
}

/**
 * Opens the overlay. Pass the element that was clicked so focus can return to
 * it. A keyboard shortcut has no trigger element, so `null` means "hand focus
 * back to the masthead Search button" — the requirement is that Escape lands
 * the visitor on Search, not wherever they happened to be standing.
 */
export function openSearchOverlay(trigger?: HTMLElement | null): void {
  state = { open: true, trigger: trigger ?? null };
  emit();
}

export function closeSearchOverlay(): void {
  if (!state.open) return;
  state = CLOSED;
  emit();
}

/** The element to focus after closing. */
export function overlayFocusTarget(): HTMLElement | null {
  return state.trigger ?? document.getElementById(SEARCH_TRIGGER_ID);
}

/** True when the visitor is typing, so `/` must stay a literal slash. */
export function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  return ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName);
}

/**
 * True when the key event should open search. `/` is the convention on GitHub,
 * GitLab and Wikipedia and collides with nothing. Ctrl/Cmd+K is accepted too
 * because people try it, but it is not the documented shortcut: Ctrl+K focuses
 * the address bar in Firefox.
 */
export function isSearchShortcut(event: KeyboardEvent): boolean {
  if (event.defaultPrevented || isTypingTarget(event.target)) return false;
  const slash = event.key === "/" && !event.metaKey && !event.ctrlKey && !event.altKey;
  const paletteKey = event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey);
  return slash || paletteKey;
}
