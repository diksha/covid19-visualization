var zoomLevelState = 7;
var zoomLevelCountry =4;
function zoomEventHandler(map) {
	map.addListener('zoom_changed', function(event) {
	zoomLevel = map.getZoom();
		if(zoomLevel <= zoomLevelCountry) {
			showCountryMap();
		} else if(zoomLevel <= zoomLevelState) {
			showStateMap();
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