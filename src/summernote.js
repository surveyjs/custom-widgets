function init(Survey) {
  const iconId = "icon-editor";
  Survey.SvgRegistry && Survey.SvgRegistry.registerIconFromSvg(iconId, require('svg-inline-loader!./images/editor.svg'), "");
  var widget = {
    name: "summernote",
    title: "Editor",
    iconName: iconId,
    widgetIsLoaded: function () {
      return typeof $ == "function" && !!$.fn.summernote;
    },
    isFit: function (question) {
      return question.getType() === "summernote";
    },
    htmlTemplate:
      '<textarea class="form-control widget-summernote" rows="10" cols="80" style: {width:"100%"}></textarea>',
    activatedByChanged: function (activatedBy) {
      Survey.JsonObject.metaData.addClass("summernote", [], null, "text");
      Survey.JsonObject.metaData.addProperties("summernote",[ 
        // {
        //   name: "height",
        //   default: 300,
        //   category: "general",
        // },
        {
          name: "lang",
          default: "en",
          category: "general"
        },
        {
          name: "placeholder",
          default: "",
          category: "general"
        },
        {
          name: "toolbar",
          default: [
            ['style', ['bold', 'italic', 'underline', 'clear']],
            ['para', ['ul', 'ol', 'paragraph']]
          ],
          category:"general"
        },
        {
          name:"hint",
          default: {},
          category:"general"
        },
        {
          name: "disableDragAndDrop:boolean",
          default: true,
          category:"general"
        },        
        {
          name: "shortcuts:boolean",
          default: false,
          category:"general"
        },
        {
          name: "codeviewFilter:boolean",
          default: true,
          category:"general"
        },
        {
          name: "codeviewIFrameFilter:boolean",
          default: true,
          category:"general"
        }
      ]);
    },
    afterRender: function (question, el) {
      var $el = $(el).is('.widget-summernote') 
        ? $(el) 
        : $(el).find('.widget-summernote');
      const options = {
        lang: question.language,
        placeholder: question.placeholder,
        toolbar: [['style', ['bold', 'italic', 'underline', 'clear']],
        ['para', ['ul', 'ol', 'paragraph']]]
      };
      const summernoteWidget = $el.summernote(options).on("summernote.change", function (we, contents, $editable) {
        if (question.value != contents) {
          question.value = contents;
        }
      });

      question.valueChangedCallback = function () {
        var oldValue = summernoteWidget.summernote('code');
        if(oldValue != question.value)
         summernoteWidget.summernote(
           "code",
           !!question.value ? question.value : ""
         );
      };
      question.valueChangedCallback();
      question.readOnlyChangedCallback = function () {
        if (question.isReadOnly) {
          summernoteWidget.summernote('disable');
        } else {
          summernoteWidget.summernote('enable');
        }
      };
      question.readOnlyChangedCallback();

    },
    willUnmount: function (question, el) {
      var $el = $(el).is(".widget-summernote")
        ? $(el)
        : $(el).find(".widget-summernote");
      $el.summernote("destroy");
      question.valueChangedCallback = null;
      question.readOnlyChangedCallback = null;
    },
    pdfQuestionType: "text",
    // pdfRender: function (survey, options) {
    //   if (options.question.getType() === "editor") {
    //     const loc = new Survey.LocalizableString(survey, true);
    //     loc.text = options.question.value || options.question.defaultValue;
    //     options.question["locHtml"] = loc;
    //     if (
    //       options.question.renderAs === "standard" ||
    //       options.question.renderAs === "image"
    //     ) {
    //       options.question["renderAs"] = options.question.renderAs;
    //     } else options.question["renderAs"] = "auto";
    //     const flatHtml = options.repository.create(
    //       survey,
    //       options.question,
    //       options.controller,
    //       "html"
    //     );
    //     return new Promise(function (resolve) {
    //       flatHtml.generateFlats(options.point).then(function (htmlBricks) {
    //         options.bricks = htmlBricks;
    //         resolve();
    //       });
    //     });
    //   }
    // },
  };

  Survey.CustomWidgetCollection.Instance.addCustomWidget(widget, "customtype");
}

if (typeof Survey !== "undefined") {
  init(Survey);
}

export default init;
