import "./utils/surveyjs_importer.js";

var widget = {
    name: "imagepicker",
    isFit : function(question) { return question.getType() === 'imagepicker'; },
    isDefaultRender: true,
    activatedByChanged: function(activatedBy) {
        Survey.JsonObject.metaData.addClass("imageitemvalues", [{name: "imageLink"}], null, "itemvalue");
        Survey.JsonObject.metaData.addClass("imagepicker", ["choices:imageitemvalues", {name:"showLabel:boolean", default: false}], null, "dropdown");
    },
    afterRender: function(question, el) {
        var $el = $(el).is("select") ? $(el) : $(el).find("select");
        var options = $el.find('option');
        for (var i=1; i<options.length; i++) {
            $(options[i]).data("imgSrc", options[i].text);
            options[i].selected = question.value == options[i].value;
        }
        $el.imagepicker({
            hide_select : true,
            show_label  : question.showLabel,
            selected: function(opts) {
                question.value = opts.picker.select[0].value;
            }
        })
    },
    willUnmount: function(question, el) {
        var $el = $(el).find("select");
        $el.data('picker').destroy();
    } 
}

Survey.CustomWidgetCollection.Instance.addCustomWidget(widget, "customtype");