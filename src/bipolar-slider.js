// Example see https://next.plnkr.co/plunk/LBGcb6xZt7mUQ5FP

function init(Survey) {
  var widget = {
    name: "bipolarslider",
    title: "Bipolar slider",
    isFit: function (question) {
      return question.getType() === 'bipolarslider';
    },
    activatedByChanged: function (activatedBy) {

      Survey.JsonObject.metaData.addClass("bipolarslider", [], null, "text");

      Survey.JsonObject.metaData.addProperties("bipolarslider", [
          { name: "leftText", default: "Text to the left" }
      ]);
      Survey.JsonObject.metaData.addProperties("bipolarslider", [
          { name: "rightText", default: "Text to the right" }
      ]);

      Survey.JsonObject.metaData.addProperties("bipolarslider", [
          { name: "min", default: 0 }
      ]);

      Survey.JsonObject.metaData.addProperties("bipolarslider", [
          { name: "max", default: 100 }
      ]);

      Survey.JsonObject.metaData.addProperties("bipolarslider", [
          { name: "step", default: 1 }
      ]);
    },

    isDefaultRender: false,

    htmlTemplate: "<div class='sjs_bipolarslider_container'><span class='sjs_bipolarslider_left_text sjs_bipolarslider_text'></span><input class='sjs_bipolarslider_input' type='range'/><span class='sjs_bipolarslider_right_text sjs_bipolarslider_text'></span></div>",

    afterRender: function (question, el) {
      var slider = el.getElementsByTagName("input")[0];

      // Set the minimum and maximum of the slider
      slider.setAttribute('min', question.min);
      slider.setAttribute('max', question.max);
      slider.setAttribute('step', question.step);

      // Set the caption for left and right
      var left = el.getElementsByTagName("span")[0];
      left.innerHTML = question.leftText;
      var right = el.getElementsByTagName("span")[1];
      right.innerHTML = question.rightText;

      //set the changed value into question value
      slider.onchange = function () {
          question.value = slider.value;
      }

      onValueChangedCallback = function () {
          slider.value = question.value ? question.value : "";
      }

      onReadOnlyChangedCallback = function() {
        if (question.isReadOnly) {
          slider.setAttribute('disabled', 'disabled');
        } else {
          slider.removeAttribute("disabled");
        }
      };

      question.readOnlyChangedCallback = onReadOnlyChangedCallback;
      question.valueChangedCallback = onValueChangedCallback;

      //set initial value
      onValueChangedCallback();

      //make elements disabled if needed
      onReadOnlyChangedCallback();
    }
  }

  Survey.CustomWidgetCollection.Instance.addCustomWidget(widget, "customtype");
}

if (typeof Survey !== "undefined") {
  init(Survey);
}

export default init;
