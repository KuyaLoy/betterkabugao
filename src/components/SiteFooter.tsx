import { siteContent } from "../app/site-content";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <p>{siteContent.disclaimer}</p>
      <a href={siteContent.repositoryUrl} target="_blank" rel="noreferrer">View the project on GitHub</a>
    </footer>
  );
}
