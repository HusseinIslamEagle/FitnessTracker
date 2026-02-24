import { test, expect } from "@playwright/test";

test("home loads", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/fitness|tracker|vite|react/i);
});

test("workouts route is reachable (redirect allowed)", async ({ page }) => {
  await page.goto("/workouts", { waitUntil: "domcontentloaded" });

  // استنى شوية لو في redirect/loader
  await page.waitForTimeout(500);

  const url = page.url();
  const bodyText = await page.locator("body").innerText();

  // ✅ نسمح بريدايركت لأي صفحة من دول (عدّل/زود لو عندك routes مختلفة)
  const allowed = ["/workouts", "/login", "/signin", "/auth", "/"];
  expect(allowed.some((p) => url.includes(p))).toBeTruthy();

  // ✅ أهم حاجة: مش صفحة Not Found
  expect(bodyText).not.toMatch(/not found|cannot get|404/i);
});