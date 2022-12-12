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
    name: "datepicker",
    title: "Date picker",
    iconName: iconId,
    widgetIsLoaded: function () {
      return !!$ && !!$.fn.datepicker && !$.fn.datepicker.noConflict;
    },
    isFit: function (question) {
      return question.getType() === "datepicker";
    },
    htmlTemplate: "<input class='form-control widget-datepicker' type='text'>",
    activatedByChanged: function (activatedBy) {
      Survey.JsonObject.metaData.addClass(
        "datepicker",
        [
          { name: "inputType", visible: false },
          { name: "inputFormat", visible: false },
          { name: "inputMask", visible: false },
        ],
        null,
        "text"
      );
      Survey.JsonObject.metaData.addProperty("datepicker", {
        name: "dateFormat",
        category: "general",
      });
      Survey.JsonObject.metaData.addProperty("datepicker", {
        name: "config",
        category: "general",
        visible: false,
        default: null,
      });
      Survey.JsonObject.metaData.addProperty("datepicker", {
        name: "maxDate",
        category: "general",
      });
      Survey.JsonObject.metaData.addProperty("datepicker", {
        name: "minDate",
        category: "general",
      });
      Survey.JsonObject.metaData.addProperty("datepicker", {
        name: "disableInput:boolean",
        category: "general",
      });
    },
    afterRender: function (question, el) {
      var $el = $(el).is(".widget-datepicker")
        ? $(el)
        : $(el).find(".widget-datepicker");
      $el.addClass(question.css.text.root);
      var isSelecting = false;
      var config = $.extend(true, {}, question.config || {});
      if (!!question.placeHolder) {
        $el.attr("placeholder", question.placeHolder);
      }
      if (config.dateFormat === undefined) {
        config.dateFormat = !!question.dateFormat
          ? question.dateFormat
          : undefined;
      }
      if (config.option === undefined) {
        config.option = {
          minDate: null,
          maxDate: null,
        };
      }
      if (!!question.minDate) {
        config.minDate = question.minDate;
      }
      if (!!question.maxDate) {
        config.maxDate = question.maxDate;
      }
      if (!!question.renderedMin) {
        config.minDate = new Date(question.renderedMin);
      }
      if (!!question.renderedMax) {
        config.maxDate = new Date(question.renderedMax);
      }
      config.disabled = question.isReadOnly;
      if (config.onSelect === undefined) {
        config.onSelect = function (dateText) {
          isSelecting = true;
          setDateIntoQuestion();
          isSelecting = false;
          this.fixFocusIE = true;
        };
      }
      config.fixFocusIE = false;
      config.onClose = function (dateText, inst) {
        this.fixFocusIE = true;
      };
      config.beforeShow = function (input, inst) {
        var result = !!navigator.userAgent.match(/Trident\/7\./)
          ? !this.fixFocusIE
          : true;
        this.fixFocusIE = false;
        return result;
      };
      function setDateIntoQuestion() {
        var val = $el.datepicker('getDate');
        var d = new Date();
        val.setHours(d.getHours());
        val.setMinutes(d.getMinutes());
        val.setSeconds(d.getSeconds());
        question.value = val;
      }
      var pickerWidget = $el.datepicker(config).on("change", function (e) {
        setDateIntoQuestion();
      });

      $el.keyup(function (e) {
        if (e.keyCode == 8 || e.keyCode == 46) {
          $.datepicker._clearDate(this);
        }
      });
      if(question.disableInput) {
        $el.attr("readOnly", "true");
      }

      question.readOnlyChangedCallback = function () {
        $el.datepicker("option", "disabled", question.isReadOnly);
      };
      function updateDate() {
        if (!question.isEmpty()) {
          var val = question.value;
          if(typeof val === "string") {
            val = new Date(val);
          }
          pickerWidget.datepicker("setDate", val);
        } else {
          pickerWidget.datepicker("setDate", null);
        }
      }
      question.registerFunctionOnPropertyValueChanged(
        "dateFormat",
        function () {
          question.dateFormat &&
            pickerWidget.datepicker(
              "option",
              "dateFormat",
              question.dateFormat
            );
          updateDate();
        }
      );
      question.valueChangedCallback = function () {
        if (!isSelecting) {
          updateDate();
          $el.blur();
        }
      };
      question.valueChangedCallback();
    },
    willUnmount: function (question, el) {
      var $el = $(el).is(".widget-datepicker")
        ? $(el)
        : $(el).find(".widget-datepicker");
      $el.datepicker("destroy");
    },
    pdfQuestionType: "text",
  };

  Survey.CustomWidgetCollection.Instance.addCustomWidget(widget, "customtype");
}

if (typeof Survey !== "undefined") {
  init(Survey, window.jQuery);
}

export default init;
