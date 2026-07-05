import { expect, test } from "@playwright/test";

test("legacy demo is served unchanged through the engineered web app", async ({ page }) => {
  await page.goto("app/index.html");

  await expect(page.locator(".site-credit")).toHaveText("由木渡川与codex共同制作 · 2026");
  await expect(page.locator(".site-credit")).toBeVisible();
  await expect(page.locator(".landing-entry")).toHaveCount(4);
  await expect(page.locator(".landing-map-bg")).toBeVisible();

  await page.locator(".landing-entry-map").click();
  await expect(page).toHaveURL(/#map$/);
  await expect(page.locator("body")).toHaveAttribute("data-view", "map");
  await expect(page.locator(".site-credit")).toBeHidden();
  await expect(page.locator(".map-overview-image")).toBeVisible();
  await expect(page.locator(".map-overview-image")).toHaveAttribute(
    "src",
    /assets\/(?:optimized\/map\/map-overview-bg|map-overview-bg-[\w-]+)\.webp$/
  );
  await expect(page.locator(".map-volume-hit.hit-stone")).toBeAttached();

  await page.locator(".map-volume-hit.hit-stone").click();
  await expect(page).toHaveURL(/#scroll\?target=dashifo-yuan$/);
  await expect(page.locator("body")).toHaveAttribute("data-view", "scroll");
  await expect(page.locator(".scroll-stage")).toBeVisible();
  await expect(page.locator(".scroll-panorama-image").first()).toHaveAttribute(
    "src",
    /assets\/optimized\/scroll\/north-bank\/.+\.webp$/
  );

  const marker = page.locator(".scroll-bridge-marker[data-node='dashifo-yuan']");
  await expect(marker).toBeVisible();
  await marker.click();

  const overlay = page.locator("#node-overlay");
  await expect(overlay).not.toHaveAttribute("hidden", "");
  await expect(page.locator("#node-overlay .node-panel[role='dialog']")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(overlay).toHaveAttribute("hidden", "");

  await page.locator(".main-nav [data-nav='inquiry']").click();
  await expect(page).toHaveURL(/#inquiry$/);
  await expect(page.locator("body")).toHaveAttribute("data-view", "inquiry");

  const microKnowledgeSection = page.locator("[data-cold-section='juanzhong-weishi']");
  await expect(microKnowledgeSection.locator(".cold-card-image")).toHaveCount(4);
  await expect(microKnowledgeSection.locator(".cold-card-placeholder")).toHaveCount(0);
  await expect(microKnowledgeSection.locator(".cold-section-head p")).toContainText("断桥桥构");
  await expect(microKnowledgeSection.locator(".cold-action-link")).toHaveText("打包下载");
  await expect(microKnowledgeSection.locator(".cold-more-button")).toHaveCount(0);
  await expect(microKnowledgeSection.locator(".cold-action-note")).toHaveCount(0);

  const firstColdCard = page.locator(".cold-card-image").first();
  await expect(firstColdCard).toBeVisible();
  await expect(firstColdCard.locator("img")).toHaveAttribute(
    "src",
    /assets\/optimized\/cold-knowledge\/.+\.webp$/
  );
  await firstColdCard.click();

  const preview = page.locator("#cold-card-preview");
  await expect(preview).toHaveClass(/is-open/);
  await expect(page.locator(".cold-card-preview-stage img")).toHaveAttribute(
    "src",
    /assets\/optimized\/cold-knowledge\/.+\.webp$/
  );
  await expect(page.locator(".cold-card-preview-count")).toHaveText(/1 \/ \d+/);

  await page.locator(".cold-card-preview-next").click();
  await expect(page.locator(".cold-card-preview-count")).toHaveText(/2 \/ \d+/);
});
