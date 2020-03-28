function populateMarkers(map) {
	var myLatlng = new google.maps.LatLng(37.3688, -122.0363);
	var marker = new google.maps.Marker({
	    position: myLatlng,
	    title:"Hello World!"
	});
	marker.setMap(map);
	console.log("Hello World");
}