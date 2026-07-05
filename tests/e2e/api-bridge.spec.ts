import { expect, test } from "@playwright/test";

test("optional API bridge hydrates the legacy runtime without changing the shell", async ({ page }) => {
  const apiBridgeMode = process.env.E2E_API_BRIDGE || (process.env.E2E_BASE_URL ? "optional" : "required");

  await page.goto("app/index.html?api=1");

  if (apiBridgeMode === "required") {
    await expect
      .poll(() =>
        page.evaluate(() => (window as unknown as { WEST_LAKE_CONTENT_SOURCE?: string }).WEST_LAKE_CONTENT_SOURCE)
      )
      .toBe("api");
  } else {
    await expect
      .poll(() =>
        page.evaluate(() => (window as unknown as { WEST_LAKE_CONTENT_SOURCE?: string }).WEST_LAKE_CONTENT_SOURCE)
      )
      .toMatch(/^(api|static-fallback)$/);
  }

  const firstSegmentSrc = await page.evaluate(
    () =>
      (window as unknown as { WEST_LAKE_CONTENT: { scrollSegments: Array<{ src: string }> } }).WEST_LAKE_CONTENT
        .scrollSegments[0].src
  );

  expect(firstSegmentSrc).toMatch(/^\.\/assets\/scroll\//);
  await expect(page.locator(".landing-entry")).toHaveCount(4);
  await expect(page.locator("body")).toHaveAttribute("data-view", "landing");

  await page.locator(".landing-entry-scroll").click();
  await expect(page).toHaveURL(/#scroll$/);
  await expect(page.locator(".scroll-bridge-marker[data-node='dashifo-yuan']")).toBeVisible();
});
