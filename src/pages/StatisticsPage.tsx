import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { PageHeader } from "../components/PageHeader";
import {
  POPULATION_OBSERVATIONS,
  POPULATION_RETRIEVED,
  POPULATION_SOURCES,
} from "../data/population";
import { metaFor } from "../lib/seo";

const CHART = { width: 720, height: 320, left: 64, right: 22, top: 26, bottom: 54, maximum: 18000 };
const Y_TICKS = [0, 6000, 12000, 18000] as const;

function chartPoint(index: number, population: number) {
  const plotWidth = CHART.width - CHART.left - CHART.right;
  const plotHeight = CHART.height - CHART.top - CHART.bottom;
  return {
    x: CHART.left + (index / (POPULATION_OBSERVATIONS.length - 1)) * plotWidth,
    y: CHART.top + (1 - population / CHART.maximum) * plotHeight,
  };
}

function PopulationChart() {
  const chartRef = useRef<HTMLElement>(null);
  const points = POPULATION_OBSERVATIONS.map((observation, index) => ({
    ...observation,
    ...chartPoint(index, observation.population),
  }));
  const line = points.map((point) => `${point.x},${point.y}`).join(" ");

  useEffect(() => {
    const chart = chartRef.current;
    if (
      !chart ||
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ||
      typeof IntersectionObserver === "undefined"
    ) {
      return;
    }

    chart.classList.add("is-motion-ready");
    const line = chart.querySelector(".stats-chart__line");
    const markComplete = () => chart.classList.add("is-complete");
    line?.addEventListener("animationend", markComplete, { once: true });
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting || entry.intersectionRatio < 0.2) return;
        chart.classList.add("is-visible");
        observer.disconnect();
      },
      { threshold: 0.2 },
    );
    observer.observe(chart);

    return () => {
      line?.removeEventListener("animationend", markComplete);
      observer.disconnect();
    };
  }, []);

  return (
    <figure ref={chartRef} className="stats-chart" aria-labelledby="population-chart-caption">
      <div className="stats-chart__bar">
        <p>Population record</p>
        <span>Counts, not annual estimates</span>
      </div>
      <svg
        className="stats-chart__svg"
        viewBox={`0 0 ${CHART.width} ${CHART.height}`}
        role="img"
        aria-labelledby="population-chart-title"
        aria-describedby="population-chart-desc"
      >
        <title id="population-chart-title">Kabugao population observations from 1960 to 2024</title>
        <desc id="population-chart-desc">
          A line chart of selected official census and POPCEN observations. The full values and sources are in the table below.
        </desc>
        {Y_TICKS.map((tick) => {
          const y = chartPoint(0, tick).y;
          return (
            <g key={tick}>
              <line className="stats-chart__grid" x1={CHART.left} x2={CHART.width - CHART.right} y1={y} y2={y} />
              <text className="stats-chart__axis" x={CHART.left - 10} y={y + 4} textAnchor="end">
                {tick.toLocaleString("en-PH")}
              </text>
            </g>
          );
        })}
        <polyline className="stats-chart__line" points={line} pathLength="1" />
        {points.map((point, index) => (
          <g className="stats-chart__observation" data-step={index} data-year={point.year} key={point.year}>
            <circle className="stats-chart__point" cx={point.x} cy={point.y} r="4.5" />
            <text className="stats-chart__year" x={point.x} y={CHART.height - 22} textAnchor="middle">
              {point.year}
            </text>
          </g>
        ))}
      </svg>
      <figcaption id="population-chart-caption">
        Selected official census and POPCEN observations, 1960–2024. Missing years are not estimated.
      </figcaption>
    </figure>
  );
}

export function StatisticsPage() {
  const meta = metaFor("/statistics");

  return (
    <>
      <PageHeader
        variant="kv"
        eyebrow="Kabugao statistics"
        title="Kabugao population observations"
        description="A source-led record of selected official census and POPCEN counts. It shows only the years verified in the original publications."
        breadcrumbs={meta.breadcrumbs}
      />

      <section className="section stats" aria-labelledby="statistics-record-title">
        <div className="shell">
          <div className="stats__intro">
            <div>
              <p className="stats__kicker">Selected record</p>
              <h2 id="statistics-record-title">A population record you can check</h2>
            </div>
            <p>
              Each point is a published census or POPCEN count for Kabugao. The chart connects verified observations for reading; it does not fill in missing years or project future population.
            </p>
          </div>

          <PopulationChart />

          <div className="stats__body">
            <div className="stats__table-wrap">
              <table className="stats-table" aria-label="Selected official census and POPCEN observations, 1960 to 2024">
                <caption>Selected official population observations for Kabugao</caption>
                <thead>
                  <tr>
                    <th scope="col">Year</th>
                    <th scope="col">Population</th>
                    <th scope="col">Source record</th>
                  </tr>
                </thead>
                <tbody>
                  {POPULATION_OBSERVATIONS.map((observation) => {
                    const source = POPULATION_SOURCES[observation.source];
                    return (
                      <tr key={observation.year}>
                        <td>{observation.year}</td>
                        <td>{observation.population.toLocaleString("en-PH")}</td>
                        <td>
                          <a href={source.href} target="_blank" rel="noreferrer">
                            {source.label}
                          </a>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <aside className="stats__sources" aria-labelledby="statistics-sources-title">
              <h2 id="statistics-sources-title">Sources and method</h2>
              <p>
                Counts are observations from the cited publications, not annual estimates. Candidate values without a directly verified source document are withheld.
              </p>
              <ul>
                {Object.values(POPULATION_SOURCES).map((source) => (
                  <li key={source.href}>
                    <a href={source.href} target="_blank" rel="noreferrer">
                      {source.label}
                    </a>
                    <span>{source.detail}</span>
                  </li>
                ))}
              </ul>
              <p className="stats__retrieved">Retrieved {POPULATION_RETRIEVED}.</p>
              <Link className="btn btn--solid" to="/government/barangays">
                All 21 barangays →
              </Link>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
