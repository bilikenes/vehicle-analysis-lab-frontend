import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { clampReveal, ModelVisionComparison } from "./model-vision-comparison";

afterEach(cleanup);

describe("clampReveal", () => {
  it("keeps the comparison divider inside the visible interaction area", () => {
    expect(clampReveal(-10)).toBe(8);
    expect(clampReveal(48)).toBe(48);
    expect(clampReveal(120)).toBe(92);
  });
});

describe("ModelVisionComparison", () => {
  it("updates the model view with the range control", () => {
    render(<ModelVisionComparison />);

    const slider = screen.getByRole("slider", { name: "Reveal model view" });
    fireEvent.change(slider, { target: { value: "68" } });

    expect(slider).toHaveValue("68");
    expect(screen.getByTestId("model-view-layer")).toHaveStyle({
      clipPath: "inset(0 32% 0 0)",
    });
    expect(screen.queryByText("Vehicle crop")).not.toBeInTheDocument();
    expect(screen.queryByText("Plate crop")).not.toBeInTheDocument();
    expect(screen.queryByText("OCR resolved")).not.toBeInTheDocument();
  });

  it("supports precise keyboard adjustment", () => {
    render(<ModelVisionComparison />);

    const slider = screen.getByRole("slider", { name: "Reveal model view" });
    fireEvent.keyDown(slider, { key: "ArrowRight" });

    expect(slider).toHaveValue("55");
  });
});
