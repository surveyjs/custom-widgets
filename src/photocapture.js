//var Survey = require("surveyjs");

function init(Survey) {
  var widget = {
    name: "photocapture",
    title: "PhotoCapture",
    iconName: "icon-video-player",
    widgetIsLoaded: function() {
        return true;
 //     return typeof Slider !== "undefined";
    },
    isFit: function(question) {
      return question.getType() === "photocapture";
    },
    htmlTemplate: '<div class="container"><div class="row"><div class="col">    <div class="camera"><video id="video">Video stream not available.</video><button id="startbutton">Take photo</button></div><canvas id="canvas"></canvas></div><div class="col"><div class="output"><img id="photo" alt="The screen capture will appear in this box."><button id="sendbutton">Select photo</button></div></div></div>',
    activatedByChanged: function(activatedBy) {
      Survey.JsonObject.metaData.addClass("photocapture", [], null, "empty");
      Survey.JsonObject.metaData.addProperties("photocapture", [
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
    afterRender: function(question, el) {
        var width = 320;    // We will scale the photo width to this
        var height = 0;     // This will be computed based on the input stream
      
        // |streaming| indicates whether or not we're currently streaming
        // video from the camera. Obviously, we start at false.
      
        var streaming = false;
      
        // The various HTML elements we need to configure or control. These
        // will be set by the startup() function.
      
        var video = null;
        var canvas = null;
        var photo = null;
        var startbutton = null;
        var sendbutton = null;
        function startup() {
            console.log("error")
          video = document.getElementById('video');
          canvas = document.getElementById('canvas');
          photo = document.getElementById('photo');
          startbutton = document.getElementById('startbutton');
          sendbutton = document.getElementById('sendbutton');
          navigator.getMedia = ( navigator.getUserMedia ||
                                 navigator.webkitGetUserMedia ||
                                 navigator.mozGetUserMedia ||
                                 navigator.msGetUserMedia);
      
          navigator.getMedia(
            {
              video: true,
              audio: false
            },
            function(stream) {
              video.srcObject = stream;
              video.play();
              question.video = video;
            },
            function(err) {
              console.log("An error occured! " + err);
            }
          );
      
          video.addEventListener('canplay', function(ev){
            if (!streaming) {
              height = video.videoHeight / (video.videoWidth/width);
            
              // Firefox currently has a bug where the height can't be read from
              // the video, so we will make assumptions if this happens.
            
              if (isNaN(height)) {
                height = width / (4/3);
              }
            
              video.setAttribute('width', width);
              video.setAttribute('height', height);
              canvas.setAttribute('width', width);
              canvas.setAttribute('height', height);
              streaming = true;
            }
          }, false);
      
          startbutton.addEventListener('click', function(ev){
            takepicture();
            ev.preventDefault();
          }, false);
      
          sendbutton.addEventListener('click', function(ev){
            console.log('toto');
            sendpicture();
            ev.preventDefault();
          }, false);
      
          clearphoto();
        }
      
        // Fill the photo with an indication that none has been
        // captured.
      
        function clearphoto() {
          var context = canvas.getContext('2d');
          context.fillStyle = "#AAA";
          context.fillRect(0, 0, canvas.width, canvas.height);
      
          var data = canvas.toDataURL('image/png');
          photo.setAttribute('src', data);
        }
        
        // Capture a photo by fetching the current contents of the video
        // and drawing it into a canvas, then converting that to a PNG
        // format data URL. By drawing it on an offscreen canvas and then
        // drawing that to the screen, we can change its size and/or apply
        // other changes before drawing it.
      
        function takepicture() {
          var context = canvas.getContext('2d');
          if (width && height) {
            canvas.width = width;
            canvas.height = height;
            context.drawImage(video, 0, 0, width, height);
          
            var data = canvas.toDataURL('image/png');
            photo.setAttribute('src', data);
            question.value = photo.getAttribute('src');
          } else {
            clearphoto();
          }
        }
      
        function sendpicture() {
            question.value = photo.getAttribute('src');
        }
      startup();
    },
    willUnmount: function(question, el) {
        question.video.pause();
        question.video.srcObject.stop();
        question.video.srcObject = "";
      question.video = null;
    }
  };

  Survey.CustomWidgetCollection.Instance.addCustomWidget(widget, "customtype");
}

if (typeof Survey !== "undefined") {
  init(Survey);
}

export default init;
