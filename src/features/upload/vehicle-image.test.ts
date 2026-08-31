import { describe, expect, it } from "vitest";

import { isSupportedVehicleImage } from "./vehicle-image";

describe("isSupportedVehicleImage", () => {
  it.each(["image/jpeg", "image/png", "image/webp"])("accepts %s", (type) => {
    expect(isSupportedVehicleImage({ type })).toBe(true);
  });

  it.each(["image/gif", "image/svg+xml", "application/pdf", ""])(
    "rejects %s",
    (type) => {
      expect(isSupportedVehicleImage({ type })).toBe(false);
    },
  );
});
