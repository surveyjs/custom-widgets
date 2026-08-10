import { test, expect, initCreator, getExampleUrl } from "./helper";
import type { Page } from "@playwright/test";

const title = "noUiSlider widget";

// The nouislider widget and the Survey Creator are only set up on the knockout example page.
const framework = "knockout";

const json = {
  pages: [
    {
      name: "page1",
      elements: [
        {
          type: "nouislider",
          name: "range",
          title: "Please range",
          step: 0.5,
          defaultValue: 3,
          rangeMin: 1,
          rangeMax: 5
        }
      ]
    }
  ]
};

async function checkCurrentSliderState(page: Page, minToBe: string, maxToBe: string, startToBe: string) {
  await expect(page.locator(".sv_qstn")).toBeVisible();
  const values = page.locator(".noUi-value").filter({ visible: true });
  await expect(values.first()).toHaveText(minToBe);
  await expect(values.last()).toHaveText(maxToBe);
  await expect(page.locator(".noUi-tooltip").filter({ hasText: startToBe })).toBeVisible();
}

test.describe(`${framework} ${title}`, () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(getExampleUrl(framework));
  });

  test("Check noUISlider in creator", async ({ page }) => {
    await initCreator(page, json);
    await expect(page.locator(".sv_qstn")).toBeVisible();
    await checkCurrentSliderState(page, "1", "5", "3.00");
  });
});
