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
	squarePath = 'M -1,-1 1,-1 1,1 -1,1 z';
	repopulateMap(countryMap, squarePath);
}

function showStateMap() {
	trianglePath = 'M -1,-1 0,1 1,-1 z';

	repopulateMap(stateMap, trianglePath);
}

function showMarkerMap() {
	recalculate();
}

function showCityMap() {
	repopulateMap(cityMap, google.maps.SymbolPath.CIRCLE);
}

function repopulateMap(componentMap, iconPath) {
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

		var markerIcon = {
			path: iconPath,
			fillColor: color,
			fillOpacity: 1,
			scale: 10,
			strokeWeight: 1,
		};

		marker =  new google.maps.Marker({
			map: map,
			position: componentMap[key]['loc'],
			icon: markerIcon,
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
