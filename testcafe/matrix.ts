import { Selector, ClientFunction } from "testcafe";
import { url, initSurvey, frameworks, getData } from "./helper";
const assert = require("assert");

const title = "Widgets in matrix";

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
            "type": "matrixdynamic",
            "name": "matrix",
            "columns": [
                {
                    "name": "col1",
                    "cellType": "emotionsratings",
                    "choices": [1,2,3,4,5],
                    "isRequired": true
                }
            ],
            "rowCount": 1
        }
    ]
};

frameworks.forEach(async framework => {
    fixture`${framework} ${title}`.page`${url}${framework}`.clientScripts({ content: `(${explicitErrorHandler.toString()})()` }).beforeEach(async t => {
    });

    test("Show errors in matrix cell", async t => {
        await initSurvey(framework, json);
        await t
            .click(Selector("input[value='Complete']"))
            .expect(Selector("span").withText("Response required.").exists).ok()
    });
});