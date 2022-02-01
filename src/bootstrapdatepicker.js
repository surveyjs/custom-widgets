function init(Survey, $) {
  const iconId = "icon-datepicker";
  Survey.SvgRegistry && Survey.SvgRegistry.registerIconFromSvg(iconId, require('svg-inline-loader?classPrefix!./images/datepicker.svg'), "");
  $ = $ || window.$;

  if (
    !!$ &&
    !$.fn.bootstrapDP &&
    !!$.fn.datepicker &&
    !!$.fn.datepicker.noConflict
  ) {
    $.fn.bootstrapDP = $.fn.datepicker.noConflict();
    if (!$.fn.datepicker) {
      $.fn.datepicker = $.fn.bootstrapDP;
    }
  }
  var widget = {
    name: "bootstrapdatepicker",
    title: "Date picker",
    iconName: iconId,
    widgetIsLoaded: function () {
      return !!$ && !!$.fn.bootstrapDP;
    },
    isFit: function (question) {
      return question.getType() === "bootstrapdatepicker";
    },
    htmlTemplate:
      "<input class='form-control widget-datepicker' type='text' style='width: 100%;'>",
    activatedByChanged: function (activatedBy) {
      Survey.JsonObject.metaData.addClass(
        "bootstrapdatepicker",
        [
          { name: "inputType", visible: false },
          { name: "inputFormat", visible: false },
          { name: "inputMask", visible: false },
        ],
        null,
        "text"
      );
      Survey.JsonObject.metaData.addProperties("bootstrapdatepicker", [
        {
          // Can take a string or an Object.
          // https://bootstrap-datepicker.readthedocs.io/en/latest/options.html#format
          name: "dateFormat",
          category: "general",
          default: "mm/dd/yyyy",
        },
        {
          // Can take a Date or a string
          // https://bootstrap-datepicker.readthedocs.io/en/latest/options.html#options
          name: "startDate",
          category: "general",
          default: "",
        },
        {
          // Can take a Date or a string
          // https://bootstrap-datepicker.readthedocs.io/en/latest/options.html#options
          name: "endDate",
          category: "general",
          default: "",
        },
        {
          name: "todayHighlight:boolean",
          category: "general",
          default: true,
        },
        {
          name: "weekStart:number",
          category: "general",
          default: 0,
        },
        {
          name: "clearBtn:boolean",
          category: "general",
          default: false,
        },
        {
          name: "autoClose:boolean",
          category: "general",
          default: true,
        },
        {
          name: "daysOfWeekDisabled:string",
          category: "general",
          default: "",
        },
        {
          name: "daysOfWeekHighlighted:string",
          category: "general",
          default: "",
        },
        {
          name: "disableTouchKeyboard:boolean",
          category: "general",
          default: true,
        },
      ]);
    },
    afterRender: function (question, el) {
      var $el = $(el).is(".widget-datepicker")
        ? $(el)
        : $(el).find(".widget-datepicker");
      const options = {
        enableOnReadonly: false,
        format: question.dateFormat,
        todayHighlight: question.todayHighlight,
        weekStart: question.weekStart,
        clearBtn: question.clearBtn,
        autoclose: question.autoClose,
        daysOfWeekDisabled: question.daysOfWeekDisabled,
        daysOfWeekHighlighted: question.daysOfWeekHighlighted,
        disableTouchKeyboard: question.disableTouchKeyboard,
      };
      if (!!question.startDate || !!question.renderedMin) {
        options.startDate = !!question.startDate
          ? question.startDate
          : question.renderedMin;
      }
      var renderedMax = question.renderedMax;
      if (!!renderedMax && new Date(renderedMax).getFullYear() >= 2999) {
        renderedMax = undefined;
      }
      if (!!question.endDate || !!renderedMax) {
        options.endDate = !!question.endDate ? question.endDate : renderedMax;
      }
      const pickerWidget = $el.bootstrapDP(options).on("change", function (e) {
        var newDate = pickerWidget.bootstrapDP("getUTCDate");
        var newValue = newDate && newDate.toUTCString();
        if (question.value != newValue) {
          question.value = newValue;
        }
      });

      question.valueChangedCallback = function () {
        pickerWidget.bootstrapDP(
          "setUTCDate",
          !!question.value ? new Date(question.value) : ""
        );
      };
      question.valueChangedCallback();
      question.readOnlyChangedCallback = function () {
        if (question.isReadOnly) {
          $el.prop("readonly", true);
        } else {
          $el.removeAttr("readonly");
        }
      };
      question.readOnlyChangedCallback();
    },
    willUnmount: function (question, el) {
      var $el = $(el).is(".widget-datepicker")
        ? $(el)
        : $(el).find(".widget-datepicker");
      $el.bootstrapDP("destroy");
      question.readOnlyChangedCallback = undefined;
      question.valueChangedCallback = undefined;
    },
    pdfQuestionType: "text",
  };

  Survey.CustomWidgetCollection.Instance.addCustomWidget(widget, "customtype");
}

if (typeof Survey !== "undefined") {
  init(Survey, window.$);
}

export default init;
