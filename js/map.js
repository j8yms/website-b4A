function initMap() {
  // Centered on Rhapta Road, Westlands (Nairobi) and add a marker
  var centerLatLng = new google.maps.LatLng(-1.2760, 36.8038);
  var mapProp = {
    center: centerLatLng,
    zoom: 16
  };
  var map = new google.maps.Map(document.getElementById("map"), mapProp);

  var marker = new google.maps.Marker({
    position: centerLatLng,
    map: map,
    title: 'Barber 4 All - NJEMA COURT, 12 RHAPTA ROAD. WESTLANDS'
  });

  var infoWindow = new google.maps.InfoWindow({
    content: '<strong>Barber 4 All</strong><br>NJEMA COURT, 12 RHAPTA ROAD. WESTLANDS'
  });

  marker.addListener('click', function() {
    infoWindow.open(map, marker);
  });
}
