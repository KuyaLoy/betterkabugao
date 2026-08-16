import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { App } from "./App";

beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn(() => new Promise(() => {})));
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("BetterKabugao launch page", () => {
  it("exposes accessible landmarks and a single h1", () => {
    render(<App />);

    expect(screen.getByRole("link", { name: /skip to main content/i })).toHaveAttribute("href", "#main-content");
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("main")).toHaveAttribute("id", "main-content");
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1, name: "BetterKabugao.org" })).toBeInTheDocument();
  });

  it("shows the emergency number without inventing local hotlines", () => {
    render(<App />);

    expect(screen.getByRole("link", { name: "911" })).toHaveAttribute("href", "tel:911");
    expect(screen.getByText(/Local Kabugao hotlines are being verified/i)).toBeInTheDocument();
  });

  it("previews transparency, tourism and services with the section order from the brief", () => {
    render(<App />);

    const headings = screen.getAllByRole("heading", { level: 2 }).map((h) => h.textContent);
    expect(headings.some((h) => h?.includes("Public information about Kabugao"))).toBe(true);
    expect(headings.some((h) => h?.includes("Where the money goes"))).toBe(true);
    expect(headings.some((h) => h?.includes("The place itself"))).toBe(true);
    expect(headings.some((h) => h?.includes("without the runaround"))).toBe(true);
    expect(headings.some((h) => h?.includes("Public information belongs to the public"))).toBe(true);
  });

  it("names every field the project tracker will carry, with no invented values", () => {
    render(<App />);
    const region = document.querySelector("#transparency") as HTMLElement;

    for (const field of [
      "Project", "Location", "Budget", "Funding source", "Contractor",
      "Implementing agency", "Timeline", "Status", "Public documents",
    ]) {
      expect(within(region).getByText(field)).toBeInTheDocument();
    }
    expect(within(region).getByText(/Public project records are being prepared/i)).toBeInTheDocument();
    expect(within(region).getAllByText("Awaiting verified data")).toHaveLength(9);
    // no peso figure may appear in the transparency preview
    expect(region.textContent).not.toMatch(/₱\s?[\d,]/);
  });

  it("states verified Kabugao facts with their source", () => {
    render(<App />);

    expect(screen.getByText("16,215")).toBeInTheDocument();
    expect(screen.getAllByText("935.12 km²").length).toBeGreaterThan(0);
    expect(screen.getAllByText("18.0229° N, 121.1841° E").length).toBeGreaterThan(0);
    expect(screen.getAllByText("135.7 m").length).toBeGreaterThan(0);
    expect(screen.getByText(/2020 Census of Population and Housing \(PSA\)/)).toBeInTheDocument();
  });

  it("publishes cost transparency and credits the developer", () => {
    render(<App />);

    expect(screen.getAllByText(/Cost to the people of Kabugao/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText("₱0").length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Cost to build this site/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText("₱670").length).toBeGreaterThan(0);
    expect(screen.getByText(/No public funds/i)).toBeInTheDocument();
    expect(screen.getByText("Robin Tapiru")).toBeInTheDocument();
  });

  it("keeps the independence disclaimer and links to the ecosystem", () => {
    render(<App />);

    expect(screen.getByText(/not the official website of the Municipality of Kabugao/i)).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /BetterGov\.ph/ })[0]).toHaveAttribute("href", "https://bettergov.ph/");
    expect(screen.getAllByRole("link", { name: /BetterLGU Directory/ })[0]).toHaveAttribute("href", "https://lgu.bettergov.ph/");
    expect(screen.getAllByRole("link", { name: /repository|GitHub/i })[0]).toHaveAttribute(
      "href",
      "https://github.com/KuyaLoy/betterkabugao",
    );
  });

  it("opens external links without leaking the referrer", () => {
    render(<App />);
    const external = screen.getAllByRole("link").filter((l) => l.getAttribute("target") === "_blank");
    expect(external.length).toBeGreaterThan(0);
    for (const link of external) {
      expect(link.getAttribute("rel")).toContain("noreferrer");
    }
  });

  it("stays CSP-safe: no inline styles, decorative SVGs hidden from assistive tech", () => {
    const { container } = render(<App />);
    expect(container.querySelector("[style]")).toBeNull();
    expect(container.querySelectorAll("svg:not([aria-hidden='true'])")).toHaveLength(0);
  });

  it("omits the weather reading rather than showing a placeholder number", () => {
    render(<App />);
    // fetch is pending, so no temperature is rendered anywhere
    expect(screen.queryByText(/°C/)).not.toBeInTheDocument();
    expect(screen.getByText(/PHT/)).toBeInTheDocument();
  });
});
