import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "../components/PageHeader";
import { PROJECT_CATEGORIES, PUBLIC_WORKS_PROJECTS, filterProjects, projectSection, sortProjectsByEvidenceDate, type EvidenceSortOrder, type ProjectCategory, type ProjectStatusFilter } from "../data/projects";
import { metaFor } from "../lib/seo";

const REVIEW_NOTE = "Public Works Watch is a manually reviewed reference to published records. It does not certify completion, quality, legality, procurement compliance, or current status.";
const locations = [...new Set(PUBLIC_WORKS_PROJECTS.map((project) => project.publishedLocation))].sort();
const years = [...new Set(PUBLIC_WORKS_PROJECTS.map((project) => project.fundingYear).filter((year): year is number => year !== undefined))].sort((a, b) => b - a);
const STATUS_OPTIONS: readonly { value: ProjectStatusFilter; label: string }[] = [
  { value: "all", label: "All statuses" },
  { value: "completed", label: "Completed" },
  { value: "ongoing", label: "Ongoing" },
  { value: "planned", label: "Planned" },
  { value: "cancelled", label: "Cancelled" },
  { value: "not stated", label: "Not stated" },
];

function money(value: number) {
  return `₱${value.toLocaleString("en-PH", { minimumFractionDigits: Number.isInteger(value) ? 0 : 2, maximumFractionDigits: 2 })}`;
}

export function ProjectsPage() {
  const meta = metaFor("/projects");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<ProjectCategory | "all">("all");
  const [year, setYear] = useState<number | "all">("all");
  const [location, setLocation] = useState("all");
  const [status, setStatus] = useState<ProjectStatusFilter>("all");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState<EvidenceSortOrder>("newest");

  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;
    const desktop = window.matchMedia("(min-width: 761px)");
    const syncDisclosure = () => setFiltersOpen(desktop.matches);
    syncDisclosure();
    desktop.addEventListener("change", syncDisclosure);
    return () => desktop.removeEventListener("change", syncDisclosure);
  }, []);

  const shown = useMemo(() => sortProjectsByEvidenceDate(filterProjects(PUBLIC_WORKS_PROJECTS, { query, category, fundingYear: year, location, status }), sortOrder), [query, category, year, location, status, sortOrder]);
  const register = shown.filter((project) => projectSection(project) === "project-register");
  const appropriations = shown.filter((project) => projectSection(project) === "historical-appropriations");
  const clear = () => { setQuery(""); setCategory("all"); setYear("all"); setLocation("all"); setStatus("all"); };
  const activeFilterCount = Number(Boolean(query.trim())) + Number(category !== "all") + Number(year !== "all") + Number(location !== "all") + Number(status !== "all");

  const record = (project: (typeof PUBLIC_WORKS_PROJECTS)[number]) => (
    <article className="projects__record" key={project.reviewKey}>
      <div className="projects__record-head"><p className="projects__eyebrow">{project.officialRef ?? "Official reference not published in reviewed source"}</p><h3>{project.exactTitle}</h3><p>{project.category} · {project.publishedLocation}</p></div>
      <div className="projects__evidence">
        <p className={`projects__status projects__status--${project.status.kind === "reported" ? project.status.value : "not-stated"}`}><span>Status</span><strong>{project.status.kind === "reported" ? `${project.status.value} (as reported ${project.status.asOf})` : "Not stated in the reviewed source"}</strong></p>
        <div className="projects__amount">{project.amounts.length > 0 ? project.amounts.map((amount) => <p key={`${amount.type}-${amount.value}`}><strong>{money(amount.value)}</strong><span>{amount.type}</span></p>) : <p><span>Amount type unavailable in the reviewed source.</span></p>}</div>
      </div>
      <a className="projects__source" href={project.officialUrl} target="_blank" rel="noreferrer">Open official source for {project.officialRef ?? "this record"}</a>
      <details className="projects__details">
        <summary>Record details and source</summary>
        <div className="projects__details-body">
          <p className="projects__contractor"><span>Contractor</span><strong>{project.contractor ?? "Contractor unavailable in the reviewed source"}</strong></p>
          <dl>
            <div><dt>Office</dt><dd>{project.implementingOffice ?? "Not stated in the reviewed source"}</dd></div>
            <div><dt>Funding year</dt><dd>{project.fundingYear ?? "Not stated in the reviewed source"}</dd></div>
            <div><dt>Source publisher</dt><dd>{project.sourcePublisher}</dd></div>
            <div><dt>Reviewed</dt><dd>{project.reviewedOn}</dd></div>
          </dl>
          <p className="projects__source-note">{project.sourceNote}</p>
          <p className="projects__review">Source: {project.sourcePublisher}, linked official record, reviewed {project.reviewedOn}.</p>
        </div>
      </details>
    </article>
  );

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
            <label className="projects__search">Search projects<input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Title, reference, location, contractor…" /></label>
            <details className="projects__filter-disclosure" open={filtersOpen} onToggle={(event) => setFiltersOpen(event.currentTarget.open)}>
              <summary>Filter records ({activeFilterCount} active)</summary>
              <div className="projects__filter-fields">
                <label>Filter by category<select value={category} onChange={(event) => setCategory(event.target.value as ProjectCategory | "all")}><option value="all">All categories</option>{PROJECT_CATEGORIES.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
                <label>Filter by funding year<select value={year} onChange={(event) => setYear(event.target.value === "all" ? "all" : Number(event.target.value))}><option value="all">All years</option>{years.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
                <label>Filter by published location<select value={location} onChange={(event) => setLocation(event.target.value)}><option value="all">All published locations</option>{locations.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
                <label>Filter by status<select value={status} onChange={(event) => setStatus(event.target.value as ProjectStatusFilter)}>{STATUS_OPTIONS.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label>
                <label>Sort records by evidence date<select value={sortOrder} onChange={(event) => setSortOrder(event.target.value as EvidenceSortOrder)}><option value="newest">Newest evidence first</option><option value="oldest">Oldest evidence first</option></select></label>
                <button type="button" onClick={clear}>Clear filters</button>
              </div>
              <p className="projects__sort-note">Evidence date uses the published status date, or funding year where no status was published. It is not a current completion date.</p>
            </details>
          </form>
          <p className="projects__count" role="status">{shown.length} of {PUBLIC_WORKS_PROJECTS.length} selected, source-reviewed records shown</p>
          {shown.length === 0 ? <p className="projects__empty">No projects match those filters.</p> : <div className="projects__list">
            {register.length > 0 && <section className="projects__section" aria-labelledby="projects-register"><div className="projects__section-head"><p>Source-linked delivery records</p><h2 id="projects-register">Project register</h2></div>{register.map(record)}</section>}
            {appropriations.length > 0 && <section className="projects__section" aria-labelledby="projects-appropriations"><div className="projects__section-head"><p>Appropriations are not proof of award, start, or completion.</p><h2 id="projects-appropriations">Historical appropriations</h2></div>{appropriations.map(record)}</section>}
          </div>}
          <p className="projects__cadence">Dataset review: quarterly; monthly only where an official source explicitly labels a record ongoing. Current review: 16 September 2026.</p>
        </div>
      </section>
    </>
  );
}
