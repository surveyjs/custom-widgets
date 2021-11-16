import { ClientFunction, Selector } from "testcafe";
export const frameworks = ["knockout", "react", "vue"];
export const url = "http://127.0.0.1:8080/examples/";
export const FLOAT_PRECISION = 0.01;

export const initSurvey = ClientFunction(
  (framework, json, events, isDesignMode, props) => {
    console.error = msg => {
      throw new Error(msg);
    };
    console.warn = msg => {
      throw new Error(msg);
    };
    console.log("surveyjs console.error and console.warn override");

    const model = new Survey.Model(json);
    model.setDesignMode(isDesignMode);
    const surveyComplete = function (model) {
      window.SurveyResult = model.data;
      document.getElementById("surveyResultElement").innerHTML = JSON.stringify(
        model.data
      );
    };
    if (!!events) {
      for (var str in events) {
        model[str].add(events[str]);
      }
    }
    if (!!props) {
      for (var key in props) {
        model[key] = props[key];
      }
    }
    model.onComplete.add(surveyComplete);

    if (framework === "knockout") {
      document.getElementById("surveyElement").innerHTML = "";
      model.render("surveyElement");
    } else if (framework === "react") {
      document.getElementById("surveyElement").innerHTML = "";
      ReactDOM.render(
        React.createElement(Survey.Survey, {
          model: model,
          onComplete: surveyComplete,
        }),
        document.getElementById("surveyElement")
      );
    } else if (framework === "vue") {
      document.getElementById("surveyElement").innerHTML =
        "<survey :survey='survey'/>";
      !!window.vueApp && vueApp.$destroy();
      window.vueApp = new Vue({
        el: "#surveyElement",
        data: { survey: model },
      });
    }
    window.survey = model;
  }
);

export const initCreator = ClientFunction((json, creatorOptions) => {
  console.error = (msg) => {
    throw new Error(msg);
  };
  console.warn = (msg) => {
    throw new Error(msg);
  };
  console.log("surveyjs console.error and console.warn override");

  const body = document.querySelector("body");
  body.innerHTML = '<div id="surveyContainer"><div id="creatorElement"></div></div>'

  Survey.Survey.cssType = "bootstrap";
  Survey.defaultBootstrapCss.navigationButton = "btn btn-green";
  if (!creatorOptions) creatorOptions = null;
  const creator = new SurveyCreator.SurveyCreator(
    "creatorElement",
    creatorOptions
  );
  creator.saveSurveyFunc = function (saveNo, callback) {
    alert("ok");
    callback(saveNo, true);
  };
  creator.JSON = json;
  creator.showOptions = true;
  creator.showState = true;

  window.creator = creator;
});

export const getData = ClientFunction(() => {
  return survey.data;
});

