import "./surveyjs_importer.js";

var widget = {
    name: "signaturepad",
    penColor: "1ab394",
    isFit : function(question) { return question.getType() === 'signaturepad'; },
    activatedByChanged: function(activatedBy) {
        Survey.JsonObject.metaData.addClass("signaturepad", [], null, "text");
    },
    afterRender: function(question, el) {
        var rootWidget = this;
        var canvas = document.createElement('canvas');
        canvas.width  = 300;
        canvas.height = 200;        
        el.appendChild(canvas);
        var signaturePad = new SignaturePad(canvas);
        if(question.isReadOnly) {
            signaturePad.off();
        }
        signaturePad.penColor = rootWidget.penColor;
        signaturePad.onEnd = function() {
            var data = signaturePad.toDataURL();
            question.value = data;
        }
        var updateValueHandler = function() {
            signaturePad.fromDataURL(question.value);
        };
        question.valueChangedCallback = updateValueHandler;
        updateValueHandler();
        question.signaturePad = signaturePad;
    },
    willUnmount: function(question, el) {
        if(question.signaturePad) {
            question.signaturePad.off();
        }
        question.signaturePad = null;
    } 
}

Survey.CustomWidgetCollection.Instance.addCustomWidget(widget, "customtype");