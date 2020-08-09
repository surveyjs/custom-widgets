function init(Survey) {
  var widget = {
    name: "editor",
    title: "Editor",
    iconName: "icon-editor",
    widgetIsLoaded: function () {
      return typeof CKEDITOR != "undefined";
    },
    isFit: function (question) {
      return question.getType() === "editor";
    },
    htmlTemplate:
      "<textarea rows='10' cols='80' style: {width:'100%'}></textarea>",
    activatedByChanged: function (activatedBy) {
      Survey.JsonObject.metaData.addClass("editor", [], null, "empty");
      Survey.JsonObject.metaData.addProperty("editor", {
        name: "height",
        default: 300,
        category: "general",
      });
    },
    afterRender: function (question, el) {
      var name = question.name;
      CKEDITOR.editorConfig = function (config) {
        config.language = "es";
        config.height = question.height;
        config.toolbarCanCollapse = true;
      };
      el.name = name;

      if (CKEDITOR.instances[name]) {
        CKEDITOR.instances[name].removeAllListeners();
        CKEDITOR.remove(CKEDITOR.instances[name]);
      }

      var editor = CKEDITOR.replace(el);
      CKEDITOR.instances[name].config.readOnly = question.isReadOnly;

      var isValueChanging = false;
      var updateValueHandler = function () {
        if (isValueChanging || typeof question.value === "undefined") return;
        editor.setData(question.value);
      };
      editor.on("change", function () {
        isValueChanging = true;
        question.value = editor.getData();
        isValueChanging = false;
      });

      question.valueChangedCallback = updateValueHandler;
      question.readOnlyChangedCallback = function () {
        if (question.isReadOnly) {
          editor.setReadOnly(true);
        } else {
          editor.setReadOnly(false);
        }
      };
      updateValueHandler();
    },
    willUnmount: function (question, el) {
      question.readOnlyChangedCallback = null;
      CKEDITOR.instances[question.name].destroy(false);
    },
    pdfRender: function (survey, options) {
      if (options.question.getType() === "editor") {
        var loc = new Survey.LocalizableString(survey, true);
        loc.text = options.question.value;
        options.question["locHtml"] = loc;
        options.question["renderAs"] = "auto";
        var flatHtml = options.repository.create(
          survey,
          options.question,
          options.controller,
          "html"
        );
        return new Promise(function (resolve) {
          flatHtml.generateFlats(options.point).then(function (htmlBricks) {
            options.bricks = htmlBricks;
            resolve();
          });
        });
      }
    },
  };

  Survey.CustomWidgetCollection.Instance.addCustomWidget(widget, "customtype");
}

if (typeof Survey !== "undefined") {
  init(Survey);
}

export default init;
