import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { HumanInLoopDemo, transformPlateBox } from "./human-in-loop-demo";

afterEach(cleanup);

describe("transformPlateBox", () => {
  const box = { x: 20, y: 40, width: 10, height: 8 };

  it("moves a box while keeping it inside the image", () => {
    expect(transformPlateBox(box, "move", 90, -90)).toEqual({
      x: 90,
      y: 0,
      width: 10,
      height: 8,
    });
  });

  it("resizes from the bottom-right corner", () => {
    expect(transformPlateBox(box, "se", 3, 2)).toEqual({
      x: 20,
      y: 40,
      width: 13,
      height: 10,
    });
  });
});

describe("HumanInLoopDemo", () => {
  it("accepts a plate-box and OCR correction as feedback", () => {
    render(<HumanInLoopDemo />);

    fireEvent.keyDown(
      screen.getByRole("group", { name: /plate bounding box/i }),
      { key: "ArrowRight" },
    );
    fireEvent.change(screen.getByLabelText("OCR result"), {
      target: { value: "CV 2048" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save correction" }));

    expect(screen.getByText("Feedback added")).toBeInTheDocument();
  });

  it("restores the intentionally imperfect model result", () => {
    render(<HumanInLoopDemo />);

    fireEvent.change(screen.getByLabelText("OCR result"), {
      target: { value: "CV 2048" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Reset" }));

    expect(screen.getByLabelText("OCR result")).toHaveValue("CV 204B");
  });
});
