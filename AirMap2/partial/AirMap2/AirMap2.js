angular.module('AirMap2').controller('Airmap2Ctrl',function($scope){

  var map = null;

  var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  var osmAttrib='Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
  var osm = new L.TileLayer(osmUrl, {minZoom: 8, maxZoom: 18, attribution: osmAttrib});

  function update() {

    console.log("updated");

    $.ajax({
             url: "http://apps.opensheffield.org/sparql?default-graph-uri=&query=select+%3Fs+%3Fname+%3Flat+%3Flon%0D%0Awhere+%7B%0D%0A++%3Fs+a+%3Curi%3A%2F%2Fopensheffield.org%2Ftypes%23diffusionTube%3E+.%0D%0A++%3Fs+%3Chttp%3A%2F%2Fwww.w3.org%2F2000%2F01%2Frdf-schema%23label%3E+%3Fname+.%0D%0A++%3Fs+%3Chttp%3A%2F%2Fwww.w3.org%2F2003%2F01%2Fgeo%2Fwgs84_pos%23lat%3E+%3Flat+.%0D%0A++%3Fs+%3Chttp%3A%2F%2Fwww.w3.org%2F2003%2F01%2Fgeo%2Fwgs84_pos%23long%3E+%3Flon%0D%0A%7D%0D%0A&format=application%2Fsparql-results%2Bjson&timeout=0",
    }).done(function(data) {
      console.log("updated2");
      for ( var i = 0; i < data.results.bindings.length; i++ ) {   
        console.log("%s %s %s %s",data.results.bindings[i].lat.value,data.results.bindings[i].lon.value,data.results.bindings[i].name.value,data.results.bindings[i].s.value);
      }
    });
  }


  update();

  map = new L.Map('map-canvas2', {
    center: new L.LatLng(53.383611, -1.466944),
    zoom: 12
    // ,layers: [grayscale, cities]
  });

  map.addLayer(osm);

});
