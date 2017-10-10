Survey.JsonObject.metaData.addProperty("dropdown", {name: "renderAs", default: "standard", choices: ["standard", "select2"]});

if (PLATFORM !== "vue") {
    var widget = {
        name: "select2",
        htmlTemplate: "<select style='width: 100%;'></select>",
        isFit : function(question) { return question["renderAs"] === 'select2'; },
        afterRender: function(question, el) {
            if (PLATFORM == "knockout") {
                var $el = $(el);
            } else {
                var $el = $(el).find("select");
            }

            var widget = $el.select2({
                theme: "classic"
            });
            var updateChoices = function() {
                $el.select2({data: question.visibleChoices.map(function(choice) { return { id: choice.value, text: choice.text }; })});
            }
            question.choicesChangedCallback = updateChoices;
            updateChoices();
            $el.on('select2:select', function (e) {
                question.value = e.target.value;
            });
            var updateHandler = function() {
                $el.val(question.value).trigger("change");
            };
            question.valueChangedCallback = updateHandler;
            updateHandler();
        }
    }

    if (PLATFORM !== "knockout") {
        widget.willUnmount = function(question, el) {
            $(el).find("select").off('select2:select').select2("destroy");
        }
    }
}
if (PLATFORM === "vue") {
    var widget = {
        name: "select2",
        isFit : function(question) { return question["renderAs"] === 'select2'; }
    }

    Vue.component(widget.name, {
        props: ['question', 'css', 'isEditMode'],
        template: "<select style='width: 100%;'></select>",
        mounted: function () {
            var vm = this;
            $(vm.$el).select2({
                data: vm.question.choices.map(function(choice) { return { id: choice.value, text: choice.text }; }),
                theme: "classic"
            });
            vm.question.choicesChangedCallback = function() {
                $(vm.$el).select2({data: vm.question.visibleChoices.map(function(choice) { return { id: choice.value, text: choice.text }; })});
            }
            $(vm.$el).on('select2:select', function (e) {
            vm.question.value = e.target.value;
            });
            var updateHandler = function() {
                $(vm.$el).val(vm.question.value).trigger("change");
            }
            vm.question.valueChangedCallback = updateHandler;
            updateHandler();
        },
        destroyed: function () {
            $(this.$el).off('select2:select').select2("destroy");
        }
    });
}

Survey.CustomWidgetCollection.Instance.addCustomWidget(widget);

