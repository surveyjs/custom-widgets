function init() {
    var json = { questions: [
        { type: "dropdown", renderAs: "select2", choicesByUrl: { url: "https://restcountries.eu/rest/v1/all" }, name: "countries", title: "Please select the country you have arrived from:"}
    ]};

    Survey.Survey.cssType = "bootstrap";

    var model = new Survey.Model(json);
    window.survey = model;

    ReactDOM.render(<Survey.Survey model={model} />, document.getElementById("surveyElement"));

}

if(!window["%hammerhead%"]) {
    init();
}
