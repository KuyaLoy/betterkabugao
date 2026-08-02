import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BrandArtwork } from "./BrandArtwork";

describe("BrandArtwork", () => {
  it("sets bounded parallax variables and resets them", () => {
    render(<BrandArtwork />);
    const stage = screen.getByTestId("brand-stage");
    stage.getBoundingClientRect = () => ({
      left: 0,
      top: 0,
      width: 200,
      height: 100,
      right: 200,
      bottom: 100,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    });

    fireEvent.pointerMove(stage, { clientX: 200, clientY: 50 });
    expect(stage.style.getPropertyValue("--parallax-x")).toBe("10px");
    expect(stage.style.getPropertyValue("--parallax-y")).toBe("0px");

    fireEvent.pointerLeave(stage);
    expect(stage.style.getPropertyValue("--parallax-x")).toBe("0px");
    expect(stage.style.getPropertyValue("--parallax-y")).toBe("0px");
  });
});
