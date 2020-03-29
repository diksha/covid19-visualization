function renderLegend(map) {
  var iconBase = '/icons/';
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
    div.innerHTML = '<img src="' + icon + '"> ' + name;
    legend.appendChild(div);
  }
  map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(legend);
}
