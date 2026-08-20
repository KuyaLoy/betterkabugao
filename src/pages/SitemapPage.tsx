import { Link } from "react-router-dom";
import { PageHeader } from "../components/PageHeader";
import { SITEMAP_GROUPS, metaFor } from "../lib/seo";

/**
 * /sitemap — the reader's counterpart to sitemap.xml.
 *
 * Eight of the fifteen portals in the network publish one; we did not. Every
 * item is a real anchor, so the whole site is reachable from this page without
 * JavaScript, without the search box and without the barangay filter. The list
 * is generated from ALL_PATHS, never typed out, so it cannot fall behind the
 * routes — see `auditSitemap()` in `src/lib/seo.ts`.
 */
export function SitemapPage() {
  const meta = metaFor("/sitemap");
  const total = SITEMAP_GROUPS.reduce((sum, group) => sum + group.links.length, 0);

  return (
    <>
      <PageHeader
        variant="hero"
        eyebrow="Sitemap"
        title="Every page on this site"
        description="Grouped so it can be scanned. The 21 barangays are listed one by one, so nothing here is reachable only through a search box or a filter."
        breadcrumbs={meta.breadcrumbs}
        badges={<em className="pill">{total} pages</em>}
      />

      <section className="section">
        <div className="shell">
          <div className="sitemap">
            {SITEMAP_GROUPS.map((group) => (
              <section
                key={group.id}
                className={group.wide ? "sitemap__group sitemap__group--wide" : "sitemap__group"}
                aria-labelledby={`sitemap-${group.id}`}
              >
                <h2 id={`sitemap-${group.id}`}>{group.title}</h2>
                <ul className="sitemap__list">
                  {group.links.map((link) => (
                    <li key={link.path}>
                      <Link to={link.path}>
                        <span className="sitemap__label">{link.label}</span>
                        <span className="sitemap__path">{link.path}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>

          <p className="sitemap__note">
            Search engines read <a href="/sitemap.xml">sitemap.xml</a>, which is declared in{" "}
            <a href="/robots.txt">robots.txt</a> and carries the same pages as this one.
          </p>
        </div>
      </section>
    </>
  );
}
