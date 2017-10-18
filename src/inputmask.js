import "./surveyjs_importer.js";

var widget = {
    name: "maskedit",
    numericGroupSeparator: ',',
    numericAutoGroup: true,
    numericDigits: 2,
    numericDigitsOptional: false,
    numericPrefix: '$',
    numericPlaceholder: '0',
    isFit : function(question) { 
        if(question.getType() == "multipletext") return true;
        return question.getType() == "text" && (question.inputMask != "none" || question.inputFormat);
    },
    isDefaultRender: true,
    activatedByChanged: function(activatedBy) {
        if(Survey.JsonObject.metaData.findProperty("text", "inputMask")) return;
        var properties = ["inputFormat", {name: "inputMask", default: "none", choices: ["none", "datetime", "currency", "decimal", "email", "phone", "ip"]}];
        Survey.JsonObject.metaData.addProperties("text", properties);
        Survey.JsonObject.metaData.addProperties("matrixdropdowncolumn", properties);
        Survey.JsonObject.metaData.addProperties("multipletextitem", properties);
    },
    applyInputMask: function(surveyElement, $el) {
        var rootWidget = this;
        var mask = surveyElement.inputMask != "none" ? surveyElement.inputMask : surveyElement.inputFormat;
        var options = {};
        if(surveyElement.inputMask != "none") options.inputFormat = surveyElement.inputFormat;
        if(surveyElement.inputmask == "currency" || surveyElement.inputmask == "decimal") {
            options.groupSeparator = rootWidget.numericGroupSeparator;
            options.autoGroup = rootWidget.numericAutoGroup;
        }
        if(surveyElement.inputmask == "currency") {
            options.digits = rootWidget.numericDigits;
            options.digitsOptional = rootWidget.numericDigitsOptional;
            options.prefix = rootWidget.numericPrefix;
            options.placeholder = rootWidget.numericPlaceholder;
        }
        $el.inputmask(mask, options);

        var updateHandler = function() {
            $el.inputmask({ setvalue: surveyElement.value });
        };
        surveyElement.valueChangedCallback = updateHandler;
        updateHandler();
    },
    afterRender: function(question, el) {
        if(question.getType() != "multipletext") {
            var $el = $(el).is("input") ? $(el) : $(el).find("input");
            this.applyInputMask(question, $el);
        } else {
            for(var i = 0; i < question.items.length; i ++) {
                var item = question.items[i];
                if(item.inputMask != "none" || item.inputFormat) {
                    var $el =  $(el).find("#" + item.id);
                    if($el) {
                        this.applyInputMask(item, $el);
                    }
                }
            }
        }
    },
    willUnmount: function(question, el) {
        $(el).find("input").inputmask('remove');
    }
}

Survey.CustomWidgetCollection.Instance.addCustomWidget(widget);