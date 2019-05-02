function init(Survey, $) {
  $ = $ || window.$;
  var widget = {
    name: "barrating",
    title: "Bar rating",
    iconName: "icon-barrating",
    widgetIsLoaded: function() {
      return typeof $ == "function" && !!$.fn.barrating;
    },
    defaultJSON: { choices: [1, 2, 3, 4, 5] },
    isFit: function(question) {
      return question.getType() === "barrating";
    },
    isDefaultRender: true,
    activatedByChanged: function(activatedBy) {
      Survey.JsonObject.metaData.addClass(
        "barrating",
        [
          { name: "hasOther", visible: false },
          { name: "otherText", visible: false },
          { name: "optionsCaption", visible: false },
          { name: "otherErrorText", visible: false },
          { name: "storeOthersAsComment", visible: false },
          { name: "renderAs", visible: false }
        ],
        null,
        "dropdown"
      );
      Survey.JsonObject.metaData.addProperty("barrating", {
        name: "showValues:boolean",
        default: false
      });
      Survey.JsonObject.metaData.addProperty("barrating", {
        name: "ratingTheme",
        default: "css-stars",
        choices: [
          "fontawesome-stars",
          "css-stars",
          "bars-pill",
          "bars-1to10",
          "bars-movie",
          "bars-square",
          "bars-reversed",
          "bars-horizontal",
          "bootstrap-stars",
          "fontawesome-stars-o"
        ]
      });
    },
    afterRender: function(question, el) {
      var $el = $(el).is("select") ? $(el) : $(el).find("select");
      var valueChangingByWidget = false;
      var creator = function() {
        $el.barrating("show", {
          theme: question.ratingTheme,
          initialRating: question.value,
          showValues: question.showValues,
          showSelectedRating: false,
          onSelect: function(value, text) {
            valueChangingByWidget = true;
            question.value = value;
            valueChangingByWidget = false;
          }
        });
      };
      creator();
      question.valueChangedCallback = function() {
        if (!valueChangingByWidget && $(el).find("select")[0].value !== question.value) {
          $(el)
            .find("select")
            .barrating("set", question.value);
        }
      };
      question.__barratingOnPropertyChangedCallback = function(
        sender,
        options
      ) {
        if (options.name == "ratingTheme") {
          $el.barrating("destroy");
          creator();
        }
      };
      question.onPropertyChanged.add(
        question.__barratingOnPropertyChangedCallback
      );
    },
    willUnmount: function(question, el) {
      var $el = $(el).find("select");
      $el.barrating("destroy");
      question.valueChangedCallback = undefined;
      question.onPropertyChanged.remove(
        question.__barratingOnPropertyChangedCallback
      );
      question.__barratingOnPropertyChangedCallback = undefined;
    }
  };

  Survey.CustomWidgetCollection.Instance.addCustomWidget(widget, "customtype");
}

if (typeof Survey !== "undefined") {
  init(Survey, window.$);
}

export default init;
