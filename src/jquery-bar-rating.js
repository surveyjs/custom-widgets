function init(Survey, $) {
  $ = $ || window.$;
  var widget = {
    name: "barrating",
    title: "Bar rating",
    iconName: "icon-barrating",
    widgetIsLoaded: function () {
      return typeof $ == "function" && !!$.fn.barrating;
    },
    defaultJSON: { choices: [1, 2, 3, 4, 5] },
    isFit: function (question) {
      return question.getType() === "barrating";
    },
    isDefaultRender: true,
    activatedByChanged: function (activatedBy) {
      Survey.JsonObject.metaData.addClass(
        "barrating",
        [
          { name: "hasOther", visible: false },
          { name: "otherText", visible: false },
          { name: "optionsCaption", visible: false },
          { name: "otherErrorText", visible: false },
          { name: "storeOthersAsComment", visible: false },
          { name: "renderAs", visible: false },
          { name: "select2Config", visible: false },
        ],
        null,
        "dropdown"
      );
      Survey.JsonObject.metaData.addProperty("barrating", {
        name: "showValues:boolean",
        default: false,
        category: "general",
      });
      Survey.JsonObject.metaData.addProperty("barrating", {
        name: "ratingTheme",
        category: "general",
        default: "css-stars",
        choices: [
          "fontawesome-stars",
          "css-stars",
          "bars-pill",
          "bars-1to10",
          "bars-movie",
          "bars-reversed",
          "bars-horizontal",
          "fontawesome-stars-o",
        ],
      });
    },
    afterRender: function (question, el) {
      var $customSelect;
      var $questionInput;
      var contentContainer = $(el).is("select")
        ? $(el).parent().parent()[0]
        : $(el).parent()[0];
      var renderCustomSelect = function () {
        $customSelect = $("<select class='sv-widget-select'></select>");
        question.visibleChoices.forEach(function (choice) {
          $customSelect.append(
            '<option value="{0}">{1}</option>'.format(choice.value, choice.text)
          );
        });
        $questionInput = $(contentContainer).find(
          '[id="{0}"]'.format(question.inputId)
        );

        $questionInput.css("display", "none");
        $questionInput.after($customSelect);
        $customSelect[0].selectedIndex = -1;
      };
      var removeCustomSelect = function () {
        $questionInput.css("display", "");
        $customSelect.barrating("destroy");
        $customSelect.remove();
      };
      var renderBarrating = function () {
        $customSelect.barrating("show", {
          theme: question.ratingTheme,
          initialRating: question.value,
          showValues: question.showValues,
          showSelectedRating: false,
          readonly: question.isReadOnly,
          onSelect: function (value, text) {
            valueChangingByWidget = true;
            question.value = value;
            valueChangingByWidget = false;
          },
        });
      };
      renderCustomSelect();
      renderBarrating();
      if (!!$customSelect.parents()[0])
        $customSelect.parents()[0].style.marginBottom = "3px";
      var valueChangingByWidget = false;

      question.valueChangedCallback = function () {
        if (
          !valueChangingByWidget &&
          $(contentContainer).find("select.sv-widget-select")[0].value !==
            question.value
        ) {
          $(contentContainer)
            .find("select.sv-widget-select")
            .barrating("set", question.value);
        }
      };
      question.__barratingOnPropertyChangedCallback = function (
        sender,
        options
      ) {
        if (options.name == "ratingTheme") {
          $customSelect.barrating("destroy");
          renderBarrating();
        }
      };
      question.onPropertyChanged.add(
        question.__barratingOnPropertyChangedCallback
      );
      question.readOnlyChangedCallback = function () {
        removeCustomSelect();
        renderCustomSelect();
        renderBarrating();
      };
      question.visibleChoicesChangedCallback = function () {
        renderBarrating();
      };
    },
    willUnmount: function (question, el) {
      var $contentContainer = $(el).is("select")
        ? $(el).parent().parent()
        : $(el).parent();
      var $el = $contentContainer.find("select.sv-widget-select");
      $el.barrating("destroy");
      $el.remove();
      question.valueChangedCallback = undefined;
      question.onPropertyChanged.remove(
        question.__barratingOnPropertyChangedCallback
      );
      question.__barratingOnPropertyChangedCallback = undefined;
    },
    pdfQuestionType: "dropdown",
  };

  Survey.CustomWidgetCollection.Instance.addCustomWidget(widget, "customtype");
}

if (typeof Survey !== "undefined") {
  init(Survey, window.$);
}

export default init;
