var coords = new Array();
var placeInformationArray;
var shouldShowPatientView = false;
var closestHospitalMarker = null;

function renderPatientViewButton(map, placeInformationArr, googleDirections) {
  placeInformationArray = placeInformationArr;
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
    togglePatientView(map, googleDirections);
  });
  patientControlDiv.index = 1;
  map.controls[google.maps.ControlPosition.RIGHT_TOP].push(patientControlDiv);
}

function togglePatientView(map, googleDirections) {
  shouldShowPatientView = !shouldShowPatientView;
  if(shouldShowPatientView) {
    computeClosestHospitalToPatient(map, googleDirections);
  }
  else {
    getGeoLocation(); // Reset the view to current location
    googleDirections.display.set('directions', null); // Delete route
    closestHospitalMarker.setMap(null); // Delete closest hospital marker
  }
}

function computeClosestHospitalToPatient(map, googleDirections) {
  if (!navigator.geolocation) {
    return;
  }
  navigator.geolocation.getCurrentPosition(function(position) {
    var patientLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    markClosestNHospitals(patientLocation, 1, map, googleDirections);
  });
}

function markClosestNHospitals(pt, numberOfResults, map, googleDirections) {
  var closest = [];
  for (var i = 0; i < placeInformationArray.length; i++) {
    if(placeInformationArray[i][1] > 0) {
      placeInformationArray[i][5].distance = google.maps.geometry.spherical.computeDistanceBetween(pt, placeInformationArray[i][5]);
      closest.push(placeInformationArray[i][5]);
    }
  }
  closest.sort(sortByDist);
  var closestHospital = closest[0];
  var pos = {
    lat: closestHospital.lat(),
    lng: closestHospital.lng(),
  };
  closestHospitalMarker = new google.maps.Marker({
    position: pos,
    map: map,
    icon: {
      url: "https://raw.githubusercontent.com/google/material-design-icons/master/maps/1x_web/ic_local_hospital_black_24dp.png",
    },
    title: 'Closest Hospital',
  });
  map.setCenter(pos);

  var start = pt;
  var end = closestHospital;
  var bounds = new google.maps.LatLngBounds();
  bounds.extend(start);
  bounds.extend(end);
  map.fitBounds(bounds);
  var request = {
    origin: start,
    destination: end,
    travelMode: google.maps.TravelMode.DRIVING
};
  var directionsService = googleDirections.service;
  var directionsDisplay = googleDirections.display;
  directionsService.route(request, function (response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);
      directionsDisplay.setMap(map);
    } else {
      alert("Directions Request from " + start.toUrlValue(6) + " to " + end.toUrlValue(6) + " failed: " + status);
    }
  });
}


function sortByDist(a, b) {
  return (a.distance - b.distance);
}
