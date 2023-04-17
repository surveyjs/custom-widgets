function init(Survey) {
  const iconId = "icon-editor";
  Survey.SvgRegistry && Survey.SvgRegistry.registerIconFromSvg(iconId, require('svg-inline-loader!./images/editor.svg'), "");
  var widget = {
    name: "editor",
    title: "Editor",
    iconName: iconId,
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
      Survey.JsonObject.metaData.addProperties("editor",[ 
        {
          name: "height",
          default: 300,
          category: "general",
        },
        {
          name: "language",
          default: "en",
          category: "general"
        },
        {
          name: "defaultLanguage",
          default: "en",
          category: "general"
        }
      ]);
    },
    afterRender: function (question, el) {
      var name = question.inputId;
      CKEDITOR.editorConfig = function (config) {
        config.defaultLanguage = question.language;
        config.language = question.language;
        config.height = question.height;
        config.toolbarCanCollapse = true;

        // Define changes to default configuration here.
        // For complete reference see:
        // https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_config.html

        // The toolbar groups arrangement, optimized for two toolbar rows.
        config.toolbarGroups = [
          { name: 'clipboard',   groups: [ 'clipboard', 'undo' ] },
          // { name: 'editing',     groups: [ 'find', 'selection', 'spellchecker' ] },
          // { name: 'links' },
          // { name: 'insert' },
          // { name: 'forms' },
          { name: 'tools' },
          // { name: 'document',	   groups: [ 'mode', 'document', 'doctools' ] },
          // { name: 'others' },
          '/',
          { name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
          { name: 'paragraph',   groups: [ 'list', 'indent', 'blocks', 'align', 'bidi' ] },
          { name: 'styles' },
          { name: 'colors' }
          // { name: 'about' }
        ];

        // Remove some buttons provided by the standard plugins, which are
        // not needed in the Standard(s) toolbar.
        config.removeButtons = 'Underline,Subscript,Superscript';

        // Set the most common block elements.
        config.format_tags = 'p;h1;h2;h3;pre';

        // Simplify the dialog windows.
        config.removeDialogTabs = 'image:advanced;link:advanced';
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
      CKEDITOR.instances[question.inputId].destroy(false);
    },
    pdfRender: function (survey, options) {
      if (options.question.getType() === "editor") {
        const loc = new Survey.LocalizableString(survey, true);
        loc.text = options.question.value || options.question.defaultValue;
        options.question["locHtml"] = loc;
        if (
          options.question.renderAs === "standard" ||
          options.question.renderAs === "image"
        ) {
          options.question["renderAs"] = options.question.renderAs;
        } else options.question["renderAs"] = "auto";
        const flatHtml = options.repository.create(
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
