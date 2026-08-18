import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  HOTLINES,
  HOTLINE_SOURCE,
  NATIONAL_EMERGENCY,
  formatInternational,
  telHref,
} from "../data/hotlines";

/**
 * Every hotline in a popup, openable from the bar on any page.
 *
 * Built on the native `<dialog>` element, which gives the focus trap, Escape to
 * close and focus restoration for free — all of which a hand-rolled modal
 * usually gets wrong.
 *
 * Progressive enhancement: the trigger is a real `<a href="/emergency">`. The
 * click handler only cancels the navigation if `showModal` actually exists, so
 * without JavaScript — or in a browser without `<dialog>` — the link still takes
 * the reader to the full page. Nobody loses access to an emergency number
 * because a script did not load.
 */

type HotlineDialogProps = {
  /** Text for the trigger. */
  label: string;
  className?: string;
};

export function HotlineDialog({ label, className }: HotlineDialogProps) {
  const dialog = useRef<HTMLDialogElement | null>(null);
  const [open, setOpen] = useState(false);

  const close = useCallback(() => {
    dialog.current?.close();
  }, []);

  function openDialog(event: React.MouseEvent<HTMLAnchorElement>) {
    const node = dialog.current;
    // No native dialog support → let the link navigate to /emergency instead.
    if (!node || typeof node.showModal !== "function") return;
    event.preventDefault();
    node.showModal();
    setOpen(true);
  }

  useEffect(() => {
    const node = dialog.current;
    if (!node) return;
    const onClose = () => setOpen(false);
    node.addEventListener("close", onClose);
    return () => node.removeEventListener("close", onClose);
  }, []);

  return (
    <>
      <a className={className} href="/emergency" onClick={openDialog}>
        {label}
      </a>

      <dialog ref={dialog} className="hd" aria-labelledby="hd-title" onClick={close}>
        {/* Clicking the backdrop closes: the backdrop is the dialog element
            itself, so a click landing on it rather than on the panel is outside. */}
        <div
          className="hd__panel"
          onClick={(event) => event.stopPropagation()}
          role="presentation"
        >
          <div className="hd__head">
            <div>
              <p className="hd__eyebrow">Emergency</p>
              <h2 id="hd-title">Kabugao hotlines</h2>
            </div>
            <button type="button" className="hd__close" onClick={close}>
              Close
            </button>
          </div>

          {open ? (
            <div className="hd__body">
              <a className="hd__national" href={`tel:${NATIONAL_EMERGENCY}`}>
                <span className="hd__national-label">Nationwide, from any phone</span>
                <span className="hd__national-number">{NATIONAL_EMERGENCY}</span>
              </a>

              <ul className="hd__list">
                {HOTLINES.map((hotline) => (
                  <li key={hotline.id}>
                    <span className="hd__who">
                      <span className="hd__abbr">{hotline.abbreviation}</span>
                      <span className="hd__name">{hotline.name}</span>
                    </span>
                    <span className="hd__calls">
                      {hotline.numbers.map((number) => (
                        <a
                          key={number}
                          className="hd__call"
                          href={telHref(number)}
                          aria-label={`Call ${hotline.name} on ${formatInternational(number)}`}
                        >
                          {formatInternational(number)}
                        </a>
                      ))}
                    </span>
                  </li>
                ))}
              </ul>

              <p className="hd__note">
                Inside the Philippines, dial these starting <strong>0</strong> instead of{" "}
                <strong>+63</strong>. Published by the municipality on {HOTLINE_SOURCE.published};
                mobile numbers can change, so call {NATIONAL_EMERGENCY} if one does not connect.{" "}
                <Link to="/emergency" onClick={close}>
                  Open the full page
                </Link>
              </p>
            </div>
          ) : null}
        </div>
      </dialog>
    </>
  );
}
