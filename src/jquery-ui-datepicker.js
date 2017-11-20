function init(Survey) {
    var widget = {
        name: "datepicker",
        title: "Date picker",
        iconName: "icon-datepicker",
        widgetIsLoaded: function() { return typeof $ == 'function' && !!$.fn.datepicker; },
        isFit : function(question) { return question.getType() === 'datepicker'; },
        htmlTemplate: "<input class='form-control widget-datepicker' type='text' style='width: 100%;'>",
        activatedByChanged: function(activatedBy) {
            Survey.JsonObject.metaData.addClass("datepicker", 
                [{name: "dateFormat", default: "mm/dd/yy", choices: ["mm/dd/yy", "yy-mm-dd", "d M, y", "d MM, y", "DD, d MM, yy", "'day' d 'of' MM 'in the year' yy"]},
                {name:"inputType", visible: false}, {name:"inputFormat", visible: false}, {name: "inputMask", visible: false}], null, "text");
        },
        afterRender: function(question, el) {
            var $el = $(el).is(".widget-datepicker") ? $(el) : $(el).find(".widget-datepicker");
            var pickerWidget = $el.datepicker({
                dateFormat: question.dateFormat,
                option: { 
                    minDate: null,
                    maxDate: null
                },
                onSelect: function(dateText) {
                    question.value = dateText;
                }
            });
            question.valueChangedCallback = function() {
                if(question.value) {
                    pickerWidget.datepicker('setDate', new Date(question.value));
                } else {
                    pickerWidget.datepicker('setDate', null);
                }
            }
            question.valueChangedCallback();
        },
        willUnmount: function(question, el) {
            var $el = $(el).is(".widget-datepicker") ? $(el) : $(el).find(".widget-datepicker");
            $el.datepicker("destroy");
        } 
    }

    Survey.CustomWidgetCollection.Instance.addCustomWidget(widget, "customtype");
}

if (typeof Survey !== "undefined") {
    init(Survey);
}

export default init;