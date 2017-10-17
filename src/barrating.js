import "./surveyjs_importer.js";

var widget = {
    name: "barrating",
    isFit : function(question) { return question.getType() === 'barrating'; },
    isDefaultRender: true,
    activatedByChanged: function(activatedBy) {
        Survey.JsonObject.metaData.addClass("barrating", [  {name: "ratingTheme", default: "fontawesome-stars", choices: ["fontawesome-stars", "css-stars", "bars-pill", "bars-1to10", "bars-movie", "bars-square", "bars-reversed", "bars-horizontal", "bootstrap-stars", "fontawesome-stars-o"]},
            {name: "showValues", default: false}, {name:"hasOther", visible: false}], null, "dropdown");
    },
    afterRender: function(question, el) {
        var $el = $(el).is("select") ? $(el) : $(el).find("select");
        $el.barrating('show', {
            theme: question.ratingTheme,
            initialRating: question.value,
            showValues: question.showValues,
            showSelectedRating: false,
            onSelect: function(value, text) {
                question.value = value;
            }
        });
        question.valueChangedCallback = function() {
            $(el).find('select').barrating('set', question.value);
        }
    },
    willUnmount: function(question, el) {
        var $el = $(el).find("select");
        $el.barrating('destroy');
    } 
}

Survey.CustomWidgetCollection.Instance.addCustomWidget(widget, "customtype");