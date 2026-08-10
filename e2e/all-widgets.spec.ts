import { test, expect, initSurvey, frameworks, getExampleUrl } from "./helper";

const title = "All widgets";

const json = {
  questions: [
    {
      type: "dropdown",
      renderAs: "select2",
      choicesByUrl: { url: "https://surveyjs.io/api/CountriesExample" },
      name: "countries",
    },
    {
      name: "date",
      type: "datepicker",
      inputType: "date",
      dateFormat: "mm/dd/yy",
      isRequired: true
    },
    {
      name: "autocomplete",
      type: "text",
      choices: [
        "fontawesome-stars",
        "css-stars",
        "bars-pill",
        "bars-1to10",
        "bars-movie",
        "bars-square",
        "bars-reversed",
        "bars-horizontal",
        "bootstrap-stars",
        "fontawesome-stars-o"
      ]
    }
  ]
};

frameworks.forEach((framework) => {
  test.describe(`${framework} ${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(getExampleUrl(framework));
    });

    test("Check all widgets are visible", async ({ page }) => {
      await initSurvey(page, framework, json);

      await expect(page.locator("h5 span").filter({ hasText: /^countries$/ })).toBeVisible();
      await expect(page.locator("h5 span").filter({ hasText: /^date$/ })).toBeVisible();
      await expect(page.locator("h5 span").filter({ hasText: /^autocomplete$/ })).toBeVisible();
    });
  });
});
