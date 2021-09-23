import { Selector, ClientFunction } from "testcafe";
import { url, initSurvey, frameworks } from "./helper";

const title = "All widgets";

const explicitErrorHandler = () => {
    window.addEventListener("error", e => {
        if (e.message === "ResizeObserver loop completed with undelivered notifications." ||
            e.message === "ResizeObserver loop limit exceeded") {
            e.stopImmediatePropagation();
        }
    });
};

var json = {
    questions: [
        {
            type: "dropdown",
            renderAs: "select2",
            choicesByUrl: { url: "https://restcountries.eu/rest/v1/all" },
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

frameworks.forEach(async framework => {
    fixture`${framework} ${title}`.page`${url}${framework}`.clientScripts({ content: `(${explicitErrorHandler.toString()})()` }).beforeEach(async t => {
    });

    test("Check all widgets are visible", async t => {
        await initSurvey(framework, json);
        // await t
        //     .debug()
        await t
            .expect(Selector("h5[aria-label='countries']").exists).ok()
            .expect(Selector("h5[aria-label='countries']").visible).ok()
            .expect(Selector("h5[aria-label='date']").exists).ok()
            .expect(Selector("h5[aria-label='date']").visible).ok()
            .expect(Selector("h5[aria-label='autocomplete']").exists).ok()
            .expect(Selector("h5[aria-label='autocomplete']").visible).ok()
    });

});