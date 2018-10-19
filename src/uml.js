var pako = require('pako');

function init(Survey) {
  var widget = {
    name: "uml",
    title: "uml",
    iconName: "icon-uml",
    widgetIsLoaded: function () {
      return true;
      //     return typeof Slider !== "undefined";
    },
    isFit: function (question) {
      return question.getType() === "uml";
    },
    htmlTemplate: '<div class="container"><div class="row"><div class="col"><textarea/></div><div class="col"><div class="output"><img id="photo" alt="The screen capture will appear in this box."><button id="sendbutton">Select this diagram</button></div></div></div>',
    activatedByChanged: function (activatedBy) {
      Survey.JsonObject.metaData.addClass("uml", [], null, "empty");
      Survey.JsonObject.metaData.addProperties("uml", [
        /*{
           name: "width:number",
           default: 1
         },
         {
           name: "height:number",
           default: 0
         }*/
      ]);
    },
    afterRender: function (question, el) {
      //el.firstChild.firstChild.firstChild.value ='toto';
      var textArea = el.firstChild.firstChild.firstChild;
      var photo = el.firstChild.childNodes[1].firstChild.firstChild;
      textArea.addEventListener('input', function() {
        var value = textArea.value;
        var s = decodeURIComponent(encodeURIComponent(value));
        //$(this).attr("src", "http://www.plantuml.com/plantuml/img/"+encode64(value));
        var res = encode64(pako.deflate(s, {
          raw: true,
          to: 'string'
        }));
        //console.log(res);
        if (res != 'SyfFqYssSyp9J4vLi5B8ICt9oIy60000')
          photo.setAttribute('src', "http://www.plantuml.com/plantuml/png/" + res);
        question.value = value;
      });


      function encode64(data) {
        var r = '';
        for (var i = 0; i < data.length; i += 3) {
          if (i + 2 == data.length) {
            r += append3bytes(data.charCodeAt(i), data.charCodeAt(i + 1), 0);
          } else if (i + 1 == data.length) {
            r += append3bytes(data.charCodeAt(i), 0, 0);
          } else {
            r += append3bytes(data.charCodeAt(i), data.charCodeAt(i + 1), data.charCodeAt(i + 2));
          }
        }
        return r;
      }

      function append3bytes(b1, b2, b3) {
        var c1 = b1 >> 2;
        var c2 = ((b1 & 0x3) << 4) | (b2 >> 4);
        var c3 = ((b2 & 0xF) << 2) | (b3 >> 6);
        var c4 = b3 & 0x3F;
        var r = '';
        r += encode6bit(c1 & 0x3F);
        r += encode6bit(c2 & 0x3F);
        r += encode6bit(c3 & 0x3F);
        r += encode6bit(c4 & 0x3F);
        return r;
      }

      function encode6bit(b) {
        if (b < 10) {
          return String.fromCharCode(48 + b);
        }
        b -= 10;
        if (b < 26) {
          return String.fromCharCode(65 + b);
        }
        b -= 26;
        if (b < 26) {
          return String.fromCharCode(97 + b);
        }
        b -= 26;
        if (b == 0) {
          return '-';
        }
        if (b == 1) {
          return '_';
        }
        return '?';
      }
    },
    willUnmount: function (question, el) {}
  };

  Survey.CustomWidgetCollection.Instance.addCustomWidget(widget, "customtype");
}

if (typeof Survey !== "undefined") {
  init(Survey);
}

export default init;