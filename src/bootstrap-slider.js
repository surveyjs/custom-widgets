var Slider = require("bootstrap-slider");

const componentName = "bootstrapslider";

function init(Survey) {
  var widget = {
    name: componentName,
    title: "Bootstrap Slider",
    iconName: "icon-bootstrap-slider",
    widgetIsLoaded: function () {
      return typeof Slider !== "undefined";
    },
    isFit: function (question) {
      return question.getType() === componentName;
    },
    htmlTemplate: "<div></div>",
    activatedByChanged: function (activatedBy) {
      Survey.Serializer.addClass(componentName, [], null, "empty");
      let registerQuestion = Survey.ElementFactory.Instance.registerCustomQuestion;
      if(!!registerQuestion) registerQuestion(componentName);
      Survey.Serializer.addProperties(componentName, [
        {
          name: "step:number",
          default: 1,
          category: "general",
        },
        {
          name: "rangeMin:number",
          default: 0,
          category: "general",
        },
        {
          name: "rangeMax:number",
          default: 100,
          category: "general",
        },
        {
          name: "orientation",
          default: "horizontal",
          choices: ["horizontal", "vertical"],
          category: "general"
        },
      ]);
      Survey.Serializer.addProperty(componentName, {
        name: "config",
        default: null,
        category: "general",
      });
    },
    afterRender: function (question, el) {
      el.style.paddingTop = "20px";
      el.style.paddingBottom = "17px";
      el.style.paddingLeft = "10px";
      var inputEl = document.createElement("input");
      inputEl.id = question.id;
      inputEl.type = "text";
      inputEl.setAttribute("data-slider-id", question.name + "_" + question.id);
      inputEl.setAttribute("data-slider-min", question.rangeMin);
      inputEl.setAttribute("data-slider-max", question.rangeMax);
      inputEl.setAttribute("data-slider-step", question.step);
      if(question.orientation == "vertical") {
        inputEl.setAttribute("data-slider-orientation", "vertical");
      }
      inputEl.setAttribute("data-slider-step", question.step);
      inputEl.setAttribute(
        "data-slider-value",
        question.value || question.rangeMin
      );
      el.appendChild(inputEl);

      var config = question.config || {};

      if (config.id === undefined) {
        config.id = question.name + "_" + question.id;
      }

      if (config.min === undefined) {
        config.min = question.rangeMin;
      }

      if (config.max === undefined) {
        config.max = question.rangeMax;
      }

      if (config.step === undefined) {
        config.step = question.step;
      }

      if (config.enabled === undefined) {
        config.enabled = !question.isReadOnly;
      }

      if (config.value === undefined) {
        config.value = question.value || question.rangeMin;
      }

      var slider = new Slider(inputEl, config);

      slider.on("change", function (valueObj) {
        question.value = slider.getValue();
      });
      var updateValueHandler = function () {
        slider.setValue(question.value || question.rangeMin);
      };
      question.readOnlyChangedCallback = function () {
        if (question.isReadOnly) {
          slider.disable();
        } else {
          slider.enable();
        }
      };
      question.bootstrapSlider = slider;
      question.valueChangedCallback = updateValueHandler;
    },
    willUnmount: function (question, el) {
      question.bootstrapSlider && question.bootstrapSlider.destroy();
      question.bootstrapSlider = null;
      question.readOnlyChangedCallback = null;
    },
    pdfRender: function (_, options) {
      if (options.question.getType() === componentName) {
        var point = options.module.SurveyHelper.createPoint(
          options.module.SurveyHelper.mergeRects.apply(null, options.bricks)
        );
        point.xLeft += options.controller.unitWidth;
        point.yTop +=
          options.controller.unitHeight *
          options.module.FlatQuestion.CONTENT_GAP_VERT_SCALE;
        var rect = options.module.SurveyHelper.createTextFieldRect(
          point,
          options.controller
        );
        var textboxBrick = new options.module.TextFieldBrick(
          options.question,
          options.controller,
          rect,
          true,
          options.question.id,
          (
            options.question.value ||
            options.question.defaultValue ||
            ""
          ).toString(),
          "",
          options.question.isReadOnly,
          false,
          "text"
        );
        options.bricks.push(textboxBrick);
      }
    },
  };

  Survey.CustomWidgetCollection.Instance.addCustomWidget(widget, "customtype");
}

if (typeof Survey !== "undefined") {
  init(Survey);
}

export default init;
