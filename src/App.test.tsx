import { cleanup, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { App } from "./App";
import { BARANGAYS } from "./data/barangays";
import { ALL_PATHS, RECOVERY_LINKS, SITEMAP_EXCLUDED, SITEMAP_GROUPS, auditSitemap } from "./lib/seo";
import { QUICK_SEARCHES, searchSite } from "./lib/search";
import { closeSearchOverlay } from "./lib/search-overlay";

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
  closeSearchOverlay();
  vi.unstubAllGlobals();
});

describe("site shell", () => {
  it("puts the same landmarks and one emergency action on every page", () => {
    for (const path of ["/", "/government/barangays", "/government/officials", "/about"]) {
      cleanup();
      renderAt(path);
      expect(screen.getByRole("banner")).toBeInTheDocument();
      expect(screen.getByRole("main")).toHaveAttribute("id", "main-content");
      expect(screen.getByRole("contentinfo")).toBeInTheDocument();
      expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
      // One emergency action lives in the header, linking to the hotlines page.
      const emergency = within(screen.getByRole("banner")).getByRole("link", { name: /emergency/i });
      expect(emergency).toHaveAttribute("href", "/emergency");
    }
  });

  it("renders an honest 404 rather than swallowing unknown paths", () => {
    renderAt("/no-such-page");
    expect(screen.getByRole("heading", { level: 1, name: /does not exist/i })).toBeInTheDocument();
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
      screen.getByRole("heading", { level: 1, name: /Know your Kabugao/i }),
    ).toBeInTheDocument();
    // the launch-page status chip is gone
    expect(screen.queryByText(/^Coming soon$/i)).not.toBeInTheDocument();
  });

  it("shows Kabugao at a glance with sourced figures", () => {
    renderAt("/");
    const main = screen.getByRole("main");
    expect(within(main).getByText("16,425")).toBeInTheDocument();
    expect(within(main).getByText("935.12 km²")).toBeInTheDocument();
  });

  it("links into the sections that exist", () => {
    renderAt("/");
    const main = screen.getByRole("main");
    for (const href of ["/government/barangays", "/government/officials", "/emergency", "/about"]) {
      expect(within(main).getAllByRole("link").some((l) => l.getAttribute("href") === href)).toBe(true);
    }
  });
});

describe("barangay list page", () => {
  it("lists all 21 barangays as real crawlable links to their own pages", () => {
    renderAt("/government/barangays");
    // Real navigating anchors, not role=row with cancelled clicks.
    const dir = screen.getByRole("list", { name: "Barangays of Kabugao" });
    const links = within(dir).getAllByRole("link");
    expect(links).toHaveLength(21);
    for (const b of BARANGAYS) {
      expect(links.some((l) => l.getAttribute("href") === `/government/barangays/${b.slug}`)).toBe(true);
    }
  });

  it("gives every barangay a separate map-preview control", () => {
    renderAt("/government/barangays");
    const dir = screen.getByRole("list", { name: "Barangays of Kabugao" });
    // One preview button per barangay, distinct from the navigating link.
    expect(within(dir).getAllByRole("button", { name: /Show .* on the map/i })).toHaveLength(21);
  });

  it("filters as you type and reports the count", async () => {
    const user = userEvent.setup();
    renderAt("/government/barangays");
    expect(screen.getByText(/Showing all 21 barangays/)).toBeInTheDocument();

    await user.type(screen.getByLabelText(/Filter barangays/i), "pobla");
    const dir = screen.getByRole("list", { name: "Barangays of Kabugao" });
    expect(within(dir).getAllByRole("link")).toHaveLength(1);
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
  const field = () => screen.getByLabelText(/Search everything published here/i);
  // The header and footer repeat destinations like Home, Sitemap and the
  // emergency action, so every query here is scoped to <main>.
  const page = () => within(screen.getByRole("main"));

  it("finds a barangay by name and links to its page", async () => {
    const user = userEvent.setup();
    renderAt("/search");
    await user.type(field(), "musimut");

    const group = page().getByRole("region", { name: "Barangays" });
    expect(within(group).getByRole("link", { name: /Barangay Musimut/ })).toHaveAttribute(
      "href",
      "/government/barangays/musimut",
    );
  });

  it("finds an official by name", async () => {
    const user = userEvent.setup();
    renderAt("/search");
    await user.type(field(), "ligwang");
    expect(page().getByRole("region", { name: "Elected officials" }).textContent).toContain(
      "Bensmar B. Ligwang",
    );
  });

  it("groups results by kind and counts them", async () => {
    const user = userEvent.setup();
    renderAt("/search");
    await user.type(field(), "mdrrmo");

    // A hotline is its own kind of answer, not a page that mentions one.
    const group = page().getByRole("region", { name: "Emergency hotlines" });
    expect(within(group).getByRole("link", { name: /MDRRMO/ })).toHaveAttribute("href", "/emergency");
    expect(page().getByText(/results? for/)).toBeInTheDocument();
  });

  it("suggests starting points before anything is typed", () => {
    renderAt("/search");

    for (const term of QUICK_SEARCHES) {
      expect(page().getByRole("link", { name: term })).toHaveAttribute(
        "href",
        `/search?q=${encodeURIComponent(term)}`,
      );
    }
    // And a way out that does not involve searching at all.
    expect(page().getByRole("link", { name: "Sitemap" })).toHaveAttribute("href", "/sitemap");
  });

  it("preloads ?q= into the field and shows its results", async () => {
    renderAt("/search?q=poblacion");
    // The URL is only read after hydration, so the first paint matches the
    // prerendered HTML. Wait for the value rather than asserting synchronously.
    expect(await screen.findByDisplayValue("poblacion")).toBeInTheDocument();
    expect(page().getByRole("link", { name: /Barangay Poblacion/ })).toHaveAttribute(
      "href",
      "/government/barangays/poblacion",
    );
  });

  it("offers a way out when nothing matches", async () => {
    const user = userEvent.setup();
    renderAt("/search");
    await user.type(field(), "zzzzz");

    expect(page().getByRole("heading", { level: 2, name: /Nothing matches/ })).toBeInTheDocument();
    // Scoped to the list: the breadcrumb above it also links Home.
    const recovery = within(page().getByRole("list", { name: "Recovery links" }));
    for (const link of RECOVERY_LINKS.filter((l) => l.to !== "/search")) {
      expect(recovery.getByRole("link", { name: link.label })).toHaveAttribute("href", link.to);
    }
  });

  it("every suggested query returns at least one result", () => {
    for (const term of QUICK_SEARCHES) {
      expect(searchSite(term).length, `no results for suggested query "${term}"`).toBeGreaterThan(0);
    }
  });
});

describe("404 recovery", () => {
  it("offers a real search form aimed at /search", () => {
    const { container } = renderAt("/no-such-page");

    const form = container.querySelector("form");
    expect(form).toHaveAttribute("action", "/search");
    expect(form).toHaveAttribute("method", "get");
    expect(form?.querySelector("input[name='q']")).toBeInTheDocument();
    expect(screen.getAllByRole("main")).toHaveLength(1);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
  });

  it("keeps every recovery link an ordinary anchor, so it works without the box", () => {
    renderAt("/no-such-page");

    const recovery = within(screen.getByRole("navigation", { name: /Or go straight to/i }));
    for (const link of RECOVERY_LINKS.filter((l) => l.to !== "/search")) {
      expect(recovery.getByRole("link", { name: link.label })).toHaveAttribute("href", link.to);
    }
    // Every destination is a route the site actually prerenders.
    for (const link of RECOVERY_LINKS) {
      expect(ALL_PATHS).toContain(link.to);
    }
  });
});

describe("emergency hotlines", () => {
  it("keeps one emergency action in the header of every page, aimed at the hotlines", () => {
    for (const path of ["/", "/government/barangays", "/about"]) {
      cleanup();
      renderAt(path);
      // The persistent Emergency 911 control lives in the header and routes to
      // the hotlines page, where every dialable number is listed.
      const emergency = within(screen.getByRole("banner")).getByRole("link", { name: /emergency/i });
      expect(emergency).toHaveAttribute("href", "/emergency");
    }
  });

  it("lists every office once, in the international format", () => {
    renderAt("/emergency");
    const main = screen.getByRole("main");

    for (const [office, intl] of [
      ["MDRRMO", "+63 927 591 9022"],
      ["KMPS", "+63 967 038 7227"],
      ["BFP", "+63 915 607 6569"],
      ["APH", "+63 997 770 6611"],
      ["RHU", "+63 905 041 7278"],
      ["MSWDO", "+63 975 655 6026"],
      ["ICT Office", "+63 915 942 5676"],
    ] as const) {
      expect(within(main).getByText(office)).toBeInTheDocument();
      expect(within(main).getByText(intl)).toBeInTheDocument();
      // and never the same digits twice in two formats
      expect(within(main).queryByText(intl.replace("+63 ", "0"))).not.toBeInTheDocument();
    }

    // RMFB 15 publishes two numbers; both must be listed.
    expect(within(main).getByText("+63 929 359 3704")).toBeInTheDocument();
    expect(within(main).getByText("+63 905 206 0446")).toBeInTheDocument();

    // Every call link dials internationally, never with a leading zero.
    const calls = within(main).getAllByRole("link", { name: /^Call / });
    expect(calls).toHaveLength(9);
    for (const call of calls) {
      expect(call.getAttribute("href")).toMatch(/^tel:\+63\d{10}$/);
    }
  });

  it("names its source and does not pretend to run the hotlines", () => {
    renderAt("/emergency");
    const main = screen.getByRole("main");
    expect(within(main).getByRole("link", { name: /Discover Kabugao/i })).toHaveAttribute(
      "href",
      expect.stringContaining("facebook.com/discoverkabugao"),
    );
    expect(within(main).getAllByText(/15 April 2026/).length).toBeGreaterThan(0);
    expect(within(main).getByText(/Mobile numbers can change/)).toBeInTheDocument();
    // the 911 card is one big tap target, so match it by its heading text
    expect(
      within(main).getByRole("link", { name: /National emergency hotline/i }),
    ).toHaveAttribute("href", "tel:911");
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
      expect(
        screen.getByText(/Map data, tiles and barangay coordinates © OpenStreetMap contributors \(ODbL\)/),
      ).toBeInTheDocument();
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

describe("sitemap page", () => {
  it("links every route except the deliberate exclusions, exactly once", () => {
    const { missing, duplicates } = auditSitemap();
    expect(missing).toEqual([]);
    expect(duplicates).toEqual([]);
    expect(SITEMAP_EXCLUDED).toEqual(["/404"]);
  });

  it("groups the pages in the agreed order without inventing a group", () => {
    expect(SITEMAP_GROUPS.map((group) => group.title)).toEqual([
      "Core",
      "Government",
      "Barangays",
      "Safety",
      "Explore and services",
      "Project and meta",
    ]);
    // Only the barangay group spans the row.
    expect(SITEMAP_GROUPS.filter((group) => group.wide).map((g) => g.id)).toEqual(["barangays"]);
  });

  it("renders one h1 and a real href per page, and never offers /404", () => {
    renderAt("/sitemap");

    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getAllByRole("heading", { level: 2 })).toHaveLength(SITEMAP_GROUPS.length);

    const hrefs = new Set(screen.getAllByRole("link").map((link) => link.getAttribute("href")));
    for (const path of ALL_PATHS) {
      if (path === "/404") continue;
      expect(hrefs.has(path)).toBe(true);
    }
    expect(hrefs.has("/404")).toBe(false);
    expect(hrefs.has("/sitemap.xml")).toBe(true);
  });

  it("is reachable from the footer of every page", () => {
    for (const path of ["/", "/emergency", "/government/barangays/poblacion"]) {
      cleanup();
      renderAt(path);
      const footer = within(screen.getByRole("contentinfo"));
      expect(footer.getByRole("link", { name: "Sitemap" })).toHaveAttribute("href", "/sitemap");
    }
  });
});

describe("search overlay", () => {
  function overlay() {
    return document.querySelector<HTMLDialogElement>("dialog.palette");
  }

  it("is closed on first render, so a prerendered page shows one h1", () => {
    renderAt("/");
    expect(overlay()).not.toBeNull();
    expect(overlay()?.open).toBe(false);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
  });

  it("keeps the header trigger a real link to /search", () => {
    renderAt("/emergency");
    const trigger = screen.getByRole("link", { name: "Search" });
    expect(trigger).toHaveAttribute("href", "/search");
    expect(trigger).toHaveAttribute("aria-keyshortcuts", "/");
  });

  it("opens from the header trigger on any page", async () => {
    const user = userEvent.setup();
    for (const path of ["/", "/government/officials", "/sitemap"]) {
      cleanup();
      closeSearchOverlay();
      renderAt(path);
      expect(overlay()?.open).toBe(false);
      await user.click(screen.getByRole("link", { name: "Search" }));
      expect(overlay()?.open).toBe(true);
    }
  });

  it("opens on / and on Ctrl+K, and returns focus to Search on close", async () => {
    const user = userEvent.setup();
    renderAt("/about");

    await user.keyboard("/");
    expect(overlay()?.open).toBe(true);

    overlay()?.close();
    expect(overlay()?.open).toBe(false);
    expect(screen.getByRole("link", { name: "Search" })).toHaveFocus();

    await user.keyboard("{Control>}k{/Control}");
    expect(overlay()?.open).toBe(true);
    overlay()?.close();
  });

  it("closes on Escape with a query typed, clears it, and restores focus to the trigger", async () => {
    const user = userEvent.setup();
    renderAt("/");
    const trigger = screen.getByRole("link", { name: "Search" });
    await user.click(trigger);
    expect(overlay()?.open).toBe(true);

    const input = screen.getByLabelText("Search barangays, officials, hotlines and pages");
    await user.type(input, "poblacion");
    expect(input).toHaveValue("poblacion");

    // A non-empty <input type="search"> tries to consume Escape to clear itself;
    // the capture-phase handler must still close the dialog, clear the query,
    // and return focus to the exact trigger that opened it.
    await user.keyboard("{Escape}");
    expect(overlay()?.open).toBe(false);
    await waitFor(() => expect(input).toHaveValue(""));
    expect(trigger).toHaveFocus();
  });

  it("leaves / alone while the visitor is typing", async () => {
    const user = userEvent.setup();
    renderAt("/government/barangays");

    const filter = screen.getByLabelText("Filter barangays by name or PSGC code");
    await user.type(filter, "pob/");

    expect(overlay()?.open).toBe(false);
    expect(filter).toHaveValue("pob/");
  });

  it("shows live results as real links and clears on close", async () => {
    const user = userEvent.setup();
    renderAt("/");
    await user.click(screen.getByRole("link", { name: "Search" }));

    const input = screen.getByLabelText("Search barangays, officials, hotlines and pages");
    await user.type(input, "poblacion");

    const result = screen.getByRole("link", { name: /Barangay Poblacion/ });
    expect(result).toHaveAttribute("href", "/government/barangays/poblacion");

    overlay()?.close();
    await waitFor(() => expect(input).toHaveValue(""));
  });

  it("finds a hotline by office, not only the page that lists it", async () => {
    const user = userEvent.setup();
    renderAt("/");
    await user.click(screen.getByRole("link", { name: "Search" }));
    await user.type(screen.getByLabelText("Search barangays, officials, hotlines and pages"), "mdrrmo");

    expect(screen.getByRole("link", { name: /MDRRMO/ })).toHaveAttribute("href", "/emergency");
  });

  it("offers a way out when nothing matches", async () => {
    const user = userEvent.setup();
    renderAt("/");
    await user.click(screen.getByRole("link", { name: "Search" }));
    await user.type(screen.getByLabelText("Search barangays, officials, hotlines and pages"), "zzzzz");

    expect(screen.getByText(/Nothing matches/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Browse every page" })).toHaveAttribute("href", "/sitemap");
  });
});
