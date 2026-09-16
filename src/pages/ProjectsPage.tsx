import { useMemo, useState } from "react";
import { PageHeader } from "../components/PageHeader";
import { PROJECT_CATEGORIES, PUBLIC_WORKS_PROJECTS, filterProjects, type ProjectCategory } from "../data/projects";
import { metaFor } from "../lib/seo";

const REVIEW_NOTE = "Public Works Watch is a manually reviewed reference to published records. It does not certify completion, quality, legality, procurement compliance, or current status.";
const locations = [...new Set(PUBLIC_WORKS_PROJECTS.map((project) => project.publishedLocation))].sort();
const years = [...new Set(PUBLIC_WORKS_PROJECTS.map((project) => project.fundingYear).filter((year): year is number => year !== undefined))].sort((a, b) => b - a);

function money(value: number) {
  return `₱${value.toLocaleString("en-PH", { minimumFractionDigits: Number.isInteger(value) ? 0 : 2, maximumFractionDigits: 2 })}`;
}

export function ProjectsPage() {
  const meta = metaFor("/projects");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<ProjectCategory | "all">("all");
  const [year, setYear] = useState<number | "all">("all");
  const [location, setLocation] = useState("all");
  const shown = useMemo(() => filterProjects(PUBLIC_WORKS_PROJECTS, { query, category, fundingYear: year, location }), [query, category, year, location]);
  const clear = () => { setQuery(""); setCategory("all"); setYear("all"); setLocation("all"); };

  return (
    <>
      <PageHeader eyebrow="Source-linked register" title="Public Works Watch" description="A manually reviewed register of selected Kabugao public-works records. The official record controls." breadcrumbs={meta.breadcrumbs} />
      <section className="section projects">
        <div className="shell">
          <p className="projects__notice">{REVIEW_NOTE}</p>
          <div className="projects__actions">
            <a href="/data/kabugao-public-works.csv" download>Download CSV</a>
            <a href="/data/kabugao-public-works.json" download>Download JSON</a>
          </div>
          <form className="projects__filters" onSubmit={(event) => event.preventDefault()}>
            <label>Search projects<input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Title, reference, location, contractor…" /></label>
            <label>Filter by category<select value={category} onChange={(event) => setCategory(event.target.value as ProjectCategory | "all")}><option value="all">All categories</option>{PROJECT_CATEGORIES.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
            <label>Filter by funding year<select value={year} onChange={(event) => setYear(event.target.value === "all" ? "all" : Number(event.target.value))}><option value="all">All years</option>{years.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
            <label>Filter by published location<select value={location} onChange={(event) => setLocation(event.target.value)}><option value="all">All published locations</option>{locations.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
            <button type="button" onClick={clear}>Clear filters</button>
          </form>
          <p className="projects__count" role="status">{shown.length} of {PUBLIC_WORKS_PROJECTS.length} projects shown</p>
          {shown.length === 0 ? <p className="projects__empty">No projects match those filters.</p> : <div className="projects__list">{shown.map((project) => (
            <article className="projects__record" key={project.reviewKey}>
              <div><p className="projects__eyebrow">{project.officialRef ?? "Official reference not published in reviewed source"}</p><h2>{project.exactTitle}</h2><p>{project.category} · {project.publishedLocation}</p></div>
              <dl>
                <div><dt>Office</dt><dd>{project.implementingOffice ?? "Not stated in the reviewed source"}</dd></div>
                <div><dt>Contractor</dt><dd>{project.contractor ?? "Contractor unavailable in the reviewed source"}</dd></div>
                <div><dt>Funding year</dt><dd>{project.fundingYear ?? "Not stated in the reviewed source"}</dd></div>
                <div><dt>Status</dt><dd>{project.status.kind === "reported" ? `${project.status.value} (as reported ${project.status.asOf})` : "Not stated in the reviewed source"}</dd></div>
              </dl>
              {project.amounts.length > 0 ? <ul className="projects__amounts">{project.amounts.map((amount) => <li key={`${amount.type}-${amount.value}`}>{money(amount.value)} · {amount.type}</li>)}</ul> : <p className="projects__missing">Amount type unavailable in the reviewed source.</p>}
              <p className="projects__source-note">{project.sourceNote}</p>
              <p className="projects__review">Source: {project.sourcePublisher}, linked official record, reviewed {project.reviewedOn}.</p>
              <a className="projects__source" href={project.officialUrl} target="_blank" rel="noreferrer">Open official source for {project.officialRef ?? "this record"}</a>
            </article>
          ))}</div>}
          <p className="projects__cadence">Dataset review: quarterly; monthly only where an official source explicitly labels a record ongoing. Current review: 16 September 2026.</p>
        </div>
      </section>
    </>
  );
}
