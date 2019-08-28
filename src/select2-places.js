function init(Survey, $) {
  $ = $ || window.$;
  var widget = {
    activatedBy: "property",
    name: "select2location",
    htmlTemplate: "<select style='width: 100%;'></select>",
    widgetIsLoaded: function() {
      return typeof $ == "function" && !!$.fn.select2;
    },
    isFit: function(question) {
      if (widget.activatedBy == "property")
        return (
          question["renderAs"] === "select2location" &&
          question.getType() === "dropdown"
        );
      if (widget.activatedBy == "type")
        return typeof question.getType() === "dropdown";
      if (widget.activatedBy == "customtype")
        return question.getType() === "select2location";
      return false;
    },
    activatedByChanged: function(activatedBy) {
      if (!this.widgetIsLoaded()) return;
      widget.activatedBy = activatedBy;
      Survey.JsonObject.metaData.removeProperty("dropdown", "renderAs");
      if (activatedBy == "property") {
        Survey.JsonObject.metaData.addProperty("dropdown", {
          name: "renderAs",
          default: "standard",
          choices: ["standard", "select2location"]
        });
      }
      if (activatedBy == "customtype") {
        Survey.JsonObject.metaData.addClass("select2location", [], null, "dropdown");
        Survey.JsonObject.metaData.addProperty("select2location", {
          name: "key",
          default: null
        });
      }
    },
    afterRender: function(question, el) {
      var settings = {
        minimumInputLength: 3,
        ajax: {
          delay: 250,
          url: 'https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/autocomplete/json',
          data: function(params) {
            var query = {
              input: params.term,
              key: "AIzaSyBYu3_ty09Y2J8XuIZaYEUQhTaCmWINkbI"
            }
            return query;
          },
          processResults: function(data) {
            return {
              results: data['predictions'].map(function(dataItem) {
                return {
                  id: dataItem.description,
                  text: dataItem.description
                }
              })
            };
          },
        }
    }
      var $el = $(el).is("select") ? $(el) : $(el).find("select");
      var othersEl = document.createElement("input");
      othersEl.type = "text";
      othersEl.style.marginTop = "3px";
      othersEl.style.display = "none";
      othersEl.style.width = "100%";
      $el
        .parent()
        .get(0)
        .appendChild(othersEl);

      var updateValueHandler = function() {
        // console.log('Value in updateValueHandler:', question.value)
        // console.log('Element HTML:', $el.html())
        if ($el.find("option").length) {
          $el.val(question.value).trigger("change");
      } else {
          var newOption = new Option(
              question.value,
              question.value,
              true,
              true
            )
          $el.append(newOption)
          $el.val(question.value).trigger("change");
      }

        othersEl.style.display = !question.isOtherSelected ? "none" : "";
      };
      var updateCommentHandler = function() {
        othersEl.value = question.comment ? question.comment : "";
      };
      var othersElChanged = function() {
        question.comment = othersEl.value;
      };
      var updateChoices = function() {
        $el.select2().empty();

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
            theme: "classic",
            disabled: question.isReadOnly,
            data: question.visibleChoices.map(function(choice) {
              return {
                id: choice.value,
                text: choice.text
              };
            })
          });
        }
        // console.log('Value outside updateValueHandler', question.value)

        updateValueHandler();
        updateCommentHandler();
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
      updateChoices();
      $el.on("select2:select", function(e) {
        question.value = e.target.value;
      });
      $el.on("select2:unselecting", function(e) {
        question.value = null;
      });
      othersEl.onchange = othersElChanged;
      question.valueChangedCallback = updateValueHandler;
      question.commentChangedCallback = updateCommentHandler;
      updateValueHandler();
      updateCommentHandler();
    },
    willUnmount: function(question, el) {
      $(el)
        .find("select")
        .off("select2:select")
        .select2("destroy");
      question.readOnlyChangedCallback = null;
    }
  };

  Survey.CustomWidgetCollection.Instance.addCustomWidget(widget);
}

if (typeof Survey !== "undefined") {
  init(Survey, window.$);
}

export default init;
