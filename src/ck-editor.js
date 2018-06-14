function init(Survey) {
  var widget = {
    name: "editor",
    title: "Editor",
    iconName: "icon-editor",
    widgetIsLoaded: function() {
      return typeof CKEDITOR != "undefined";
    },
    isFit: function(question) {
      return question.getType() === "editor";
    },
    htmlTemplate:
      "<textarea rows='10' cols='80' style: {width:'100%'}></textarea>",
    activatedByChanged: function(activatedBy) {
      Survey.JsonObject.metaData.addClass("editor", [], null, "empty");
      Survey.JsonObject.metaData.addProperty("editor", {
        name: "height",
        default: 300
      });
    },
    afterRender: function(question, el) {
      CKEDITOR.editorConfig = function(config) {
        config.language = "es";
        config.height = question.height;
        config.toolbarCanCollapse = true;
      };
      var editor = CKEDITOR.replace(el);
      CKEDITOR.instances.editor1.config.readOnly = question.isReadOnly;

      var isValueChanging = false;
      var updateValueHandler = function() {
        if (isValueChanging) return;
        editor.setData(question.value);
      };
      editor.on("change", function() {
        isValueChanging = true;
        question.value = editor.getData();
        isValueChanging = false;
      });

      question.valueChangedCallback = updateValueHandler;
      question.readOnlyChangedCallback = function() {
        if (question.isReadOnly) {
          editor.setReadOnly(true);
        } else {
          editor.setReadOnly(false);
        }
      };
      updateValueHandler();
    },
    willUnmount: function(question, el) {
      question.readOnlyChangedCallback = null;
    }
  };

  Survey.CustomWidgetCollection.Instance.addCustomWidget(widget, "customtype");
}

if (typeof Survey !== "undefined") {
  init(Survey);
}

export default init;
