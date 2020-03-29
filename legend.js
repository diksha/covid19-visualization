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
    }
  };
  var legend = document.getElementById('legend');
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
