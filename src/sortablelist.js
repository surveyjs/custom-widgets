import "./utils/surveyjs_importer.js";

var widget = {
    areaStyle: {border: "1px solid #1ab394", width:"100%", minHeight:"50px" },
    itemStyle: "background-color:#1ab394;color:#fff;margin:5px;padding:10px;",
    name: "sortablelist",
    isFit : function(question) { return question.getType() === 'sortablelist'; },
    htmlTemplate: "<div></div>",
    activatedByChanged: function(activatedBy) {
        Survey.JsonObject.metaData.addClass("sortablelist", [{name:"hasOther", visible: false}], null, "checkbox");
        Survey.JsonObject.metaData.addProperty("sortablelist", {name: "emptyText", default: "Move items here."});
    },
    afterRender: function(question, el) {
        var $el = $(el);
        var style = widget.mainStyle;
        $el.append(`
          <div style="width:50%">
            <div class="result">
                <span>` + question.emptyText + `</span>
            </div>
            <div class="source" style="margin-top:10px;">
            </div>
          </div>
        `);
        var $source = $el.find(".source").css(widget.areaStyle);
        var $result = $el.find(".result").css(widget.areaStyle);
        var $emptyText = $result.find("span");
        var hasValueInResults = function(val) {
            res = question.value;
            if(!Array.isArray(res)) return false;
            for(var i = 0; i < res.length; i ++){
                if(res[i] == val) return true;
            }
            return false;
        };
        var isUpdatingQuestionValue = false;
        var updateValueHandler = function() {
            if(isUpdatingQuestionValue) return;
            $result.html("<span>" + question.emptyText + "</span>");
            $emptyText = $result.find("span");
            $source.html("");
            var wasInResults = false;
            question.activeChoices.forEach(function(choice) {
                var inResutls = hasValueInResults(choice.value);
                wasInResults = wasInResults || inResutls;
                var $el = inResutls ? $result : $source;
                $el.append(`<div data-value="` + choice.value +  `">
                                        <div style="` + widget.itemStyle +  `">` + choice.text + `</div>
                                    </div>`);
            });
            if(wasInResults) {
                $emptyText.css({display: "none"});
            }
        };
        Sortable.create($result[0], {
            animation: 150,
            group: {
                  name: 'top3',
                  pull: true,
                  put: true
            },
              onSort: function (evt) {
                var result = [];
                if (evt.to.children.length === 1) {
                    $emptyText.css({display: "inline-block"});
                } else {
                    $emptyText.css({display: "none"});
                    for (var i = 1; i < evt.to.children.length; i++) {
                        result.push(evt.to.children[i].dataset.value)
                    }
                }
                isUpdatingQuestionValue = true;
                question.value = result;
                isUpdatingQuestionValue = false;
              }
        });
        Sortable.create($source[0], {
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