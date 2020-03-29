function renderAmenitiesLegend(map) {
  var iconBase = 'https://raw.githubusercontent.com/diksha/covid19-visualization/master/icons/';
  var icons = {
    positive: {
      name: 'Abundant',
      icon: iconBase + 'positive.png'
    },
    neutral: {
      name: 'Sufficient',
      icon: iconBase + 'neutral.png'
    },
    negative: {
      name: 'Scarce',
      icon: iconBase + 'negative.png'
    },
  };
  var legend = document.getElementsByName('amenity_legend')[0];
  renderLegends(icons, legend);
}

function renderHospitalTypesLegend(map) {
  var icons = {
    makeShiftHospital: {
      name: 'Provisional Arrangement',
      icon: 'https://raw.githubusercontent.com/medic/icon-library/master/forms_tasks_targets/PNGs/icon-people-nurse-crop%402x.png',
    },
    hospital: {
      name: 'Medical Facility',
      icon: 'https://raw.githubusercontent.com/diksha/covid19-visualization/master/icons/hospitalmarker.png',
    },
    closestHospital: {
      name: 'Closest Hospital',
      icon: 'https://raw.githubusercontent.com/medic/icon-library/master/forms_tasks_targets/PNGs/icon-people-nurse-crop%402x.png',
    },
  };
  var legend = document.getElementsByName('medical_facility_legend')[0];
  renderLegends(icons, legend);
}

function renderZoomInOutData(map) {
  var icons = {
    countryView: {
      name: 'Country data',
      icon: 'https://raw.githubusercontent.com/diksha/covid19-visualization/master/icons/countryView.png',
    },
    stateView: {
      name: 'State data',
      icon: 'https://raw.githubusercontent.com/diksha/covid19-visualization/master/icons/stateView.png',
    },
    cityView: {
      name: 'City data',
      icon: 'https://raw.githubusercontent.com/diksha/covid19-visualization/master/icons/cityView.png',
    },
  };
  var legend = document.getElementsByName('zoom_in_out_legend')[0];
  renderLegends(icons, legend);
}

function renderLegends(icons, legend) {
  for (var key in icons) {
    var type = icons[key];
    var name = type.name;
    var icon = type.icon;
    var div = document.createElement('div');
    div.innerHTML = '<img src="' + icon + '" height="25" width="25" style="margin:0px 10px 5px"/>' + name;
    legend.appendChild(div);
  }
  map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(legend);
}
