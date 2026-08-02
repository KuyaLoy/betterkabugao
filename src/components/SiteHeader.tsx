import { siteContent } from "../app/site-content";

export function SiteHeader() {
  return (
    <header className="site-header">
      <a className="brand-link" href="/" aria-label="BetterKabugao home">
        <img src="/brand/betterkabugao-mark.svg" alt="" width="42" height="42" />
        <span>BetterKabugao</span>
      </a>
      <a className="header-link" href={siteContent.repositoryUrl} target="_blank" rel="noreferrer">
        View the project on GitHub
      </a>
    </header>
  );
}
