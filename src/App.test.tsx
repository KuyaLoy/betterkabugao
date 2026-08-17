import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { App } from "./App";
import { BARANGAYS } from "./data/barangays";
import { ALL_PATHS } from "./lib/seo";

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  );
}

beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn(() => new Promise(() => {})));
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("site shell", () => {
  it("puts the same landmarks and hotline on every page", () => {
    for (const path of ["/", "/government/barangays", "/government/officials", "/about"]) {
      cleanup();
      renderAt(path);
      expect(screen.getByRole("banner")).toBeInTheDocument();
      expect(screen.getByRole("main")).toHaveAttribute("id", "main-content");
      expect(screen.getByRole("contentinfo")).toBeInTheDocument();
      expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
      expect(screen.getByRole("link", { name: "911" })).toHaveAttribute("href", "tel:911");
    }
  });

  it("renders an honest 404 rather than swallowing unknown paths", () => {
    renderAt("/no-such-page");
    expect(screen.getByRole("heading", { level: 1, name: /Page not found/i })).toBeInTheDocument();
  });

  it("renders every prerendered path without crashing", () => {
    for (const path of ALL_PATHS) {
      cleanup();
      expect(() => renderAt(path)).not.toThrow();
      expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    }
  });
});

describe("home page", () => {
  it("is a real homepage, not a coming-soon holding page", () => {
    renderAt("/");
    expect(
      screen.getByRole("heading", { level: 1, name: /Public information about Kabugao/i }),
    ).toBeInTheDocument();
    // the launch-page status chip is gone
    expect(screen.queryByText(/^Coming soon$/i)).not.toBeInTheDocument();
  });

  it("shows Kabugao at a glance with sourced figures", () => {
    renderAt("/");
    expect(screen.getByText("16,425")).toBeInTheDocument();
    expect(screen.getByText("935.12 km²")).toBeInTheDocument();
    expect(screen.getByText("1st class")).toBeInTheDocument();
    expect(screen.getByText(/PSGC 1408104000/)).toBeInTheDocument();
  });

  it("links into the sections that exist", () => {
    renderAt("/");
    const main = screen.getByRole("main");
    for (const href of ["/government/barangays", "/government/officials", "/transparency", "/about"]) {
      expect(within(main).getAllByRole("link").some((l) => l.getAttribute("href") === href)).toBe(true);
    }
  });
});

describe("barangay list page", () => {
  it("lists all 21 barangays, each linking to its own page", () => {
    renderAt("/government/barangays");
    const rows = screen.getAllByRole("row").filter((r) => r.getAttribute("href"));
    expect(rows).toHaveLength(21);
    for (const b of BARANGAYS) {
      expect(rows.some((r) => r.getAttribute("href") === `/government/barangays/${b.slug}`)).toBe(true);
    }
  });

  it("filters as you type and reports the count", async () => {
    const user = userEvent.setup();
    renderAt("/government/barangays");
    expect(screen.getByText(/Showing all 21 barangays/)).toBeInTheDocument();

    await user.type(screen.getByLabelText(/Filter barangays/i), "pobla");
    expect(screen.getAllByRole("row").filter((r) => r.getAttribute("href"))).toHaveLength(1);
    expect(screen.getByText(/1 of 21 barangays match/)).toBeInTheDocument();
  });

  it("explains that barangay officials are withheld", () => {
    renderAt("/government/barangays");
    expect(
      screen.getByRole("heading", { name: /not published by any government source/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Republic Act 12232/)).toBeInTheDocument();
  });
});

describe("barangay detail pages", () => {
  it("gives every barangay a page with its own verified data", () => {
    for (const b of BARANGAYS) {
      cleanup();
      renderAt(`/government/barangays/${b.slug}`);
      expect(screen.getByRole("heading", { level: 1, name: b.name })).toBeInTheDocument();

      const main = screen.getByRole("main");
      expect(main.textContent).toContain(b.population.toLocaleString("en-PH"));
      expect(main.textContent).toContain(b.psgc);

      const maps = within(main).getAllByRole("link", { name: /view on map/i });
      const dirs = within(main).getAllByRole("link", { name: /directions/i });
      expect(maps[0]).toHaveAttribute("href", expect.stringContaining(`${b.lat},${b.lon}`));
      expect(dirs[0]).toHaveAttribute("href", expect.stringContaining(`destination=${b.lat},${b.lon}`));
    }
  });

  it("shows breadcrumbs back up the hierarchy", () => {
    renderAt("/government/barangays/poblacion");
    const crumbs = screen.getByRole("navigation", { name: /breadcrumb/i });
    expect(within(crumbs).getByRole("link", { name: "Home" })).toHaveAttribute("href", "/");
    expect(within(crumbs).getByRole("link", { name: "Barangays" })).toHaveAttribute(
      "href",
      "/government/barangays",
    );
    expect(within(crumbs).getByText("Poblacion")).toHaveAttribute("aria-current", "page");
  });

  it("links to the nearest barangays with real distances", () => {
    renderAt("/government/barangays/poblacion");
    const main = screen.getByRole("main");
    expect(within(main).getByText(/Nearest barangays/i)).toBeInTheDocument();
    expect(within(main).getAllByText(/km away/).length).toBe(3);
  });

  it("handles an unknown barangay slug honestly", () => {
    renderAt("/government/barangays/not-a-barangay");
    expect(screen.getByRole("heading", { level: 1, name: /Barangay not found/i })).toBeInTheDocument();
  });
});

describe("officials page", () => {
  it("publishes the executive and all eight Sangguniang Bayan members", () => {
    renderAt("/government/officials");
    const main = screen.getByRole("main");
    expect(within(main).getByText("Bensmar B. Ligwang")).toBeInTheDocument();
    expect(within(main).getByText("Frederick C. Amid")).toBeInTheDocument();
    expect(within(main).getAllByText("Sangguniang Bayan Member")).toHaveLength(8);
    expect(within(main).getByRole("link", { name: /Kabugao eLGU/ })).toHaveAttribute(
      "href",
      "https://elgu-kabugao-apayao-news.e.gov.ph/officials",
    );
  });
});

describe("search", () => {
  it("finds a barangay by name and links to its page", async () => {
    const user = userEvent.setup();
    renderAt("/search");
    await user.type(screen.getByLabelText(/Search BetterKabugao/i), "musimut");

    const results = screen.getByRole("list", { name: "Search results" });
    expect(within(results).getByRole("link", { name: /Barangay Musimut/ })).toHaveAttribute(
      "href",
      "/government/barangays/musimut",
    );
  });

  it("finds an official by name", async () => {
    const user = userEvent.setup();
    renderAt("/search");
    await user.type(screen.getByLabelText(/Search BetterKabugao/i), "ligwang");
    expect(screen.getByRole("list", { name: "Search results" }).textContent).toContain("Bensmar B. Ligwang");
  });

  it("says so plainly when nothing matches", async () => {
    const user = userEvent.setup();
    renderAt("/search");
    await user.type(screen.getByLabelText(/Search BetterKabugao/i), "zzzzz");
    expect(screen.getByText(/No matches for/)).toBeInTheDocument();
  });
});

describe("maps", () => {
  // Leaflet needs real layout, which jsdom does not provide, so these assert
  // what a visitor gets before (or without) the map: the same destinations.
  it("gives the homepage map an accessible name and a working fallback", () => {
    renderAt("/");
    const region = screen.getByRole("region", { name: /Map of all 21 barangays of Kabugao/i });
    expect(region).toBeInTheDocument();

    const fallback = document.querySelector(".map__fallback");
    expect(fallback).not.toBeNull();
    expect(region.getAttribute("aria-describedby")).toBe(fallback?.id);
    expect(within(fallback as HTMLElement).getByRole("link", { name: /view on map/i })).toHaveAttribute(
      "href",
      expect.stringContaining("18.024501,121.184501"),
    );
  });

  it("centres the barangay map on the barangay whose page it is", () => {
    renderAt("/government/barangays/musimut");
    const region = screen.getByRole("region", { name: /Map showing barangay Musimut/i });
    expect(region).toBeInTheDocument();

    const fallback = document.querySelector(".map__fallback") as HTMLElement;
    expect(within(fallback).getByRole("link", { name: /directions/i })).toHaveAttribute(
      "href",
      expect.stringContaining("destination=18.03135,121.112363"),
    );
  });

  it("credits OpenStreetMap on every page that shows a map", () => {
    for (const path of ["/", "/government/barangays/waga"]) {
      cleanup();
      renderAt(path);
      expect(screen.getByText(/Map data © OpenStreetMap contributors \(ODbL\)/)).toBeInTheDocument();
    }
  });

  it("keeps the map off pages that do not need one", () => {
    renderAt("/government/officials");
    expect(document.querySelector(".map")).toBeNull();
  });
});

describe("site-wide guarantees", () => {
  it("opens external links without leaking the referrer", () => {
    for (const path of ["/", "/government/barangays", "/government/barangays/poblacion", "/government/officials", "/about"]) {
      cleanup();
      renderAt(path);
      const external = screen.getAllByRole("link").filter((l) => l.getAttribute("target") === "_blank");
      for (const link of external) {
        expect(link.getAttribute("rel")).toContain("noreferrer");
      }
    }
  });

  it("stays CSP-safe with no inline styles and decorative SVGs hidden", () => {
    for (const path of ["/", "/government/barangays", "/government/barangays/waga"]) {
      cleanup();
      const { container } = renderAt(path);
      expect(container.querySelector("[style]")).toBeNull();
      expect(container.querySelectorAll("svg:not([aria-hidden='true'])")).toHaveLength(0);
    }
  });

  it("never renders a weather placeholder while the request is pending", () => {
    renderAt("/");
    expect(screen.queryByText(/°C/)).not.toBeInTheDocument();
  });
});
