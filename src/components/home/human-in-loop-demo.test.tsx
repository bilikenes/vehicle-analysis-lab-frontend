import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import {
  HumanInLoopDemo,
  normalizeTurkishPlateInput,
  transformPlateBox,
} from "./human-in-loop-demo";

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

describe("normalizeTurkishPlateInput", () => {
  it("formats supported Turkish plate segments and removes invalid characters", () => {
    expect(normalizeTurkishPlateInput("34aBc-128!")).toBe("34 ABC 128");
  });
});

describe("HumanInLoopDemo", () => {
  it("accepts a plate-box and OCR correction as feedback", () => {
    render(<HumanInLoopDemo />);

    fireEvent.keyDown(
      screen.getByRole("group", { name: /plate bounding box/i }),
      { key: "ArrowRight" },
    );
    fireEvent.change(screen.getByLabelText("Your correction"), {
      target: { value: "34abc128" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Add correction" }));

    expect(screen.getByText("Feedback added")).toBeInTheDocument();
  });

  it("restores the intentionally imperfect model result", () => {
    render(<HumanInLoopDemo />);

    fireEvent.change(screen.getByLabelText("Your correction"), {
      target: { value: "34 ABC 128" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Reset correction demo" }));

    expect(screen.getByLabelText("Your correction")).toHaveValue("34 ABC 12B");
  });
});
