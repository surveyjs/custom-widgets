import { Selector, ClientFunction } from "testcafe";
import { url, frameworks, initCreator } from "./helper";
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
    "pages": [
     {
      "name": "page1",
      "elements": [
       {
        "type": "nouislider",
        "name": "range",
        "title": "Please range",
        "step": 0.5,
        "defaultValue": 3,
        "rangeMin": 1,
        "rangeMax": 5        
       }
      ]
     }
    ]
   };

frameworks.forEach(async framework => {
    fixture`${framework} ${title}`.page`${url}${framework}`.clientScripts({ content: `(${explicitErrorHandler.toString()})()` }).beforeEach(async t => {
    });

    async function checkCurrentSliderState(t: any, minToBe: string, maxToBe: string, startToBe: string) {
        await t
            .expect(Selector(".sv_qstn").exists).ok()
            .expect(Selector(".noUi-value").filterVisible().nth(0).withText(minToBe).exists).ok()
            .expect(Selector(".noUi-value").filterVisible().nth(-1).withText(maxToBe).exists).ok()
            .expect(Selector(".noUi-tooltip").withText(startToBe).exists).ok()
    }

    test("Check noUISlider in creator", async t => {
        if (framework === "knockout") {
            await initCreator(json);
            await t
                .expect(Selector(".sv_qstn").exists).ok()
            await checkCurrentSliderState(t, "1", "5", "3.00");

        }
    });

});