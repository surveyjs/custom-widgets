import * as SignaturePad from 'signature_pad';

function init(Survey) {
    var widget = {
        name: "signaturepad",
        title: "Signature pad",
        iconName: "icon-signaturepad",
        widgetIsLoaded: function() { return typeof SignaturePad !== undefined; },
        penColor: "1ab394",
        isFit : function(question) { return question.getType() === 'signaturepad'; },
        htmlTemplate: "<div></div>",
        activatedByChanged: function(activatedBy) {
            Survey.JsonObject.metaData.addClass("signaturepad", [], null, "empty");
            Survey.JsonObject.metaData.addProperties("signaturepad", [{name: "width:number", default: 300}, {name: "height:number", default: 200}]);
        },
        afterRender: function(question, el) {
            var rootWidget = this;
            var canvas = document.createElement('canvas');
            canvas.width  = question.width;
            canvas.height = question.height;        
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
}

if (typeof Survey !== "undefined") {
    init(Survey);
}

export default init;