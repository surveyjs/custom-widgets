function init() {
    var json = { questions: [
        { type: "dropdown", renderAs: "select2", choicesByUrl: { url: "https://surveyjs.io/api/CountriesExample" }, name: "countries", title: "Please select the country you have arrived from:"}
    ]};
Survey.defaultBootstrapCss.navigationButton = "btn btn-primary";
Survey.StylesManager.applyTheme("defaultV2");

    var model = new Survey.Model(json);
    window.survey = model;

    function onAngularComponentInit() {
        Survey.SurveyNG.render("surveyElement", {model:model});
    }
    var HelloApp =
        ng.core
            .Component({
                selector: 'ng-app',
                template: '<div id="surveyContainer" class="survey-container contentcontainer codecontainer">' +
                '<div id="surveyElement"></div></div>'
            })
            .Class({
                constructor: function() {
                },
                ngOnInit: function() {
                    onAngularComponentInit();
                }
            });
    document.addEventListener('DOMContentLoaded', function() {
        ng.platformBrowserDynamic.bootstrap(HelloApp);
    });

}

if(!window["%hammerhead%"]) {
    init();
}
