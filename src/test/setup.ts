import "@testing-library/jest-dom/vitest";

/**
 * jsdom 29 does not implement HTMLDialogElement.showModal/close, so the hotline
 * popup could not be exercised at all. This shim gives just enough behaviour to
 * assert on: `open` toggles, and a `close` event fires. The real focus trap and
 * Escape handling are the browser's job and are verified in a real browser.
 */
if (typeof HTMLDialogElement !== "undefined" && !HTMLDialogElement.prototype.showModal) {
  HTMLDialogElement.prototype.showModal = function showModal() {
    this.open = true;
  };
  HTMLDialogElement.prototype.close = function close() {
    this.open = false;
    this.dispatchEvent(new Event("close"));
  };
}
