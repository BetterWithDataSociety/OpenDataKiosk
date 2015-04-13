angular.module('AirMap2').controller('Airmap2Ctrl',function($scope){

  var map = null;

  var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  var osmAttrib='Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
  var osm = new L.TileLayer(osmUrl, {minZoom: 8, maxZoom: 18, attribution: osmAttrib});

  $scope.markerPartial = 'AirMap2/partial/AirMap2/noSelection.html';

  function displayInfoFor(uri) {
    alert(uri);
    // Fetch all types for the URI - then load the partial for each type
  }

  function update(map) {

    console.log("update");

    $.ajax({
             url: "http://apps.opensheffield.org/sparql?default-graph-uri=&query=select+%3Fs+%3Fname+%3Flat+%3Flon%0D%0Awhere+%7B%0D%0A++%3Fs+a+%3Curi%3A%2F%2Fopensheffield.org%2Ftypes%23diffusionTube%3E+.%0D%0A++%3Fs+%3Chttp%3A%2F%2Fwww.w3.org%2F2000%2F01%2Frdf-schema%23label%3E+%3Fname+.%0D%0A++%3Fs+%3Chttp%3A%2F%2Fwww.w3.org%2F2003%2F01%2Fgeo%2Fwgs84_pos%23lat%3E+%3Flat+.%0D%0A++%3Fs+%3Chttp%3A%2F%2Fwww.w3.org%2F2003%2F01%2Fgeo%2Fwgs84_pos%23long%3E+%3Flon%0D%0A%7D%0D%0A&format=application%2Fsparql-results%2Bjson&timeout=0",
    }).done(function(data) {
      console.log("update 2 "+data.results.bindings.length);
      for ( var i = 0; i < data.results.bindings.length; i++ ) {   
      // for ( var i = 0; i < 100; i++ ) {   
        // console.log("%i %s %s %s %s",i,data.results.bindings[i].lat.value,data.results.bindings[i].lon.value,data.results.bindings[i].name.value,data.results.bindings[i].s.value);
        // this.data.markers.push (L.marker( [data.results.bindings[i].lat.value,data.results.bindings[i].long.value])
                   // .bindPopup( lbl )
                   // .addTo(this.layer);

        var marker = L.marker( [data.results.bindings[i].lat.value,data.results.bindings[i].lon.value],
                               {__id:data.results.bindings[i].s.value}).addTo(map);

        marker.on('click', function(e) {displayInfoFor(this.options.__id);});

      }
    });
  }



  map = new L.Map('map-canvas2', {
    center: new L.LatLng(53.383611, -1.466944),
    zoom: 12
    // ,layers: [grayscale, cities]
  });


  map.addLayer(osm);

  update(map);

});
