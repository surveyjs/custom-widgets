function init(Survey) {
    var widget = {
        name: "sortablelist",
        title: "Sortable list",
        iconName: "icon-sortablelist",
        widgetIsLoaded: function() { return typeof Sortable !== undefined; },
        defaultJSON: {choices: ["Item 1", "Item 2", "Item 3"]},
        areaStyle: "border: 1px solid #1ab394; width:100%; minHeight:50px",
        itemStyle: "background-color:#1ab394;color:#fff;margin:5px;padding:10px;",
        isFit : function(question) { return question.getType() === 'sortablelist'; },
        htmlTemplate: "<div></div>",
        activatedByChanged: function(activatedBy) {
            Survey.JsonObject.metaData.addClass("sortablelist", [{name:"hasOther", visible: false}], null, "checkbox");
            Survey.JsonObject.metaData.addProperty("sortablelist", {name: "emptyText", default: "Move items here."});
        },
        afterRender: function(question, el) {
            var rootWidget = this;
            el.style.width = "100%";
            var resultEl = document.createElement("div");
            var emptyEl = document.createElement("span");
            var sourceEl = document.createElement("div");
            resultEl.style.cssText = rootWidget.areaStyle;
            emptyEl.innerHTML = question.emptyText;
            resultEl.appendChild(emptyEl);
            sourceEl.style.cssText = rootWidget.areaStyle;
            sourceEl.style.marginTop = "10px";
            el.appendChild(resultEl);
            el.appendChild(sourceEl);
            var hasValueInResults = function(val) {
                var res = question.value;
                if(!Array.isArray(res)) return false;
                for(var i = 0; i < res.length; i ++){
                    if(res[i] == val) return true;
                }
                return false;
            };
            var isUpdatingQuestionValue = false;
            var updateValueHandler = function() {
                if(isUpdatingQuestionValue) return;
                resultEl.innerHTML = "";
                resultEl.appendChild(emptyEl);
                sourceEl.innerHTML = "";
                var wasInResults = false;
                question.activeChoices.forEach(function(choice) {
                    var inResutls = hasValueInResults(choice.value);
                    wasInResults = wasInResults || inResutls;
                    var srcEl = inResutls ? resultEl : sourceEl;
                    var newEl = document.createElement("div");
                    newEl.innerHTML = "<div style='" + rootWidget.itemStyle +  "'>" + choice.text + "</div>";
                    newEl["data-value"] = choice.value;
                    srcEl.appendChild(newEl);
                });
                emptyEl.style.display = wasInResults ?  "none" : "";
            };
            Sortable.create($(resultEl)[0], {
                animation: 150,
                group: {
                    name: 'top3',
                    pull: true,
                    put: true
                },
                onSort: function (evt) {
                    var result = [];
                    if (evt.to.children.length === 1) {
                        emptyEl.style.display = "";
                    } else {
                        emptyEl.style.display = "none";
                        for (var i = 1; i < evt.to.children.length; i++) {
                            result.push(evt.to.children[i].dataset.value)
                        }
                    }
                    isUpdatingQuestionValue = true;
                    question.value = result;
                    isUpdatingQuestionValue = false;
                }
            });
            Sortable.create($(sourceEl)[0], {
                animation: 150,
                group: {
                    name: 'top3',
                    pull: true,
                    put: true
                }
            });
            question.valueChangedCallback = updateValueHandler;
            updateValueHandler();
        },
        willUnmount: function(question, el) {
        } 
    }

    Survey.CustomWidgetCollection.Instance.addCustomWidget(widget, "customtype");
}

if (typeof Survey !== "undefined") {
    init(Survey);
}

export default init;