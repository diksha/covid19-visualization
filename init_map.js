var map;
function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 37.3688, lng: -122.0363},
		zoom: 8
	});
	getGeoLocation();
	populateMarkers(map);
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
        map.setCenter(pos);
      }, function() {
      });
   }
}