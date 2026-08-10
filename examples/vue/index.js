function init() {

    var json = {
        questions: [
            {
                type: "dropdown",
                renderAs: "select2",
                choicesByUrl: { url: "https://surveyjs.io/api/CountriesExample" },
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
