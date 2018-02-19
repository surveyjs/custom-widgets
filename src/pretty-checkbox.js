function init(Survey) {
  var widget = {
    settings: {
      radiogroup: {
        rootClass: "pretty p-default p-round",
        inputType: "radio",
        addOn: "",
        titleClass: "state p-success"
      },
      checkbox: {
        rootClass: "pretty p-default",
        inputType: "checkbox",
        addOn: "",
        titleClass: "state p-success"
      }
    },
    name: "pretty-checkbox",
    activatedBy: "property",
    widgetIsLoaded: function() {
      return true;
    },
    htmlTemplate: "<fieldset></fieldset>",
    isFit: function(question) {
      var isFitByType =
        question.getType() === "radiogroup" ||
        question.getType() === "checkbox";
      if (widget.activatedBy === "property")
        return question["renderAs"] === "prettycheckbox" && isFitByType;
      if (widget.activatedBy === "type") return isFitByType;
      return false;
    },
    activatedByChanged: function(activatedBy) {
      if (!this.widgetIsLoaded()) return;
      widget.activatedBy = activatedBy;
      Survey.JsonObject.metaData.removeProperty("radiogroup", "renderAs");
      Survey.JsonObject.metaData.removeProperty("checkbox", "renderAs");
      if (activatedBy === "property") {
        Survey.JsonObject.metaData.addProperty("radiogroup", {
          name: "renderAs",
          default: "standard",
          choices: ["standard", "prettycheckbox"]
        });
        Survey.JsonObject.metaData.addProperty("checkbox", {
          name: "renderAs",
          default: "standard",
          choices: ["standard", "prettycheckbox"]
        });
      }
    },
    isDefaultRender: false,
    afterRender: function(question, el) {
      var itemInputs = {};
      var options = this.settings[question.getType()];
      var inChangeHandler = false;
      var changeHandler = function(event) {
        inChangeHandler = true;
        try {
          var value = arguments[0].target.value;
          if (question.getType() === "checkbox") {
            var qValue = question.value || [];
            if (arguments[0].target.checked) {
              if (qValue.indexOf(value) === -1) {
                qValue.push(value);
              }
            } else {
              if (qValue.indexOf(value) !== -1) {
                qValue.splice(qValue.indexOf(value), 1);
              }
            }
            question.value = qValue;
          } else {
            question.value = value;
          }
        } finally {
          inChangeHandler = false;
        }
      };
      var itemWidth =
        question.colCount > 0 ? 100 / question.colCount + "%" : "";
      question.choices.forEach(function(choiceItem, index) {
        var itemRoot = document.createElement("div");
        itemRoot.className = "sv_cw_pretty_checkbox_" + question.getType();
        itemRoot.style.display = "inline-block";
        itemRoot.style.width = itemWidth;
        var controlRoot = document.createElement("div");
        controlRoot.className = options.rootClass;
        var input = document.createElement("input");
        input.type = options.inputType;
        input.name =
          question.name + (question.getType() === "checkbox" ? "" + index : "");
        input.onchange = changeHandler;
        input.value = choiceItem.value;
        var titleRoot = document.createElement("div");
        titleRoot.className = options.titleClass;
        var label = document.createElement("label");
        label.textContent = choiceItem.text;
        titleRoot.appendChild(label);
        controlRoot.appendChild(input);
        controlRoot.appendChild(titleRoot);
        if (!!options.addOn) {
          titleRoot.insertAdjacentHTML("afterbegin", options.addOn);
        }
        itemRoot.appendChild(controlRoot);
        el.appendChild(itemRoot);

        itemInputs[choiceItem.value] = input;
      });
      var updateValueHandler = function(newValue) {
        if (!inChangeHandler) {
          var checkedItems = newValue || [];
          if (question.getType() === "radiogroup") {
            checkedItems = [newValue];
          }
          Object.values(itemInputs).forEach(function(inputItem) {
            if (checkedItems.indexOf(inputItem.value) !== -1) {
              inputItem.setAttribute("checked", undefined);
            } else {
              inputItem.removeAttribute("checked");
            }
          });
        }
      };
      question.valueChangedCallback = updateValueHandler;
      updateValueHandler(question.value);
    },
    willUnmount: function(question, el) {
      question.valueChangedCallback = undefined;
    }
  };

  Survey.CustomWidgetCollection.Instance.addCustomWidget(widget, "property");
}

if (typeof Survey !== "undefined") {
  init(Survey);
}

export default init;
