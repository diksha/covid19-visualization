function populateMarkers(map) {
	var latLongs = [
			[37.3688, -122.0363],
			[37.000, -122.0363],
			[37.000, -121.0363],
			[37.9, -122.0363],
	]
	for(i=0;i<latLongs.length;i++) {
			var myLatLng = new google.maps.LatLng(latLongs[i][0], latLongs[i][1]);
			var marker = new google.maps.Marker({
		    position: myLatLng,
		    title:"Hospital",
				icon: {
					url: "https://raw.githubusercontent.com/google/material-design-icons/master/maps/1x_web/ic_local_hospital_black_24dp.png",
				},
		    map:map
			});
	}
}
