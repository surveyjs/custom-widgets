function init(Survey, $) {
  $ = $ || window.$;

  var widget = {
    name: "emotionsratings",
    title: "Emotions Ratings",
    iconName: "icon-emotionsratings",
    widgetIsLoaded: function () {
      return typeof $ == "function" && !!$.fn.emotionsRating;
    },
    defaultJSON: {
      choices: [1, 2, 3, 4, 5],
    },
    isFit: function (question) {
      return question.getType() === "emotionsratings";
    },
    isDefaultRender: false,
    htmlTemplate: "<div style='height: 33px'></div>",
    activatedByChanged: function (activatedBy) {
      Survey.JsonObject.metaData.addClass(
        "emotionsratings",
        [
          {
            name: "hasOther",
            visible: false,
          },
          {
            name: "otherText",
            visible: false,
          },
          {
            name: "optionsCaption",
            visible: false,
          },
          {
            name: "otherErrorText",
            visible: false,
          },
          {
            name: "storeOthersAsComment",
            visible: false,
          },
          {
            name: "renderAs",
            visible: false,
          },
        ],
        null,
        "dropdown"
      );
      Survey.JsonObject.metaData.addProperties("emotionsratings", [
        {
          name: "emotions:itemvalues",
          category: "emotions",
          categoryIndex: 1,
          default: ["angry", "disappointed", "meh", "happy", "inLove"],
        },
        {
          name: "emotionSize:number",
          category: "emotions",
          default: 30,
        },
        {
          name: "emotionsCount:number",
          category: "emotions",
          default: 5,
        },
        {
          name: "bgEmotion",
          category: "emotions",
          default: "happy",
        },
        {
          name: "emotionColor",
          category: "emotions",
          default: "#FF0066",
        },
      ]);
    },
    afterRender: function (question, el) {
      var emotions = (question.emotions || []).map(function (item) {
        return item.value;
      });
      if (emotions.length === 0) {
        emotions = ["angry", "disappointed", "meh", "happy", "inLove"];
      }
      var options = {
        emotionSize: question.emotionSize,
        bgEmotion: question.bgEmotion,
        emotions: emotions,
        initialRating: question.value,
        color: question.emotionColor,
        count: question.emotionsCount,
        onUpdate: function (value) {
          question.value = value;
        },
      };
      initWidget();

      question.valueChangedCallback = initWidget;
      question.readOnlyChangedCallback = initWidget;

      function initWidget() {
        el.innerHTML = "<div></div>";
        $(el).off();
        options.initialRating = question.value || 0;
        options.disabled = question.isReadOnly;
        $(el).find("div").emotionsRating(options);
      }
    },
    willUnmount: function (question, el) {
      el.innerHTML = null;
      $(el).off();
      question.readOnlyChangedCallback = null;
      question.valueChangedCallback = null;
    },
    pdfQuestionType: "dropdown",
  };

  Survey.CustomWidgetCollection.Instance.addCustomWidget(widget, "customtype");
}

if (typeof Survey !== "undefined") {
  init(Survey, window.$);
}

export default init;
