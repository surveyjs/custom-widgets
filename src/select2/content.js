Survey.JsonObject.metaData.addProperty("dropdown", {name: "renderAs", default: "standard", choices: ["standard", "select2"]});

var widget = {
    name: "select2",
    htmlTemplate: "<select style='width: 100%;'></select>",
    isFit : function(question) { return question["renderAs"] === 'select2'; },
    afterRender: function(question, el) {
        var $el = $(el).is("select") ? $(el) : $(el).find("select");
        var othersEl = document.createElement("input");
        othersEl.type = "text";
        othersEl.style.marginTop = "3px";
        othersEl.style.display = "none";
        othersEl.style.width = "100%";
        $el.parent().get(0).append(othersEl);
        var widget = $el.select2({
            theme: "classic"
        });
        var updateValueHandler = function() {
            $el.val(question.value).trigger("change");
            othersEl.style.display = !question.isOtherSelected ? "none": "";
        };
        var updateCommentHandler = function() {
            othersEl.value = question.comment ? question.comment : "";
        }
        var othersElChanged = function() {
            question.comment = othersEl.value;
        }
        var updateChoices = function() {
            $el.select2({data: question.visibleChoices.map(function(choice) { return { id: choice.value, text: choice.text }; })});
            updateValueHandler();
            updateCommentHandler();
        }
        question.choicesChangedCallback = updateChoices;
        updateChoices();
        $el.on('select2:select', function (e) {
            question.value = e.target.value;
        });
        othersEl.onchange = othersElChanged;
        question.valueChangedCallback = updateValueHandler;
        question.commentChangedCallback = updateCommentHandler;
        updateValueHandler();
        updateCommentHandler();
    }
}
widget.willUnmount = function(question, el) {
    $(el).find("select").off('select2:select').select2("destroy");
}

Survey.CustomWidgetCollection.Instance.addCustomWidget(widget);