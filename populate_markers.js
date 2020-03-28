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

			var defaultColor = getColorForResourceValue(0);
			// need to figure out how to draw a cross shape
			var hospitalStar = {
          path: 'M 125,5 155,90 245,90 175,145 200,230 125,180 50,230 75,145 5,90 95,90 z',
          fillColor: defaultColor,
          fillOpacity: 0.8,
          scale: 0.1,
          strokeWeight: 1
        };

			var marker = new google.maps.Marker({
		    position: myLatLng,
		    title:"Hospital",
				icon: hospitalStar,
		    map:map
			});
	}
}

function getColorForResourceValue(resourceScore) {
	const resourceStateToColorMapping = {
    NEGATIVE: '#ff0000',
    NEUTRAL: '#fffd00',
    POSITIVE: '#00ff3d',
	}

	if(resourceScore < 0) {
		return resourceStateToColorMapping.NEGATIVE;
	} else if(resourceScore == 0) {
		return resourceStateToColorMapping.NEUTRAL;
	} else {
		return resourceStateToColorMapping.POSITIVE;
	}
}

function computeScoreForHospital(beds, masks, ventilators, kits) {
	return beds + masks + ventilators + kits;
}

function parseSuppliesCSVIntoArray() {
	var url = "https://raw.githubusercontent.com/diksha/covid19-visualization/master/supplies.csv";
	var request = new XMLHttpRequest();
	request.open("GET", url, false);
	request.send(null);
	var csvData = new Array();
	var jsonObject = request.responseText.split(/\r?\n|\r/);
	for (var i = 0; i < jsonObject.length; i++) {
	  csvData.push(jsonObject[i].split(','));
	}
	return csvData;
}
