function populateMarkers(map) {
	var latLongs = [
			[37.3688, -122.0363],
			[37.000, -122.0363],
			[37.000, -121.0363],
			[37.9, -122.0363],
	]
	for(i=0;i<latLongs.length;i++) {
			var myLatLng = new google.maps.LatLng(latLongs[i][0], latLongs[i][1]);
			var hospitalIconURL =
			{
				url: "https://raw.githubusercontent.com/google/material-design-icons/master/maps/1x_web/ic_local_hospital_black_24dp.png",
			};

			var marker = new google.maps.Marker({
		    position: myLatLng,
		    title:"Hospital",
				icon: hospitalIconURL,
		    map:map
			});
	}
}

function getColorForResourceValue(resourceValue) {
	const resourceStateToColorMapping = {
    NEGATIVE: '#ff0000',
    NEUTRAL: '#fffd00',
    POSITIVE: '#00ff3d',
	}

	if(resourceValue < 0) {
		return resourceStateToColorMapping.NEGATIVE;
	} else if(resourceValue == 0) {
		return resourceStateToColorMapping.NEUTRAL;
	} else {
		return resourceStateToColorMapping.POSITIVE;
	}
}
