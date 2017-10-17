import "./utils/surveyjs_importer.js";

var widget = {
    className: "iradio_square-blue",
    name: "icheck",
    isFit : function(question) {  var t = question.getType(); return t === 'radiogroup' || t === 'checkbox' || t === 'matrix'; },
    isDefaultRender: true,
    afterRender: function(question, el) {
        var $el = $(el);
        $(el).find('input').data({"iCheck": undefined});
        $el.find('input').iCheck({
          checkboxClass: widget.className,
          radioClass: widget.className
        });
        var select = function() {
            if(question.getType() != "matrix") {
                $el.find("input[value=" + question.value + "]").iCheck('check');
            } else {
                question.generatedVisibleRows.forEach(function(row, index, rows) {
                    if (row.value) {
                      $(el).find("input[name='" + row.fullName  + "'][value=" + row.value + "]").iCheck('check');
                    }
                  });                
            }
        }
        $el.find('input').on('ifChecked', function(event) {
            if(question.getType() != "matrix") {
                question.value = event.target.value;
            } else {
                question.generatedVisibleRows.forEach(function(row, index, rows) {
                    if (row.fullName === event.target.name) {
                      row.value = event.target.value
                    }
                });
            }
        });
        question.valueChangedCallback = select;
        select();
    },
    willUnmount: function(question, el) {
        var $el = $(el);
        $el.find('input').iCheck('destroy');
    } 
}

Survey.CustomWidgetCollection.Instance.addCustomWidget(widget, "type");