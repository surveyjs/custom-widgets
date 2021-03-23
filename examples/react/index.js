function init() {
    var json = { questions: [
        {
            "name": "autocomplete1",
            "title": "What car are you driving?",
            "type": "text",
            "choices": [
                "None",
                "Ford",
                "Vauxhall",
                "Volkswagen",
                "Nissan",
                "Audi",
                "Mercedes-Benz",
                "BMW",
                "Peugeot",
                "Toyota",
                "Citroen"
            ]
        },
        { type: "dropdown", renderAs: "select2", choicesByUrl: { url: "https://restcountries.eu/rest/v1/all" }, name: "countries", title: "Please select the country you have arrived from:"}
    ]};

    Survey.Survey.cssType = "bootstrap";

    var model = new Survey.Model(json);
    window.survey = model;

    survey
    .onComplete
    .add(function (result) {
        document
            .querySelector('#surveyResult')
            .textContent = "Result JSON:\n" + JSON.stringify(result.data, null, 3);
    });
        
    ReactDOM.render(<Survey.Survey model={model} />, document.getElementById("surveyElement"));

}

if(!window["%hammerhead%"]) {
    init();
}
