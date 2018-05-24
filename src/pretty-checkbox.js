function init(Survey) {
  const widget = {
    settings: {
      supportedTypes: ["radiogroup", "checkbox", "boolean", "matrix"],
      radiogroup: {
        rootClass: "pretty p-default p-round",
        states: [{ stateClass: "state p-success", addOn: "" }]
      },
      checkbox: {
        rootClass: "pretty p-default",
        states: [{ stateClass: "state p-success", addOn: "" }]
      },
      boolean: {
        rootClass: "pretty p-icon p-default p-has-indeterminate",
        states: [
          { stateClass: "state p-success", addOn: "" },
          {
            stateClass: "state p-success p-is-indeterminate",
            iconClass: "icon mdi mdi-minus",
            addOn: ""
          }
        ]
      },
      matrix: {
        rootClass: "pretty p-default p-round",
        states: [{ stateClass: "state p-success", addOn: "" }]
      }
    },
    name: "pretty-checkbox",
    activatedBy: "property",
    widgetIsLoaded: function() {
      return true;
    },
    isFit: function(question) {
      const isFitByType =
        widget.settings.supportedTypes.indexOf(question.getType()) !== -1;

      if (widget.activatedBy === "property") {
        return question["renderAs"] === "prettycheckbox" && isFitByType;
      } else if (widget.activatedBy === "type") {
        return isFitByType;
      }

      return false;
    },
    activatedByChanged: function(value) {
      if (this.widgetIsLoaded()) {
        widget.activatedBy = value;
        widget.settings.supportedTypes.forEach(function(supportedType) {
          Survey.JsonObject.metaData.removeProperty(supportedType, "renderAs");

          if (value === "property") {
            Survey.JsonObject.metaData.addProperty(supportedType, {
              name: "renderAs",
              default: "standard",
              choices: ["standard", "prettycheckbox"]
            });
          }
        });
      }
    },
    isDefaultRender: true,
    afterRender: function(question, element) {
      var questionType = question.getType();
      var settings = this.settings[questionType];

      var labels = element.querySelectorAll("label");

      labels.forEach(function(label) {
        label.classList.add("pretty");
        label.classList.add("p-default");
        label.className = settings.rootClass;

        settings.states.forEach(function(state) {
          var prettyStateEl = document.createElement("span");
          prettyStateEl.className = state.stateClass;
          prettyStateEl.appendChild(document.createElement("label"));

          if (!!state.iconClass) {
            const icon = document.createElement("i");
            icon.className = state.iconClass;
            prettyStateEl.appendChild(icon);

            if (questionType === "boolean") {
              prettyStateEl.style.position = "absolute";
              prettyStateEl.style.top = 0;
            }
          }

          label.appendChild(prettyStateEl);
        });

        label.querySelector("input").style.position = "relative";
        label.querySelector("input").style.marginTop = "-1em";

        if (questionType === "matrix") {
          label.style.position = "relative";
        }
      });
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
