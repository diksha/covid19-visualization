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
  supplies = parseSuppliesCSVIntoArray();
  var promises = [];
  service = new google.maps.places.PlacesService(map);
  for(var i=0;i<supplies.length;i++){
    promises.push(addCoordinates(supplies[i], service));
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
    var marker = new google.maps.Marker({
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
    var directionsService = new google.maps.DirectionsService();
      var directionsDisplay = new google.maps.DirectionsRenderer();
    directionsService.route(request, function (response, status) {
      if (status == google.maps.DirectionsStatus.OK) {
          directionsDisplay.setDirections(response);
          directionsDisplay.setMap(map);
      } else {
          alert("Directions Request from " + start.toUrlValue(6) + " to " + end.toUrlValue(6) + " failed: " + status);
      }
    });
  });
}


function sortByDist(a, b) {
  return (a.distance - b.distance);
}

function addCoordinates(supply, service) {
  return new Promise(function(resolve,refuse) {
    service.getDetails(getPlaceRequest(supply[0]), function(place, status) {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        var coordinates = place.geometry.location;
        coords.push(coordinates);
      }
      resolve();
    });
  });
}
