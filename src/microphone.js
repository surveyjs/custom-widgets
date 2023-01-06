import RecordRTC from "recordrtc";

function init(Survey) {
  const iconId = "icon-microphone";
  Survey.SvgRegistry && Survey.SvgRegistry.registerIconFromSvg(iconId, require('svg-inline-loader?classPrefix!./images/microphone.svg'), "");
  var widget = {
    name: "microphone",
    title: "Microphone",
    iconName: iconId,
    widgetIsLoaded: function() {
      return typeof RecordRTC != "undefined";
    },
    isFit: function(question) {
      return question.getType() === "microphone";
    },
    htmlTemplate:
      "<div style='height: 39px'>" +
      "<button type='button'  title='Record' style='vertical-align: top; margin-top: 3px' ><i class='fa fa-microphone' aria-hidden='true'></i></button>" +
      "&nbsp;<button type='button' title='Save' style='vertical-align: top; margin-top: 3px'><i class='fa fa-cloud' aria-hidden='true' ></i></button>" +
      "&nbsp;<audio style='" +
      "vertical-align: top;" +
      "margin-left: 10px;" +
      "height:35px;" +
      "-moz-box-shadow: 2px 2px 4px 0px #006773;" +
      "-webkit-box-shadow:  2px 2px 4px 0px #006773;" +
      "box-shadow: 2px 2px 4px 0px #006773;" +
      "' " +
      "controls='true' >" +
      "</audio>" +
      "</div>",
    activatedByChanged: function(activatedBy) {
      Survey.JsonObject.metaData.addClass("microphone", [], null, "empty");
    },
    afterRender: function(question, el) {
      var rootWidget = this;
      var buttonStartEl = el.getElementsByTagName("button")[0];
      var buttonStopEl = el.getElementsByTagName("button")[1];
      var audioEl = el.getElementsByTagName("audio")[0];
      var log = function(msg) {
        //console.log(msg);
      };
  
      //////////  RecordRTC logic

      var successCallback = function(stream) {
        var options = {
          type: "audio",
          mimeType: "audio/webm",
          audioBitsPerSecond: 44100,
          sampleRate: 44100,
          bufferSize: 16384,
          numberOfAudioChannels: 1
        };
        log("successCallback");
        question.survey.mystream = stream;
        question.survey.recordRTC = RecordRTC(
          question.survey.mystream,
          options
        );
        if (typeof question.survey.recordRTC != "undefined") {
          log("startRecording");
          question.recordingStartedAt = new Date();
          question.survey.recordRTC.startRecording();
        }
      };

      var errorCallback = function() {
        alert("No microphone");
        question.survey.recordRTC = undefined;
        question.survey.mystream = undefined;
      };

      var processAudio = function(audioVideoWebMURL) {
        log("processAudio");
        var recordedBlob = question.survey.recordRTC.getBlob();

        var fileReader = new FileReader();
        fileReader.onload = function(event) {
          var dataUri = event.target.result;
          log("dataUri: " + dataUri);
          question.value = dataUri;
          audioEl.src = dataUri;

          log("cleaning");
          question.survey.recordRTC = undefined;
          question.survey.mystream = undefined;
        };
        fileReader.readAsDataURL(recordedBlob);
      };

      var startRecording = function() {
        question.recordingStartedAt = undefined;
        question.recordingEndedAt = undefined;
        question.recordingDuration = undefined;
        // erase previous data
        question.value = undefined;

        // if recorder open on another question	- try to stop recording
        if (typeof question.survey.recordRTC != "undefined") {
          question.survey.recordRTC.stopRecording(doNothingHandler);
          if (typeof question.survey.mystream != "undefined") {
            question.survey.mystream.getAudioTracks().forEach(function(track) {
              track.stop();
            });
          }
        }

        var mediaConstraints = {
          video: false,
          audio: true
        };

        navigator.mediaDevices
          .getUserMedia(mediaConstraints)
          .then(successCallback.bind(this), errorCallback.bind(this));
      };

      var stopRecording = function() {
        log("stopRecording");
        var eD = new Date();
        question.recordingEndedAt = eD;
        question.recordingDuration = eD - question.recordingStartedAt;
        if (typeof question.survey.recordRTC != "undefined") {
          question.survey.recordRTC.stopRecording(processAudio.bind(this));
          if (typeof question.survey.mystream != "undefined") {
            question.survey.mystream.getAudioTracks().forEach(function(track) {
              track.stop();
            });
          }
        }
      };

      //////////////  end RTC logic //////////////////

      if (!question.isReadOnly) {
        buttonStartEl.onclick = startRecording;
      } else {
        buttonStartEl.parentNode.removeChild(buttonStartEl);
      }

      if (!question.isReadOnly) {
        buttonStopEl.onclick = stopRecording;
      } else {
        buttonStopEl.parentNode.removeChild(buttonStopEl);
      }

      audioEl.src = question.value;

      var updateValueHandler = function() {};

      var doNothingHandler = function() {};

      question.valueChangedCallback = updateValueHandler;
      updateValueHandler();
    },
    willUnmount: function(question, el) {
      if (typeof question.survey.recordRTC != "undefined") {
        question.survey.recordRTC.stopRecording(doNothingHandler);
        if (typeof question.survey.mystream != "undefined") {
          question.survey.mystream.getAudioTracks().forEach(function(track) {
            track.stop();
          });
        }
        question.value = undefined;
        question.survey.recordRTC = undefined;
        question.survey.mystream = undefined;
      }
    }
  };

  Survey.CustomWidgetCollection.Instance.addCustomWidget(widget, "customtype");
}

if (typeof Survey !== "undefined") {
  init(Survey);
}

export default init;
