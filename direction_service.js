function GoogleDirections() {
  this.service = new google.maps.DirectionsService();
  this.display = new google.maps.DirectionsRenderer();
};
