var zoomLevelState = 5;
var zoomLevelCountry =3;
var zoomLevelCity = 7;
function zoomEventHandler(map) {
	map.addListener('zoom_changed', recalculateWithZoom);
}

function recalculateWithZoom(event) {
	zoomLevel = map.getZoom();
	if(zoomLevel <= zoomLevelCountry) {
		showCountryMap();
	} else if(zoomLevel <= zoomLevelState) {
		showStateMap();
	} else if (zoomLevel <= zoomLevelCity) {
		showCityMap();
	} else {
		showMarkerMap();
	}
}

function showCountryMap() {
	repopulateMap(countryMap);
}

function showStateMap() {
	repopulateMap(stateMap);
}

function showMarkerMap() {
	recalculate();
}

function showCityMap() {
	repopulateMap(cityMap);
}

function repopulateMap(componentMap) {
	getSelectedResources();
	clearAllMarkers();
	var keys = Object.keys(componentMap);
	keys.forEach(function(key) {
		var beds = componentMap[key]['beds'];
		var masks = componentMap[key]['masks'];
		var ventilators = componentMap[key]['ventilators'];
		var kits = componentMap[key]['kits'];
		var score = computeScoreForHospital(beds, masks, ventilators, kits);
		var color = getColorForResourceValue(score);
		console.log(score);
		console.log(color);

		var hospitalStar = {
			path: 'M 125,5 155,90 245,90 175,145 200,230 125,180 50,230 75,145 5,90 95,90 z',
			fillColor: color,
			fillOpacity: 1,
			scale: 0.1,
			strokeWeight: 1,
		};

		marker =  new google.maps.Marker({
			map: map,
			position: componentMap[key]['loc'],
			icon: hospitalStar,
			title: "Hospital"
		});
		markerArray.push(marker);
		google.maps.event.addListener(marker, 'click', function() {
			infowindow.setContent('<div><strong>' + key + '</strong><br>' +
				'Beds: ' + componentMap[key]['beds'] + '<br>' +
				'Masks: ' + componentMap[key]['masks'] + '<br>' +
				'Ventilators: ' + componentMap[key]['ventilators'] + '<br>' +
				'Kits: ' + componentMap[key]['kits'] + '<br>' +
				'</div>');
			infowindow.open(map, this);
		});

	})
}
