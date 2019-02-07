function init(Survey, $) {
  $ = $ || window.$;
  var widget = {
  name: "tagbox",
  title: "Tag box",
  iconName: "icon-tagbox",
  widgetIsLoaded: function() {
    return typeof $ == "function" && !!$.fn.select2;
  },
  defaultJSON: {
    choices: ["Item 1", "Item 2", "Item 3"],
    url: ""
  },
  htmlTemplate: "<select multiple='multiple' style='width: 100%;'></select>",
  isFit: function(question) {
    return question.getType() === "tagbox";
  },
  activatedByChanged: function(activatedBy) {
    Survey.JsonObject.metaData.addClass(
      "tagbox", [{
        name: "hasOther",
        visible: false
      }],
      null,
      "checkbox"
    );
    Survey.JsonObject.metaData.addProperty("tagbox", {
      name: "select2Config",
      default: null
    });
  },
  fixStyles: function(el) {
    el.parentElement.querySelector(".select2-search__field").style.border =
      "none";
  },
  afterRender: function(question, el) {
    var self = this;
    console.log(question)
    var settings = {
        minimumInputLength: 3,
        ajax: {
          delay: 250,
          url: 'https://api.stackexchange.com/2.2/questions',
          data: function(params) {
            var query = {
              tagged: params.term,
              site: 'stackoverflow',
              order: 'desc',
              page: params.page || 1
            }
            return query;
          },
          processResults: function(data) {
            return {
              results: data.items.map(function(dataItem) {
                return {
                  id: dataItem.link,
                  text: dataItem.title
                }
              })
            };
          }
        },
      }
    var $el = $(el).is("select") ? $(el) : $(el).find("select");
    $el.select2({
      tags: "true",
      disabled: question.isReadOnly,
      theme: "classic"
    });

    self.fixStyles(el);

    var updateValueHandler = function() {
      $el.val(question.value).trigger("change");
      self.fixStyles(el);
    };
    var updateChoices = function() {
      $el.select2().empty();
      console.log(settings)

      if (settings) {
        if (settings.ajax) {
          $el.select2(settings);
        } else {
          settings.data = question.visibleChoices.map(function(choice) {
            return {
              id: choice.value,
              text: choice.text
            };
          });
          $el.select2(settings);
        }
      } else {
        $el.select2({
          data: question.visibleChoices.map(function(choice) {
            return {
              id: choice.value,
              text: choice.text
            };
          })
        });
      }

      updateValueHandler();
    };

    question.readOnlyChangedCallback = function() {
      $el.prop("disabled", question.isReadOnly);
    };
    question.registerFunctionOnPropertyValueChanged(
      "visibleChoices",
      function() {
        updateChoices();
      }
    );
    question.valueChangedCallback = updateValueHandler;
    $el.on("select2:select", function(e) {
      question.value = (question.value || []).concat(e.params.data.id);
    });
    $el.on("select2:unselect", function(e) {
      var index = (question.value || []).indexOf(e.params.data.id);
      if (index !== -1) {
        var val = question.value;
        val.splice(index, 1);
        question.value = val;
      }
    });
    updateChoices();
  },
  willUnmount: function(question, el) {
    $(el)
      .find("select")
      .off("select2:select")
      .select2("destroy");
    question.readOnlyChangedCallback = null;
  }
};

  Survey.CustomWidgetCollection.Instance.addCustomWidget(widget, "customtype");
}

if (typeof Survey !== "undefined") {
  init(Survey, window.$);
}

export default init;
