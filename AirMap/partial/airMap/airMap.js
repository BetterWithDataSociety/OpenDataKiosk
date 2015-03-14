angular.module('AirMap').controller('AirmapCtrl',function($scope){

  var map = null;

  var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  var osmAttrib='Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
  var osm = new L.TileLayer(osmUrl, {minZoom: 8, maxZoom: 12, attribution: osmAttrib});		

  // var grayscale = L.tileLayer(mapboxUrl, {id: 'MapID', attribution: mapboxAttribution}),
  //     streets   = L.tileLayer(mapboxUrl, {id: 'MapID', attribution: mapboxAttribution});

  map = new L.Map('map-canvas', {
    center: new L.LatLng(53.383611, -1.466944),
    zoom: 12
    // ,layers: [grayscale, cities]
  });

  var baseMaps = {
    "Base": map,
  //   "Streets": streets
  };

  var overlayMaps = {
  //   "Cities": cities
  };

  L.control.layers(baseMaps, overlayMaps).addTo(map);

  var popup = L.popup();

  function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(map);
  }

  map.on('click', onMapClick);
  map.addLayer(osm);

  map.invalidateSize();

});
