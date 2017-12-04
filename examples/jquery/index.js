function init() {
  //$.material.init();

  var json = {
    questions: [
      {
        type: "dropdown",
        renderAs: "select2",
        choicesByUrl: { url: "https://restcountries.eu/rest/v1/all" },
        name: "countries",
        title: "Please select the country you have arrived from:"
      },
      {
        name: "date",
        type: "datepicker",
        inputType: "date",
        title: "Your favorite date:",
        dateFormat: "mm/dd/yy",
        isRequired: true
      },
      {
        name: "autocomplete1",
        title: "Easy-autocomplete:",
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

  Survey.defaultBootstrapCss.navigationButton = "btn btn-primary";
  //Survey.Survey.cssType = "bootstrapmaterial";
  Survey.Survey.cssType = "bootstrap";

  var model = new Survey.Model(json);
  window.survey = model;

  $("#surveyElement").Survey({
    model: survey
  });
}

if (!window["%hammerhead%"]) {
  init();
}
