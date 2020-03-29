var zoomLevelState = 5;
var zoomLevelCountry =3;
var zoomLevelCity = 7;
function zoomEventHandler(map) {
	map.addListener('zoom_changed', function(event) {
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
	});
}

function showCountryMap() {
	console.log("country");
}

function showStateMap() {
	console.log("state");
}

function showMarkerMap() {
	console.log("marker");
}

function showCityMap() {
	console.log("city");
}