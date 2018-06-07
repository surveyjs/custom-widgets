function init(Survey, $) {
    $ = $ || window.$;
  
    var widget = {
      name: "emotionsratings",
      title: "Emotions Ratings",
      iconName: "icon-emotionsratings",
      widgetIsLoaded: function() {
        return !!$.fn.emotionsRating;
      },
      defaultJSON: {
        choices: [1, 2, 3, 4, 5]
      },
      isFit: function(question) {
        return question.getType() === "emotionsratings";
      },
      isDefaultRender: false,
      htmlTemplate: "<div><div></div></div>",
      activatedByChanged: function(activatedBy) {
        Survey.JsonObject.metaData.addClass(
          "emotionsratings", [{
              name: "hasOther",
              visible: false
            },
            {
              name: "otherText",
              visible: false
            },
            {
              name: "optionsCaption",
              visible: false
            },
            {
              name: "otherErrorText",
              visible: false
            },
            {
              name: "storeOthersAsComment",
              visible: false
            },
            {
              name: "renderAs",
              visible: false
            }
          ],
          null,
          "dropdown"
        );
      },
      afterRender: function(question, el) {
        var self = this;
        var emotionsArray = ['angry', 'disappointed', 'meh', 'happy', 'inLove'];
        var options = {
          emotionSize: 30,
          bgEmotion: 'happy',
          emotions: emotionsArray,
          color: '#FF0066',
          initialRating: question.value,
          disabled: false,
          onUpdate: function(value) {
            question.value = value;
          }
        };
        $(el).find("div").emotionsRating(options);
        question.valueChangedCallback = function() {
          el.innerHTML = "<div></div>";
          options.initialRating = question.value;
          $(el).find("div").emotionsRating(options);
        };
      },
      willUnmount: function(question, el) {
        el.innerHTML = null;
        $(el).off();
      }
    };
  
    Survey.CustomWidgetCollection.Instance.addCustomWidget(widget, "customtype");
  }
  
  if (typeof Survey !== "undefined") {
    init(Survey, window.$);
  }
  