function init(Survey) {
  var widget = {
    name: "autocomplete",
    title: "Autocomplete",
    iconName: "icon-autocomplete",
    widgetIsLoaded: function() {
      return typeof $ === "function" && !!$.fn.easyAutocomplete;
    },
    defaultJSON: {},
    isFit: function(question) {
      return question.getType() === "text";
    },
    isDefaultRender: true,
    activatedByChanged: function(activatedBy) {
      if (
        Survey.JsonObject.metaData.findProperty("text", "choices") !== null ||
        Survey.JsonObject.metaData.findProperty("text", "choicesByUrl") !== null
      ) {
        return;
      }
      Survey.JsonObject.metaData.addProperty("text", {
        name: "choices:itemvalues",
        onGetValue: function(obj) {
          return ItemValue.getData(obj.choices);
        },
        onSetValue: function(obj, value) {
          obj.choices = value;
        }
      });
      Survey.JsonObject.metaData.addProperty("text", {
        name: "choicesByUrl:restfull",
        className: "ChoicesRestfull",
        onGetValue: function(obj) {
          return obj.choicesByUrl.getData();
        },
        onSetValue: function(obj, value) {
          if (!obj.choicesByUrl) {
            obj.choicesByUrl = new Survey.ChoicesRestfull();
          }
          obj.choicesByUrl.setData(value);
        }
      });
    },
    afterRender: function(question, el) {
      var $el = $(el).is("input") ? $(el) : $(el).find("input");
      var options = {
        data: question.choices,
        placeholder: question.placeholder
      };
      if (!!question.choicesByUrl) {
        options.url = function(phrase) {
          return question.choicesByUrl.url;
        };
        options.getValue = question.choicesByUrl.valueName;
        // options.ajaxSettings = {
        //   dataType: "jsonp"
        // };
      }
      $el.easyAutocomplete(options);
    },
    willUnmount: function(question, el) {
      // var $el = $(el).find("input");
      // $el.autocomplete("destroy");
    }
  };

  Survey.CustomWidgetCollection.Instance.addCustomWidget(widget, "customtype");
}

if (typeof Survey !== "undefined") {
  init(Survey);
}

export default init;
