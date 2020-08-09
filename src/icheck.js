function escValue(val) {
  if (typeof val === "string") {
    return (val || "").replace(/(['])/g, "\\$1");
  }
  return val;
}

function init(Survey, $) {
  $ = $ || window.$;
  var widget = {
    className: "iradio_square-blue",
    checkboxClass: "iradio_square-blue",
    radioClass: "iradio_square-blue",
    name: "icheck",
    widgetIsLoaded: function () {
      return typeof $ == "function" && !!$.fn.iCheck;
    },
    isFit: function (question) {
      var t = question.getType();
      return t === "radiogroup" || t === "checkbox" || t === "matrix";
    },
    isDefaultRender: true,
    afterRender: function (question, el) {
      var rootWidget = this;
      var $el = $(el);

      $el.find(".sv-item__decorator").hide();

      $el.find("input").data({
        iCheck: undefined,
      });
      function getIndexByValue(arr, value) {
        if (!Array.isArray(arr)) return -1;
        for (var i = 0; i < arr.length; i++) {
          if (arr[i] == value) return i;
          if (!!arr[i] && arr[i].toString().toLowerCase() == value) return i;
        }
        return -1;
      }
      var frozeUpdating = false;
      var makeChoicesICheck = function () {
        var inputs = $el.find("input");
        inputs.iCheck({
          checkboxClass:
            question.checkboxClass ||
            rootWidget.checkboxClass ||
            rootWidget.className,
          radioClass:
            question.radioClass ||
            rootWidget.radioClass ||
            rootWidget.className,
        });
        inputs.on("ifChecked", function (event) {
          if (frozeUpdating) return;
          if (question.getType() === "matrix") {
            question.generatedVisibleRows.forEach(function (row, index, rows) {
              if (row.fullName === event.target.name) {
                row.value = event.target.value;
              }
            });
          } else if (question.getType() === "checkbox") {
            var oldValue = question.value || [];
            var index = getIndexByValue(oldValue, event.target.value);
            if (index === -1) {
              question.value = oldValue.concat([event.target.value]);
            }
          } else {
            question.value = event.target.value;
          }
        });

        inputs.on("ifUnchecked", function (event) {
          if (frozeUpdating) return;
          if (question.getType() === "checkbox") {
            var oldValue = (question.value || []).slice();
            var index = getIndexByValue(oldValue, event.target.value);
            if (index >= 0) {
              oldValue.splice(index, 1);
              question.value = oldValue;
            }
          }
        });
      };
      function uncheckIcheck(cEl) {
        cEl.iCheck("uncheck");
        cEl[0].parentElement.classList.remove("checked");
      }
      var select = function () {
        frozeUpdating = true;
        if (question.getType() !== "matrix") {
          var values = question.value;
          if (!Array.isArray(values)) {
            values = [values];
          }
          if (question.getType() == "checkbox") {
            var qValue = question.value;
            question.visibleChoices.forEach(function (item) {
              var inEl = $el.find(
                "input[value='" + escValue(item.value) + "']"
              );
              if (!inEl) return;
              var isChecked = getIndexByValue(qValue, item.value) > -1;
              if (isChecked) {
                inEl.iCheck("check");
              } else {
                var cEl = inEl[0];
                var wasChecked = !!cEl["checked"];
                if (wasChecked) {
                  inEl.removeAttr("checked");
                  if (!inEl.parent().hasClass("checked"))
                    setTimeout(function () {
                      uncheckIcheck(inEl);
                    });
                  else uncheckIcheck(inEl);
                }
              }
            });
          } else {
            values.forEach(function (value) {
              $el
                .find("input[value='" + escValue(value) + "']")
                .iCheck("check");
            });
          }
        } else {
          question.generatedVisibleRows.forEach(function (row, index, rows) {
            if (row.value) {
              $(el)
                .find(
                  "input[name='" +
                    row.fullName +
                    "'][value='" +
                    escValue(row.value) +
                    "']"
                )
                .iCheck("check");
            }
          });
        }
        frozeUpdating = false;
      };
      makeChoicesICheck();

      question.visibleChoicesChangedCallback = function () {
        makeChoicesICheck();
        $el.find(".sv-item__decorator").hide();
      };
      question.valueChangedCallback = select;
      select();
    },
    willUnmount: function (question, el) {
      var $el = $(el);
      $el.find("input").iCheck("destroy");
      question.visibleChoicesChangedCallback = null;
    },
  };

  Survey.JsonObject.metaData.addProperty("radiogroup", {
    name: "radioClass",
    category: "general",
  });
  Survey.JsonObject.metaData.addProperty("checkbox", {
    name: "checkboxClass",
    category: "general",
  });
  Survey.CustomWidgetCollection.Instance.addCustomWidget(widget, "type");
}

if (typeof Survey !== "undefined") {
  init(Survey, window.$);
}

export default init;
