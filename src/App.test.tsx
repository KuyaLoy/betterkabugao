import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { App } from "./App";

afterEach(cleanup);

describe("BetterKabugao launch page", () => {
  it("presents the approved message and accessible landmarks", () => {
    render(<App />);

    expect(screen.getByRole("link", { name: /skip to main content/i })).toHaveAttribute("href", "#main-content");
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByText("Coming soon")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1, name: "Kabugao information, made clearer" })).toBeInTheDocument();
    expect(screen.getByRole("main")).toHaveAttribute("id", "main-content");
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });

  it("shows exactly three launch themes", () => {
    render(<App />);
    const region = screen.getByRole("region", { name: "What we’re building" });
    expect(within(region).getAllByRole("article")).toHaveLength(3);
    expect(within(region).getByRole("heading", { name: "Services and contacts" })).toBeInTheDocument();
    expect(within(region).getByRole("heading", { name: "Public information" })).toBeInTheDocument();
    expect(within(region).getByRole("heading", { name: "Culture and places" })).toBeInTheDocument();
  });

  it("links to the personal repository and states the independence disclaimer", () => {
    render(<App />);
    expect(screen.getAllByRole("link", { name: /view the project on github/i })[0]).toHaveAttribute(
      "href",
      "https://github.com/KuyaLoy/betterkabugao",
    );
    expect(screen.getByText(/not the official website of the Municipality of Kabugao/i)).toBeInTheDocument();
  });
});
