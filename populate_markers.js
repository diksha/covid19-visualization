function populateMarkers(map) {
	var latLongs = [
			[37.3688, -122.0363],
			[37.000, -122.0363],
			[37.000, -121.0363],
			[37.9, -122.0363],
	]
	for(i=0;i<latLongs.length;i++) {
			var myLatLng = new google.maps.LatLng(latLongs[i][0], latLongs[i][1]);
			var marker = new google.maps.Marker({
		    position: myLatLng,
		    title:"Hello World!",
				icon: {
			    url: "/material-design-icons/maps/1x_web/ic_local_hospital_black_24dp.png"
			  }
				animation: google.maps.Animation.DROP,
		    map:map
			});
			marker.addListener('click', toggleBounce)
	}
}

function toggleBounce() {
  if (marker.getAnimation() !== null) {
    marker.setAnimation(null);
  } else {
    marker.setAnimation(google.maps.Animation.BOUNCE);
  }
}
