var map;
var placeInformationArray;
countryMap = {};
stateMap = {};
cityMap = {};
function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 37.3688, lng: -122.0363},
		zoom: 8
	});
	getGeoLocation();

  service = new google.maps.places.PlacesService(map);
  getPlaceInformation(service);
  zoomEventHandler(map);
}

function getGeoLocation() {
// Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
				var marker = new google.maps.Marker({
            position: pos,
            map: map,
            title: 'Your current location'
        });
        map.setCenter(pos);
				map.setZoom(14);
      }, function() {
      });
   }
}

function getPlaceInformation(service) {
  placeInformationArray = new Array();
  supplies = parseSuppliesCSVIntoArray();
  promises = new Array();
  for(i=0;i<supplies.length;i++) {
    promises.push(getPlaceInfo(supplies[i], service));

  }
  Promise.all(promises).then(() => {
    console.log('placeInformationArray', placeInformationArray);
    populateMarkers(map, placeInformationArray);
		googleDirections = new GoogleDirections();
    renderPatientViewButton(map, placeInformationArray, googleDirections);
  });
}

function getPlaceInfo(supply, service) {
  return new Promise(function(resolve,refuse) {
    var placeInformation = new Array();
    var placeID = supply[0];
    for(j=0;j<supply.length;j++) {
      placeInformation.push(supply[j]);
    }
    service.getDetails(getPlaceRequest(placeID), function(place, status) {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        placeInformation.push(place.geometry.location);
        placeInformation.push(place.name);
        placeInformation.push(place.formatted_address);
        placeInformation.push(place.formatted_phone_number);
        placeInformation.push(place.address_components);
        placeInformationArray.push(placeInformation);
        addToMaps(place, placeInformation[4], placeInformation[1], placeInformation[2], placeInformation[3]);
      } 
      resolve();
    });
  });
}
