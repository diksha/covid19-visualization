var masksSelected ;
var ventilatorsSelected ;
var bedsSelected ;
var kitsSelected ;
var markerArray;
function populateMarkers(map) {
	infowindow = new google.maps.InfoWindow();
	service = new google.maps.places.PlacesService(map);
	recalculate();
}

function recalculate() {
	masksSelected = document.getElementById('masks').checked ? 1 : 0;
	ventilatorsSelected = document.getElementById('ventilators').checked ? 1 : 0;
	bedsSelected  = document.getElementById('beds').checked ? 1 : 0;
	kitsSelected  = document.getElementById('kits').checked ? 1 : 0;
	supplies = parseSuppliesCSVIntoArray();
	supplies.forEach(iterate);
}

function iterate(supply) {
	clearAllMarkers();
	var placeID = supply[0];
	service.getDetails(getPlaceRequest(placeID), function(place, status) {
		if (status === google.maps.places.PlacesServiceStatus.OK) {
			var beds = supply[1];
			var masks = supply[2];
			var ventilators = supply[3];
			var kits = supply[4];
			var score = computeScoreForHospital(beds, masks, ventilators, kits);
			var color = getColorForResourceValue(score);
			
			var marker;
			if(masksSelected+bedsSelected+kitsSelected+ventilatorsSelected == 1) {
				var hospitalStar = {
					path: 'M 125,5 155,90 245,90 175,145 200,230 125,180 50,230 75,145 5,90 95,90 z',
					fillColor: color,
					fillOpacity: 1,
					scale: 0.1,
					strokeWeight: 1,
					labelOrigin: new google.maps.Point(120, 120),
				};
				marker =  new google.maps.Marker({
					map: map,
					position: place.geometry.location,
					icon: hospitalStar,
					title: "Hospital",
					label: {
						text:(score).toString(),
						fontSize:'6px',
						fontWeight: 'bold',
						color: 'white'
					},
				});
			} else {
				var hospitalStar = {
					path: 'M 125,5 155,90 245,90 175,145 200,230 125,180 50,230 75,145 5,90 95,90 z',
					fillColor: color,
					fillOpacity: 1,
					scale: 0.1,
					strokeWeight: 1,
				};
				marker =  new google.maps.Marker({
					map: map,
					position: place.geometry.location,
					icon: hospitalStar,
					title: "Hospital"
				});
			} 
			markerArray.push(marker);
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

function clearAllMarkers() {
	if(!markerArray) markerArray = [];
	for(i=0;i<markerArray.length;i++) {
		markerArray[i].setMap(null);
	}
	markerArray = [];
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
	return bedsSelected * parseInt(beds) + masksSelected*parseInt(masks) + ventilatorsSelected*parseInt(ventilators) + kitsSelected*parseInt(kits);
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
