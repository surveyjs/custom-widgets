import "./surveyjs_importer.js";

var widget = {
    name: "tagbox",
    htmlTemplate: "<select multiple='multiple' style='width: 100%;'></select>",
    isFit : function(question) { return question.getType() === 'tagbox';  },
    activatedByChanged: function(activatedBy) {
        Survey.JsonObject.metaData.addClass("tagbox", [{name:"hasOther", visible: false}], null, "checkbox");
    },
    afterRender: function(question, el) {
        var $el = $(el).is("select") ? $(el) : $(el).find("select");
        $el.select2({
            tags: "true",
            theme: "classic"
        });
        var updateValueHandler = function() {
            $el.val(question.value).trigger("change");
        };
        var updateChoices = function() {
            $el.select2({data: question.visibleChoices.map(function(choice) { return { id: choice.value, text: choice.text }; })});
            updateValueHandler();
        }
        question.choicesChangedCallback = updateChoices;
        question.valueChangedCallback = updateValueHandler;
        $el.on('select2:select', function (e) {
            question.value = (question.value || []).concat(e.params.data.id);
         });
         $el.on('select2:unselect', function (e) {
            var index = (question.value || []).indexOf(e.params.data.id);
            if(index !== -1) {
                var val = question.value;
                val.splice(index, 1);
                question.value = val;
            }
        });         
        updateChoices();
    },
    willUnmount: function(question, el) {
        $(el).find("select").off('select2:select').select2("destroy");
    }
}

Survey.CustomWidgetCollection.Instance.addCustomWidget(widget, "customtype");