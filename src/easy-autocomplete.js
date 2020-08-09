function init(Survey, $) {
  $ = $ || window.$;
  var widget = {
    name: "autocomplete",
    widgetIsLoaded: function () {
      return typeof $ == "function" && !!$.fn.easyAutocomplete;
    },
    isFit: function (question) {
      return question.getType() === "text";
    },
    isDefaultRender: true,
    activatedByChanged: function (activatedBy) {
      if (
        Survey.JsonObject.metaData.findProperty("text", "choices") !== null ||
        Survey.JsonObject.metaData.findProperty("text", "choicesByUrl") !== null
      ) {
        return;
      }
      Survey.JsonObject.metaData.addProperty("text", {
        name: "choices:itemvalues",
        category: "choices",
        categoryIndex: 1,
      });
      Survey.JsonObject.metaData.addProperty("text", {
        name: "choicesByUrl:restfull",
        className: "ChoicesRestfull",
        category: "choicesByUrl",
        categoryIndex: 2,
      });
      Array.prototype.push.apply(
        Survey.matrixDropdownColumnTypes.text.properties,
        ["choices", "choicesOrder", "choicesByUrl", "otherText"]
      );
    },
    afterRender: function (question, el) {
      var $el = $(el).is("input") ? $(el) : $(el).find("input");

      var getCssSelectorFromClassesString = function (classesString) {
        if (!classesString) return "";
        var cssSelector = classesString.replace(/(^\s*)|(\s+)/g, "."); // replace whitespaces with '.'
        return cssSelector;
      };

      var questionRootClasses = getCssSelectorFromClassesString(
        question.cssRoot
      );
      if (!!questionRootClasses) {
        $el.parents(questionRootClasses)[0].style.overflow = "visible";
      }
      var options = {
        data: (question.choices || []).map(function (item) {
          return item.text;
        }),
        adjustWidth: false,
        list: {
          sort: {
            enabled: true,
          },
          match: {
            enabled: true,
          },
        },
        placeholder: question.placeholder,
      };
      if (!!question.choicesByUrl) {
        options.url = function (phrase) {
          return question.choicesByUrl.url;
        };
        options.getValue = question.choicesByUrl.valueName;
        // options.ajaxSettings = {
        //   dataType: "jsonp"
        // };
      }
      $el.easyAutocomplete(options);

      $el[0].oninput = function () {
        question.customWidgetData.isNeedRender = true;
      };
      var updateHandler = function () {
        $el[0].value =
          typeof question.value === "undefined" ? "" : question.value;
      };
      question.valueChangedCallback = updateHandler;
      updateHandler();
    },
    willUnmount: function (question, el) {
      // var $el = $(el).find("input");
      // $el.autocomplete("destroy");
    },
  };

  Survey.CustomWidgetCollection.Instance.addCustomWidget(widget, "type");
}

if (typeof Survey !== "undefined") {
  init(Survey, window.$);
}

export default init;
