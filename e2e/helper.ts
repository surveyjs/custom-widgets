import type { Page } from "@playwright/test";
import { expect, test as baseTest } from "@playwright/test";

export const frameworks = ["react", "vue"];
export const url = "http://127.0.0.1:8080/examples/";
export const FLOAT_PRECISION = 0.01;

/**
 * The example pages render a demo survey on load. Tests render their own survey via
 * `initSurvey`, so they open the page with the `noinit` flag to suppress the demo one.
 */
export function getExampleUrl(framework: string): string {
  return `${url}${framework}/?noinit=true`;
}

/**
 * Suppresses the harmless ResizeObserver notifications that some widgets produce,
 * so that they are not reported as page errors.
 */
export const explicitErrorHandler = (): void => {
  window.addEventListener("error", (e) => {
    if (e.message === "ResizeObserver loop completed with undelivered notifications." ||
      e.message === "ResizeObserver loop limit exceeded") {
      e.stopImmediatePropagation();
    }
  });
};

export const initSurvey = async (page: Page, framework: string, json: any, isDesignMode?: boolean, props?: any): Promise<void> => {
  await page.evaluate(([framework, json, isDesignMode, props]) => {
    const win = window as any;
    console.error = (msg) => {
      throw new Error(msg);
    };
    console.warn = (msg) => {
      throw new Error(msg);
    };
    console.log("surveyjs console.error and console.warn override");

    const model = new win.Survey.Model(json);
    model.setDesignMode(!!isDesignMode);
    const surveyComplete = function (model) {
      win.SurveyResult = model.data;
      const resultElement = document.getElementById("surveyResult");
      if (!!resultElement) {
        resultElement.innerHTML = JSON.stringify(model.data);
      }
    };
    if (!!props) {
      for (const key in props) {
        model[key] = props[key];
      }
    }
    model.onComplete.add(surveyComplete);

    if (framework === "knockout") {
      document.getElementById("surveyElement").innerHTML = "";
      model.render("surveyElement");
    } else if (framework === "react") {
      document.getElementById("surveyElement").innerHTML = "";
      win.ReactDOM.render(
        win.React.createElement(win.Survey.Survey, {
          model: model,
          onComplete: surveyComplete,
        }),
        document.getElementById("surveyElement")
      );
    } else if (framework === "vue") {
      document.getElementById("surveyElement").innerHTML = "<survey :survey='survey'/>";
      !!win.vueApp && win.vueApp.$destroy();
      win.vueApp = new win.Vue({
        el: "#surveyElement",
        data: { survey: model },
      });
    }
    win.survey = model;
  }, [framework, json, isDesignMode, props] as const);
};

export const initCreator = async (page: Page, json: any, creatorOptions?: any): Promise<void> => {
  await page.evaluate(([json, creatorOptions]) => {
    const win = window as any;
    console.error = (msg) => {
      throw new Error(msg);
    };
    console.warn = (msg) => {
      throw new Error(msg);
    };
    console.log("surveyjs console.error and console.warn override");

    const body = document.querySelector("body");
    body.innerHTML = "<div id=\"surveyContainer\"><div id=\"creatorElement\"></div></div>";

    const creator = new win.SurveyCreator.SurveyCreator("creatorElement", creatorOptions || {});
    creator.saveSurveyFunc = function (saveNo, callback) {
      callback(saveNo, true);
    };
    creator.JSON = json;
    creator.showOptions = true;
    creator.showState = true;

    win.creator = creator;
  }, [json, creatorOptions] as const);
};

export const getData = async (page: Page): Promise<any> => {
  return await page.evaluate(() => (window as any).survey.data);
};

/**
 * The `page` fixture is extended to fail a test when the page produces an uncaught JS error.
 * Set the `skipJSErrors` option to opt out of that check.
 */
export const test = baseTest.extend<{ page: void, skipJSErrors: boolean }>({
  skipJSErrors: [false, { option: false }],
  page: async ({ page, skipJSErrors }, use) => {
    const errors: Array<Error> = [];
    page.addListener("pageerror", (error) => {
      errors.push(error);
    });
    await page.addInitScript(explicitErrorHandler);
    await use(page);
    if (!skipJSErrors) {
      expect(errors).toHaveLength(0);
    }
  }
});

export { expect };
