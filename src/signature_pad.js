import * as SignaturePad from "signature_pad";

function init(Survey) {
  var widget = {
    name: "signaturepad",
    title: "Signature pad",
    iconName: "icon-signaturepad",
    widgetIsLoaded: function() {
      return typeof SignaturePad != "undefined";
    },
    penColor: "#1ab394",
    isFit: function(question) {
      return question.getType() === "signaturepad";
    },
    htmlTemplate:
      "<div class='sjs_sp_container'><div><canvas></canvas></div><div class='sjs_sp_controls'><button type='button' class='sjs_sp_clear' title='Clear'>✖</button></div></div><style>.sjs_sp_container { position: relative; } .sjs_sp_controls { position: absolute; left: 0; bottom: 0; } .sjs_sp_controls > button { user-select: none; }</style>",
    activatedByChanged: function(activatedBy) {
      Survey.JsonObject.metaData.addClass("signaturepad", [], null, "empty");
      Survey.JsonObject.metaData.addProperties("signaturepad", [
        { name: "allowClear:boolean", default: true },
        { name: "width:number", default: 300 },
        { name: "height:number", default: 200 }
      ]);
    },
    afterRender: function(question, el) {
      var rootWidget = this;
      var canvas = el.children[0].children[0];
      canvas.width = question.width;
      canvas.height = question.height;
      var signaturePad = new SignaturePad(canvas);
      if (question.isReadOnly) {
        signaturePad.off();
      }
      signaturePad.penColor = rootWidget.penColor;
      signaturePad.onEnd = function() {
        var data = signaturePad.toDataURL();
        question.value = data;
      };
      var updateValueHandler = function() {
        //signaturePad.clear();
        signaturePad.fromDataURL(question.value);
      };
      question.valueChangedCallback = updateValueHandler;
      updateValueHandler();
      question.signaturePad = signaturePad;
      if (question.allowClear) {
        el.children[1].children[0].onclick = function() {
          signaturePad.clear();
        };
      } else {
        el.children[1].children[0].remove();
      }
    },
    willUnmount: function(question, el) {
      if (question.signaturePad) {
        question.signaturePad.off();
      }
      question.signaturePad = null;
    }
  };

  Survey.CustomWidgetCollection.Instance.addCustomWidget(widget, "customtype");
}

if (typeof Survey !== "undefined") {
  init(Survey);
}

export default init;
