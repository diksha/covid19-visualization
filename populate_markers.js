function populateMarkers(map) {

	var supplies = [
	{ placeId:"ChIJxYu-ZtK2j4ARpLis1OcKNDM", beds:"-37", masks:"35", ventilators:"27", kits:"-25"},
	{ placeId:"ChIJ_3X2kATNj4ARJq22N-TR2io", beds:"0", masks:"-5", ventilators:"15", kits:"29"},
	{ placeId:"ChIJn43dqhnLj4ARaHaMv8hRGmY", beds:"-41", masks:"-48", ventilators:"34", kits:"-7"},
	{ placeId:"ChIJvyb4WqXHwoAR91h7k6g_HXY", beds:"26", masks:"-50", ventilators:"-6", kits:"22"},
	{ placeId:"ChIJM9J-ccbHwoARlaXxTFx9ck4", beds:"-27", masks:"45", ventilators:"41", kits:"-47"},
	{ placeId:"ChIJN9byrje_woARvQL9tPmsa10", beds:"-48", masks:"4", ventilators:"44", kits:"-12"},
	{ placeId:"ChIJx3kMjY8NkFQR9nFRWgZ3Ypc", beds:"-29", masks:"-8", ventilators:"-48", kits:"-28"},
	{ placeId:"ChIJGUt2ibVqkFQRAB3xp3UjRLw", beds:"-6", masks:"0", ventilators:"-27", kits:"-27"},
	{ placeId:"ChIJrYx10YIUkFQRXOPoZdRuFaA", beds:"-28", masks:"-4", ventilators:"-21", kits:"-48"},
	{ placeId:"ChIJ61x_cpz2wokRG1SmA_ez-kM", beds:"34", masks:"6", ventilators:"14", kits:"-32"},
	{ placeId:"ChIJqccvIQxZwokR4PfF_NqTomc", beds:"50", masks:"36", ventilators:"-38", kits:"-17"},
	{ placeId:"ChIJra13dJVYwokRh3kQ5-p7Nio", beds:"22", masks:"21", ventilators:"44", kits:"-8"},
	{ placeId:"ChIJ69Amvc0cdkgRLNOj6dq9K9k", beds:"33", masks:"17", ventilators:"-20", kits:"9"},
	{ placeId:"ChIJe4cW3cAEdkgR0RK8zGZJPAQ", beds:"39", masks:"35", ventilators:"1", kits:"9"},
	{ placeId:"ChIJE52681ADdkgR6Sv8TJwvcXU", beds:"-47", masks:"-26", ventilators:"30", kits:"-9"}
	]

	infowindow = new google.maps.InfoWindow();
	service = new google.maps.places.PlacesService(map);
	supplies.forEach(iterate);
}

function iterate(supply) {
	service.getDetails(getPlaceRequest(supply['placeId']), function(place, status) {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
				var score = computeScoreForHospital(supply['beds'], supply['masks'], supply['ventilators'], supply['kits']);
				var color = getColorForResourceValue(score);
				// need to figure out how to draw a cross shape
				var hospitalStar = {
          path: 'M 125,5 155,90 245,90 175,145 200,230 125,180 50,230 75,145 5,90 95,90 z',
          fillColor: color,
          fillOpacity: 0.8,
          scale: 0.1,
          strokeWeight: 1
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
            'Beds: ' + supply['beds'] + '<br>' +
            'Masks: ' + supply['masks'] + '<br>' +
            'Ventilators: ' + supply['ventilators'] + '<br>' +
            'Kits: ' + supply['kits'] + '<br>' +
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
