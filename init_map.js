function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 37.3688, lng: -122.0363},
		zoom: 8
	});
	populateMarkers(map);
}
