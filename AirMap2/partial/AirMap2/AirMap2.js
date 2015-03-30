angular.module('AirMap2').controller('Airmap2Ctrl',function($scope){

  var map = null;

  var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  var osmAttrib='Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
  var osm = new L.TileLayer(osmUrl, {minZoom: 8, maxZoom: 18, attribution: osmAttrib});


  map = new L.Map('map-canvas2', {
    center: new L.LatLng(53.383611, -1.466944),
    zoom: 12
    // ,layers: [grayscale, cities]
  });

  map.addLayer(osm);

});
