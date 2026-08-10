import { test, expect, initSurvey, frameworks, getData, getExampleUrl } from "./helper";

const title = "Tagbox widget";

const json = {
  questions: [
    {
      type: "tagbox",
      name: "question1",
      choices: [
        { value: 1, text: "Item 1" },
        { value: 2, text: "Item 2" },
        { value: 3, text: "Item 3" },
        { value: 4, text: "Item 4" },
        { value: 5, text: "Item 5" },
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

      await expect(page.locator("h5 span").filter({ hasText: /^question1$/ })).toBeVisible();

      const container = page.locator(".select2-container");
      const searchField = container.locator("input.select2-search__field");

      const selectItem = async (text: string) => {
        await container.click();
        await searchField.pressSequentially(text);
        await expect(page.locator(".select2-results__option--highlighted").filter({ hasText: text })).toBeVisible();
        await searchField.press("Enter");
      };

      await selectItem("Item 1");
      await selectItem("Item 3");

      const choices = container.locator(".select2-selection__choice");
      await expect(choices).toHaveCount(2);

      await container.locator(".select2-selection__choice__remove").nth(0).click();
      await expect(choices).toHaveCount(1);

      expect((await getData(page))["question1"]).toEqual([3]);
    });
  });
});
