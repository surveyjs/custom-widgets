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
        visible: false,
        categoryIndex: 2,
      });
      Survey.JsonObject.metaData.addProperty("text", {
        name: "config",
        category: "general",
        default: null,
      });
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

      var questionRoot = $el.parents(questionRootClasses)[0];
      if (!!questionRootClasses && !!questionRoot) {
        questionRoot.style.overflow = "visible";
      }

      var config = question.config;
      var options =
        config && typeof config == "string" ? JSON.parse(config) : config;
      if (!options) options = {};

      options.data = (question.choices || []).map(function (item) {
        return item.text;
      });
      if (options.adjustWidth === undefined) {
        options.adjustWidth = false;
      }
      if (!options.list) {
        options.list = {
          sort: {
            enabled: true,
            method: (aStr, bStr) => {
              const inputStr = $el.val().toLowerCase();
              const aIndex = aStr.toLowerCase().indexOf(inputStr);
              const bIndex = bStr.toLowerCase().indexOf(inputStr);
              return aIndex - bIndex;
            }
          },
          match: {
            enabled: true,
          },
          onChooseEvent: function () {
            var selectedData = $el.getSelectedItemData();
            if(!!selectedData && typeof selectedData === "object" 
              && !!question.choicesByUrl && !!question.choicesByUrl.valueName) {
              selectedData = selectedData[question.choicesByUrl.valueName];
            }
            question.value = selectedData;
          },
        };
      }
      if (!options.placeholder) {
        options.placeholder = question.placeholder;
      }

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
  init(Survey, window.jQuery);
}

export default init;
