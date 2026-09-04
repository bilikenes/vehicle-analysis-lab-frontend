import { expect, test } from "@playwright/test";

test("reveals a fixture result and exposes inspection actions", async ({ page }) => {
  await page.goto("/analysis/demo");

  await expect(page.getByRole("img", { name: /black sedan/i })).toBeVisible();
  await expect(page.getByRole("status")).toContainText("Analysis complete", {
    timeout: 7_000,
  });
  await expect(page.getByText("34 ABC 128", { exact: true })).toBeVisible();
  await expect(page.getByText("Sedan", { exact: true })).toBeVisible();
  await expect(page.getByTestId("vehicle-bbox")).toHaveCSS("opacity", "0");
  await expect(page.getByTestId("plate-bbox")).toHaveCSS("opacity", "0");
  await expect(page.getByRole("region", { name: /vehicle crop; trace/i })).toBeVisible();
  await expect(page.getByRole("region", { name: /ocr result: 34 abc 128/i })).toBeVisible();

  await page.getByRole("region", { name: /plate crop; trace/i }).focus();
  await expect(page.getByRole("region", { name: /plate crop; trace/i })).toBeFocused();
  await expect(page.getByTestId("plate-bbox")).toHaveCSS("opacity", "1");

  await page.getByRole("button", { name: "Download", exact: true }).click();
  await expect(page.getByRole("menu", { name: "Download results" })).toBeVisible();
  await expect(page.getByRole("menuitem", { name: "Fixture result JSON" })).toBeVisible();

  await page.getByRole("button", { name: "New Analysis", exact: true }).click();
  await expect(page.getByRole("heading", { name: /drop another vehicle image/i })).toBeVisible();
  await page.getByRole("button", { name: "Cancel new analysis" }).click();
  await expect(page.getByRole("heading", { name: /drop another vehicle image/i })).toBeHidden();
  await expect(page.getByRole("link", { name: "Edit Results" })).toHaveAttribute(
    "href",
    "/edit/demo",
  );
});

test("matches the canonical 1672 by 941 editorial artboard anchors", async ({ page }) => {
  await page.setViewportSize({ height: 941, width: 1672 });
  await page.goto("/analysis/demo");
  await expect(page.getByRole("status")).toContainText("Analysis complete", {
    timeout: 7_000,
  });

  await expect(page.getByTestId("editorial-side-rail")).toBeVisible();

  const source = await page.getByRole("region", { name: "Original image with detected regions", exact: true }).boundingBox();
  const vehicle = await page.getByRole("region", { name: /vehicle crop; trace/i }).boundingBox();
  const plate = await page.getByRole("region", { name: /plate crop; trace/i }).boundingBox();
  const ocr = await page.getByRole("region", { name: /ocr result: 34 abc 128/i }).boundingBox();

  expect(source).toMatchObject({ x: 184, y: 255, width: 853 });
  expect(vehicle).toMatchObject({ x: 1112, y: 124, width: 420 });
  expect(plate).toMatchObject({ x: 1123, y: 371, width: 357 });
  expect(ocr).toMatchObject({ x: 1036, y: 656, width: 360 });
});

test("keeps completed results available when fixture quota is exhausted", async ({ page }) => {
  await page.goto("/analysis/demo-quota-exhausted");

  await expect(page.getByRole("status")).toContainText("Analysis complete", {
    timeout: 7_000,
  });
  await expect(page.getByRole("button", { name: "New Analysis", exact: true })).toBeDisabled();
  await expect(page.getByRole("button", { name: "Download", exact: true })).toBeEnabled();
  await expect(page.getByText(/used all 5 analyses/i)).toBeVisible();
});

test("preserves the image in failure state and avoids horizontal mobile overflow", async ({ page }) => {
  await page.setViewportSize({ height: 844, width: 390 });
  await page.goto("/analysis/demo-failure");

  await expect(page.getByText("Analysis failed", { exact: true })).toBeVisible();
  await expect(page.getByRole("img", { name: /black sedan/i })).toBeVisible();
  await expect(page.getByRole("button", { name: "Download", exact: true })).toBeDisabled();
  await expect(page.getByRole("button", { name: "Retry analysis" })).toBeVisible();

  const hasHorizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );
  expect(hasHorizontalOverflow).toBe(false);
});
