import L from 'leaflet';

var widget = {
  name: "leaflet",
  title: "Leaflet position",
  iconName: "",
  widgetIsLoaded: function () {
    return typeof L != "undefined";
  },
  isFit: function (question) {
      return question.getType() === 'leaflet';
  },
 
  activatedByChanged: function (activatedBy) {
      Survey.JsonObject.metaData.addClass("leaflet", [], null, "empty");
    
      Survey.JsonObject.metaData.addProperties("leaflet", [
          {name: "height", default: 200},
          { name: "zoom", default: 13},
          {name: "useUserPosition", default: false},
          {name: "initialLatitude", default: 51.5},
          {name: "initialLongitude", default: -0.09},
          {name: "tileAddress", default: "https://{s}.tile.osm.org/{z}/{x}/{y}.png"},
          {name: "tileAttribution", default: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}
      ]);
  },
  isDefaultRender: false,
  htmlTemplate: "<div id='map'></div>",
  afterRender: function (question, el) {


    el.style.height =  question.height+"px";
    var map = L.map('map');
    L.tileLayer(question.tileAddress, {
     attribution: question.tileAttribution
    }).addTo(map);
  
    var myMarker = L.marker([0, 0], {title: "location", alt: "Selected Location", draggable: true}).addTo(map);

    var onDragEnd = function(){
      var coord = String(myMarker.getLatLng()).split(',');
			var lat = coord[0].split('(');
			var lng = coord[1].split(')');
			myMarker.bindPopup("Moved to: " + lat[1] + ", " + lng[0] + ".");
      question.value = {lng: lng[0], lat: lat[1]};
    }

    
    myMarker.on('dragend', onDragEnd);

    if(question.useUserPosition){
      
      map.locate({setView: true, watch: false})
          .on('locationfound', function(e){
            console.log("LOCATION", e);
            var newLatLng = new L.LatLng(e.latitude, e.longitude);
            myMarker.setLatLng(newLatLng);
            map.setView([e.latitude, e.longitude], question.zoom);
          })
          .on('locationerror', function(e){
            console.log(e);
        });
    } else {
      map.setView([question.initialLatitude, question.initialLongitude], question.zoom);
      var newLatLng = new L.LatLng(question.initialLatitude, question.initialLongitude);
      myMarker.setLatLng(newLatLng);
    }

    var onReadOnlyChangedCallback = function() {
      if (question.isReadOnly) {
        myMarker.off('dragend', onDragEnd);
      } else {
        myMarker.on('dragend', onDragEnd);
      }
    }
      
      question.readOnlyChangedCallback = onReadOnlyChangedCallback;
      onReadOnlyChangedCallback();
  },
  //Use it to destroy the widget. It is typically needed by jQuery widgets
  willUnmount: function (question, el) {
      //We do not need to clear anything in our simple example
      //Here is the example to destroy the image picker
      //var $el = $(el).find("select");
      //$el.data('picker').destroy();
  }
}

Survey.CustomWidgetCollection.Instance.addCustomWidget(widget, "customtype");