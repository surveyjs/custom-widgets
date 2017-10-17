function init() {
    // $.material.init();

    var json = { questions: [
        { type: "dropdown", renderAs: "select2", choicesByUrl: { url: "https://restcountries.eu/rest/v1/all" }, name: "countries", title: "Please select the country you have arrived from:"}
    ]};

    Survey.defaultBootstrapCss.navigationButton = "btn btn-primary";
    //Survey.Survey.cssType = "bootstrapmaterial";
    Survey.Survey.cssType = "bootstrap";

    var model = new Survey.Model(json);
    window.survey = model;

    var app = new Vue({
        el: '#surveyElement',
        data: {
            survey: model
        }
    });

}

if(!window["%hammerhead%"]) {
    init();
}
