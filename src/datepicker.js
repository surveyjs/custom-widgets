import "./utils/surveyjs_importer.js";

var widget = {
    name: "datepicker",
    isFit : function(question) { return question.getType() === 'datepicker'; },
    htmlTemplate: "<input class='widget-datepicker' type='text' style='width: 100%;'>",
    activatedByChanged: function(activatedBy) {
        Survey.JsonObject.metaData.addClass("datepicker", 
            [{name: "dateFormat", default: "mm/dd/yy", choices: ["mm/dd/yy", "yy-mm-dd", "d M, y", "d MM, y", "DD, d MM, yy", "'day' d 'of' MM 'in the year' yy"]}],
            null, "text");
    },
    afterRender: function(question, el) {
        var $el = $(el).is(".widget-datepicker") ? $(el) : $(el).find(".widget-datepicker");
        var widget = $el.datepicker({
            dateFormat: question.dateFormat,
            onSelect: function(dateText) {
                question.value = dateText;
            }
        });
        question.valueChangedCallback = function() {
            widget.datepicker('setDate', new Date(question.value));
        }
        question.valueChangedCallback();
        if(!question.value) question.value = new Date();
    },
    willUnmount: function(question, el) {
        var $el = $(el).is(".widget-datepicker") ? $(el) : $(el).find(".widget-datepicker");
        $el.datepicker("destroy");
    } 
}

Survey.CustomWidgetCollection.Instance.addCustomWidget(widget, "customtype");