function populateMarkers(map) {
	supplies = parseSuppliesCSVIntoArray();
	infowindow = new google.maps.InfoWindow();
	service = new google.maps.places.PlacesService(map);
	supplies.forEach(iterate);
}

function iterate(supply) {
	var placeID = supply[0];
	service.getDetails(getPlaceRequest(placeID), function(place, status) {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
				var beds = supply[1];
				var masks = supply[2];
				var ventilators = supply[3];
				var kits = supply[4];
				var score = computeScoreForHospital(beds, masks, ventilators, kits);
				var color = getColorForResourceValue(score);
				var hospitalStar = {
          path: 'M 10,10 l 90,90 M 100,10 l -90,90 z',
          fillColor: color,
          fillOpacity: 0.8,
          scale: 0.2,
					strokeColor: color,
					strokeWeight: 6,
	       };
        var marker = new google.maps.Marker({
          map: map,
          position: place.geometry.location,
          icon: hospitalStar,
          title: "Hospital"
        });
        google.maps.event.addListener(marker, 'click', function() {
          infowindow.setContent('<div><strong>' + place.name + '</strong><br>' +
            'Address: ' + place.formatted_address + '<br>' +
            'Phone: ' + place.formatted_phone_number + '<br>' +
            'Beds: ' + beds + '<br>' +
            'Masks: ' + masks + '<br>' +
            'Ventilators: ' + ventilators + '<br>' +
            'Kits: ' + kits + '<br>' +
            '</div>');
          infowindow.open(map, this);
        });
      };
  	});
}

function getPlaceRequest(pid) {
	request = {
			placeId: pid,
			fields: ['name', 'formatted_phone_number', 'formatted_address', 'geometry']
		}
	return request;
}


function getColorForResourceValue(resourceScore) {
	const resourceStateToColorMapping = {
    NEGATIVE: '#ea4235',
    NEUTRAL: '#fbbc04',
    POSITIVE: '#33a853',
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
	return parseInt(beds) + parseInt(masks) + parseInt(ventilators) + parseInt(kits);
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
