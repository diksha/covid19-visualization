var masksSelected ;
var ventilatorsSelected ;
var bedsSelected ;
var kitsSelected ;
var markerArray;
var hospitalType = {
	ESTABLISHED: 'ESTABLISHED',
	PROVISIONAL: 'PROVISIONAL',
};

var placeInformationArray;
function populateMarkers(map, placeInformationArr) {
	infowindow = new google.maps.InfoWindow();
	placeInformationArray = placeInformationArr;
	recalculate();
}

function getSelectedResources() {
	masksSelected = document.getElementById('masks').checked ? 1 : 0;
	ventilatorsSelected = document.getElementById('ventilators').checked ? 1 : 0;
	bedsSelected  = document.getElementById('beds').checked ? 1 : 0;
	kitsSelected  = document.getElementById('kits').checked ? 1 : 0;
}

function recalculate() {
	getSelectedResources();
	clearAllMarkers();
	placeInformationArray.forEach(iterate);
}

function iterate(supply) {
	var placeID = supply[0];
	var beds = supply[1];
	var masks = supply[2];
	var ventilators = supply[3];
	var kits = supply[4];
	var type = supply[5];
	var address_components = supply[10];
	var score = computeScoreForHospital(beds, masks, ventilators, kits);
	var color = getColorForResourceValue(score);
	var path = "";
	var label = "";
	if(type === hospitalType.ESTABLISHED) {
		path = 'M 125,5 155,90 245,90 175,145 200,230 125,180 50,230 75,145 5,90 95,90 z';
		title = 'Hospital';
	}
	else if(type === hospitalType.PROVISIONAL) {
		path = 'M 60 0 L 120 0 L 180 60 L 180 120 L 120 180 L 60 180 L 0 120 L 0 60 Z';
		title = 'Provisional Medical Facility';
	}

	var marker;
	if(masksSelected+bedsSelected+kitsSelected+ventilatorsSelected == 1) {
		var hospitalIcon = {
			path: path,
			fillColor: color,
			fillOpacity: 1,
			scale: 0.1,
			strokeWeight: 1,
			labelOrigin: new google.maps.Point(120, 120),
		};
		marker =  new google.maps.Marker({
			map: map,
			position: supply[6],
			icon: hospitalIcon,
			title: title,
			label: {
				text:(score).toString(),
				fontSize:'6px',
				fontWeight: 'bold',
				color: 'white'
			},
		});
	} else {
		var hospitalIcon = {
			path: path,
			fillColor: color,
			fillOpacity: 1,
			scale: 0.1,
			strokeWeight: 1,
		};
		marker =  new google.maps.Marker({
			map: map,
			position: supply[6],
			icon: hospitalIcon,
			title: title,
		});
	}
	markerArray.push(marker);
	google.maps.event.addListener(marker, 'click', function() {
		infowindow.setContent('<div><strong>' + supply[7] + '</strong><br>' +
			'Address: ' + supply[8] + '<br>' +
			'Phone: ' + supply[9] + '<br>' +
			'Beds: ' + beds + '<br>' +
			'Masks: ' + masks + '<br>' +
			'Ventilators: ' + ventilators + '<br>' +
			'Kits: ' + kits + '<br>' +
			'</div>');
		infowindow.open(map, this);
	});
}

function getAddressComponentFromMap(map, name) {
	if (map[name] == null) {
		map[name] = {};
	}
	return map[name];
}

function addResourceToAddressComponent(component, resource, amount) {
	if (component[resource] == null) {
		component[resource] = 0;
	}
	component[resource] += parseInt(amount);
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
		fields: ['name', 'formatted_phone_number', 'formatted_address', 'geometry', 'address_component']
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
