import { siteContent } from "../app/site-content";

export function HotlineBar() {
  const { label, national, note } = siteContent.hotline;

  return (
    <div className="hotline">
      <div className="shell hotline__inner">
        <span className="hotline__label">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
            <path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.2.4 2.4.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .8-.2 1l-2.3 2.2Z" />
          </svg>
          {label}
        </span>
        <a className="hotline__number" href={`tel:${national}`}>
          {national}
        </a>
        <span className="hotline__divider" aria-hidden="true" />
        <span className="hotline__note">{note}</span>
      </div>
    </div>
  );
}
