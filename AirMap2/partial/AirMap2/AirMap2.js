angular.module('AirMap2').controller('Airmap2Ctrl',function($scope, $http){

  var map = null;

  var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  var osmAttrib='Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
  var osm = new L.TileLayer(osmUrl, {minZoom: 8, maxZoom: 18, attribution: osmAttrib});

  $scope.markerPartial = 'AirMap2/partial/AirMap2/noSelection.html';

  function displayInfoFor(uri) {
    console.log(uri);
    // Fetch all types for the URI - then load the partial for each type
    $scope.markerPartial = 'AirMap2/partial/AirMap2/DiffisionTube.html';
    $scope.$apply();
    $scope.tubeUrl = uri;

    $scope.tubeData = null;
    $scope.msg="working...";

    console.log("load data");

    // Fetch label, what is measured, responsible party and methodology
    $http.get( "http://apps.opensheffield.org/sparql?default-graph-uri=&query=select+%3Flabel+%3Fprop+%3Fparty+%3Fmethodology%0D%0Awhere+%7B%0D%0A++%3C"+
               uri +
               "%3E+%3Chttp%3A%2F%2Fwww.w3.org%2F2000%2F01%2Frdf-schema%23label%3E+%3Flabel+.%0D%0A++%3C"+
               uri +
               "%3E+%3Chttp%3A%2F%2Fpurl.oclc.org%2FNET%2Fssnx%2Fssn%23MeasurementProperty%3E+%3Fprop+.%0D%0A++%3C"+
               uri +
               "%3E+%3Curi%3A%2F%2Fopensheffield.org%2Fproperties%23responsibleParty%3E+%3Fparty+.%0D%0A++%3C"+
               uri +
               "%3E+%3Curi%3A%2F%2Fopensheffield.org%2Fproperties%23measurementMethodology%3E+%3Fmethodology+.%0D%0A%7D%0D%0A%0D%0A&format=application%2Fsparql-results%2Bjson&timeout=0&debug=on").success( function(response) {
      $scope.tubeMetaData = response;
    });

    // Fetch all measurements
    $http.get( "http://apps.opensheffield.org/sparql?default-graph-uri=&query=select+%3Fstart+%3Fend+%3Fvalue%0D%0Awhere+%7B%0D%0A%3Fs+%3Curi%3A%2F%2Fopensheffield.org%2Fproperties%23sensor%3E++%3C"+encodeURI(uri)+"%3E+.%0D%0A%3Fs+%3Chttp%3A%2F%2Fpurl.oclc.org%2FNET%2Fssnx%2Fssn%23hasValue%3E+%3Fvalue+.%0D%0A%3Fs+%3Chttp%3A%2F%2Fpurl.oclc.org%2FNET%2Fssnx%2Fssn%23startTime%3E+%3Fstart+.%0D%0A%3Fs+%3Chttp%3A%2F%2Fpurl.oclc.org%2FNET%2Fssnx%2Fssn%23endTime%3E+%3Fend+.%0D%0A%7D%0D%0Aorder+by+%3Fs&format=application%2Fsparql-results%2Bjson&timeout=0&debug=on").success( function(response) {
      $scope.tubeData = response;
    });
  }

  function clickAirMap2Marker(e) {
    displayInfoFor(this.options.__id);
  }

  function update(map) {

    $http.get("http://apps.opensheffield.org/sparql?default-graph-uri=&query=select+%3Fs+%3Fname+%3Flat+%3Flon%0D%0Awhere+%7B%0D%0A++%3Fs+a+%3Curi%3A%2F%2Fopensheffield.org%2Ftypes%23diffusionTube%3E+.%0D%0A++%3Fs+%3Chttp%3A%2F%2Fwww.w3.org%2F2000%2F01%2Frdf-schema%23label%3E+%3Fname+.%0D%0A++%3Fs+%3Chttp%3A%2F%2Fwww.w3.org%2F2003%2F01%2Fgeo%2Fwgs84_pos%23lat%3E+%3Flat+.%0D%0A++%3Fs+%3Chttp%3A%2F%2Fwww.w3.org%2F2003%2F01%2Fgeo%2Fwgs84_pos%23long%3E+%3Flon%0D%0A%7D%0D%0A&format=application%2Fsparql-results%2Bjson&timeout=0").success( function(data) {
      console.log("update 2 "+data.results.bindings.length);
      for ( var i = 0; i < data.results.bindings.length; i++ ) {   
        // console.log("%i %s %s %s %s",i,data.results.bindings[i].lat.value,data.results.bindings[i].lon.value,
        // data.results.bindings[i].name.value,data.results.bindings[i].s.value);
        // this.data.markers.push (L.marker( [data.results.bindings[i].lat.value,data.results.bindings[i].long.value])
                   // .bindPopup( lbl )
                   // .addTo(this.layer);

        var marker = L.marker( [data.results.bindings[i].lat.value,data.results.bindings[i].lon.value],
                               {__id:data.results.bindings[i].s.value}).addTo(map);

        marker.on('click', clickAirMap2Marker);

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
