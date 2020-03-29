var coords = new Array();

function renderPatientViewButton(map) {
	var patientControlDiv = document.createElement('div');
  // Set CSS for the control border.
  var controlUI = document.createElement('div');
  controlUI.style.backgroundColor = '#fff';
  controlUI.style.border = '2px solid #555555';
  controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
  controlUI.style.cursor = 'pointer';
  controlUI.style.marginBottom = '22px';
  controlUI.style.textAlign = 'center';
  controlUI.title = 'Click to generate the patient view';
  patientControlDiv.appendChild(controlUI);

  // Set CSS for the control interior.
  var controlText = document.createElement('div');
  controlText.style.color = 'rgb(25,25,25)';
  controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
  controlText.style.fontSize = '16px';
  controlText.style.lineHeight = '38px';
  controlText.style.paddingLeft = '15px';
  controlText.style.paddingRight = '15px';
  controlText.innerHTML = 'Patient View';
  controlUI.appendChild(controlText);
  controlUI.addEventListener('click', function() {
    computeClosestHospitalToPatient(map);
  });
  patientControlDiv.index = 1;
  map.controls[google.maps.ControlPosition.RIGHT_TOP].push(patientControlDiv);
}

function computeClosestHospitalToPatient(map) {
  if (!navigator.geolocation) {
    return;
  }
  navigator.geolocation.getCurrentPosition(function(position) {
    var patientLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    markClosestNHospitals(patientLocation, 1, map);
  });
}

function markClosestNHospitals(pt, numberOfResults, map) {
  var url = "https://raw.githubusercontent.com/diksha/covid19-visualization/master/supplies.csv";
	var request = new XMLHttpRequest();
	request.open("GET", url, false);
	request.send(null);
	var markers = new Array();
	var jsonObject = request.responseText.split(/\r?\n|\r/);
	for (var i = 1; i < jsonObject.length; i++) {
    var columns = jsonObject[i].split(',');
		markers.push(columns[0]);
	}

  var promises = [];
  service = new google.maps.places.PlacesService(map);
  for(var i=0;i<markers.length;i++){
    promises.push(addCoordinates(markers[i], service));
  }
  Promise.all(promises).then(() => {
    var closest = [];
    for (var i = 0; i < coords.length; i++) {
      coords[i].distance = google.maps.geometry.spherical.computeDistanceBetween(pt, coords[i]);
      closest.push(coords[i]);
    }
    closest.sort(sortByDist);
    var closestHospital = closest[0];
    var pos = {
      lat: closestHospital.lat(),
      lng: closestHospital.lng(),
    };
    console.log(closestHospital);
    var marker = new google.maps.Marker({
      position: pos,
      map: map,
      icon: {
        url: "https://raw.githubusercontent.com/google/material-design-icons/master/maps/1x_web/ic_local_hospital_black_24dp.png",
      },
      title: 'Closest Hospital',
    });
  });
}


function sortByDist(a, b) {
  return (a.distance - b.distance);
}

function addCoordinates(marker, service) {
  return new Promise(function(resolve,refuse) {
    service.getDetails(getPlaceRequest(marker), function(place, status) {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        var coordinates = place.geometry.location;
        coords.push(coordinates);
      }
      resolve();
    });
  });
}
