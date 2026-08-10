import { Selector, ClientFunction } from "testcafe";
import { url, initSurvey, frameworks, getData } from "./helper";
const assert = require("assert");

const title = "Tagbox widget";

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
            type: 'tagbox',
            name: 'question1',
            choices: [
                { value: 1, text: 'Item 1' },
                { value: 2, text: 'Item 2' },
                { value: 3, text: 'Item 3' },
                { value: 4, text: 'Item 4' },
                { value: 5, text: 'Item 5' },
            ]
        }
    ]
};

frameworks.forEach(async framework => {
    fixture`${framework} ${title}`.page`${url}${framework}`.clientScripts({ content: `(${explicitErrorHandler.toString()})()` }).beforeEach(async t => {
    });

    test("Check all widgets are visible", async t => {
        await initSurvey(framework, json);
        //await t.debug()
        await t
            .expect(Selector('h5').find('span').withExactText('question1').exists).ok()
            .click(Selector(".select2-container"))
            .typeText(".select2-container", "Item 1")
            .pressKey("enter")
            .typeText(".select2-container", "Item 3")
            .pressKey("enter")
            .click(Selector(".select2-selection__choice__remove").nth(0));
        let data = await getData();
        assert.deepEqual(data["question1"], [3]);
    });
});