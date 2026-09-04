import { describe, expect, it } from "vitest";

import {
  boundingBoxPercentStyle,
  containedImageRect,
  cropBackgroundStyle,
  projectBoundingBox,
} from "./project-bounding-box";

describe("containedImageRect", () => {
  it("accounts for horizontal letterboxing", () => {
    expect(
      containedImageRect({
        containerHeight: 600,
        containerWidth: 1200,
        naturalHeight: 900,
        naturalWidth: 1200,
      }),
    ).toEqual({ height: 600, left: 200, top: 0, width: 800 });
  });

  it("accounts for vertical letterboxing", () => {
    expect(
      containedImageRect({
        containerHeight: 800,
        containerWidth: 800,
        naturalHeight: 900,
        naturalWidth: 1600,
      }),
    ).toEqual({ height: 450, left: 0, top: 175, width: 800 });
  });
});

describe("projectBoundingBox", () => {
  it("projects normalized coordinates into the displayed image rectangle", () => {
    expect(
      projectBoundingBox(
        { height: 0.2, width: 0.5, x: 0.25, y: 0.4 },
        { height: 400, left: 100, top: 50, width: 800 },
      ),
    ).toEqual({ height: 80, left: 300, top: 210, width: 400 });
  });
});

describe("boundingBoxPercentStyle", () => {
  it("creates percentage positioning for an image-matched stage", () => {
    expect(
      boundingBoxPercentStyle({ height: 0.1, width: 0.2, x: 0.3, y: 0.4 }),
    ).toEqual({ height: "10%", left: "30%", top: "40%", width: "20%" });
  });
});

describe("cropBackgroundStyle", () => {
  it("uses natural image dimensions for the crop aspect ratio", () => {
    expect(
      cropBackgroundStyle(
        "/vehicle.png",
        { height: 0.25, width: 0.5, x: 0.1, y: 0.2 },
        { height: 900, width: 1600 },
      ).aspectRatio,
    ).toBe("800 / 225");
  });
});
