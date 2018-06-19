function init(Survey) {
    // $ = $ || window.$;
     var widget = {
         name: "bootstrapdatepicker",
         title: "Date picker",
         iconName: "icon-datepicker",
         widgetIsLoaded: function () {
             return !!$.fn.datepicker;
         },
         isFit: function (question) {
             return question.getType() === "bootstrapdatepicker";
         },
         htmlTemplate:
         "<input class='form-control widget-datepicker' type='text' style='width: 100%;'>",
         activatedByChanged: function (activatedBy) {
             Survey.JsonObject.metaData.addClass(
                 "bootstrapdatepicker",
                 [
                     { name: "inputType", visible: false },
                     { name: "inputFormat", visible: false },
                     { name: "inputMask", visible: false }
                 ],
                 null,
                 "text"
             );
             Survey.JsonObject.metaData.addProperty("bootstrapdatepicker", {
                 name: "dateFormat"
             });
         },
         afterRender: function (question, el) {
             var $el = $(el).is(".widget-datepicker")
                 ? $(el)
                 : $(el).find(".widget-datepicker");
 
             var pickerWidget = $(".widget-datepicker").datepicker({
               enableOnReadonly: false
             })
                 .on("changeDate", function (e) {
                     question.value = moment(e.date).format("DD/MM/YYYY");
                     // `e` here contains the extra attributes
               });
 
             question.valueChangedCallback = function() {
               $(".widget-datepicker").datepicker('update', moment(question.value, "DD/MM/YYYY").toDate());
             }
             question.valueChangedCallback();
             question.readOnlyChangedCallback = function() {
               if(question.isReadOnly) {
                 $el.prop('readonly', true);
               }
               else {
                 $el.removeAttr('readonly');
               }
             }
             question.readOnlyChangedCallback();
             
         },
         willUnmount: function (question, el) {
             var $el = $(el).is(".widget-datepicker")
                 ? $(el)
                 : $(el).find(".widget-datepicker");
             $el.datepicker("destroy");
             question.readOnlyChangedCallback = undefined;
             question.valueChangedCallback = undefined;
         }
     };
 
     Survey.CustomWidgetCollection.Instance.addCustomWidget(widget, "customtype");
 }
 
 if (typeof Survey !== "undefined") {
    init(Survey, window.$);
 }
 
 export default init;