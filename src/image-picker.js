function init(Survey, $) {
  $ = $ || window.$;
  var widget = {
    name: "imagepicker",
    title: "Image picker",
    iconName: "icon-imagepicker",
    widgetIsLoaded: function() {
      return !!$.fn.imagepicker;
    },
    isFit: function(question) {
      return question.getType() === "imagepicker";
    },
    isDefaultRender: true,
    activatedByChanged: function(activatedBy) {
      Survey.JsonObject.metaData.addClass(
        "imageitemvalues",
        [],
        null,
        "itemvalue"
      );
      Survey.JsonObject.metaData.addProperty("imagepicker", {
        name: "imageLink"
      });
      Survey.JsonObject.metaData.addClass(
        "imagepicker",
        [
          { name: "hasOther", visible: false },
          { name: "otherText", visible: false },
          { name: "optionsCaption", visible: false },
          { name: "otherErrorText", visible: false },
          { name: "storeOthersAsComment", visible: false },
          { name: "renderAs", visible: false }
        ],
        null,
        "dropdown"
      );
      Survey.JsonObject.metaData.addProperty("imagepicker", {
        name: "showLabel:boolean",
        default: false
      });
      Survey.JsonObject.metaData.addProperty("imagepicker", {
        name: "choices:imageitemvalues",
        onGetValue: function(obj) {
          return Survey.ItemValue.getData(obj.choices);
        },
        onSetValue: function(obj, value) {
          obj.choices = value;
        }
      });
    },
    afterRender: function(question, el) {
      var $el = $(el).is("select") ? $(el) : $(el).find("select");
      var options = $el.find("option");
      var choices = question.choices;

      for (var i = 1; i < options.length && i - 1 < choices.length; i++) {
        $(options[i]).data("imgSrc", choices[i - 1].imageLink);
        options[i].selected = question.value == options[i].value;
      }
      $el.imagepicker({
        hide_select: true,
        show_label: question.showLabel,
        selected: function(opts) {
          question.value = opts.picker.select[0].value;
        }
      });
    },
    willUnmount: function(question, el) {
      var $el = $(el).find("select");
      $el.data("picker").destroy();
    }
  };

  Survey.CustomWidgetCollection.Instance.addCustomWidget(widget, "customtype");
}

if (typeof Survey !== "undefined") {
  init(Survey, window.$);
}

export default init;
