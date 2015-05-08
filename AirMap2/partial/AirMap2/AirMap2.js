angular.module('AirMap2').controller('Airmap2Ctrl',function($scope, $http){

  var map = null;
  map = new OpenLayers.Map("map-canvas2");
  map.addLayer(new OpenLayers.Layer.OSM());
  // map.zoomToMaxExtent();
  var fromProjection = new OpenLayers.Projection("EPSG:4326");   // Transform from WGS 1984
  var toProjection   = new OpenLayers.Projection("EPSG:900913"); // to Spherical Mercator Projection
  var position = new OpenLayers.LonLat(-1.466944, 53.383611).transform( fromProjection, toProjection);
  var zoom           = 12; 
  map.setCenter(position, zoom );
  var markers = new OpenLayers.Layer.Markers( "Markers" );
  map.addLayer(markers);

  var size = new OpenLayers.Size(21,25);
  var offset = new OpenLayers.Pixel(-(size.w/2), -size.h);
  var marker = new OpenLayers.Icon('dist/bower_components/openlayers/img/marker.svg', size, offset);
  var diffusion_marker = new OpenLayers.Icon('dist/bower_components/openlayers/img/marker-blue.png', size, offset);
  var realtime_marker = new OpenLayers.Icon('dist/bower_components/openlayers/img/marker-gold.png', size, offset);
  var permit_marker = new OpenLayers.Icon('dist/bower_components/openlayers/img/marker-green.png', size, offset);

  $scope.markerPartial = 'AirMap2/partial/AirMap2/noSelection.html';

  function displayNotSelected() {
    $scope.markerPartial = 'AirMap2/partial/AirMap2/noSelection.html';
    $scope.$apply();
  }

  function displayRTMonitoring(uri, info) {
    $scope.markerPartial = 'AirMap2/partial/AirMap2/RTMonitoring.html';
    $scope.$apply();
    $scope.info = info;
  }

  function displayPermit(uri, info) {
    $scope.markerPartial = 'AirMap2/partial/AirMap2/Permit.html';
    $scope.$apply();
    $scope.info = info;
  }

  function displayDiffusion(uri) {
    console.log(uri);

      // Testing chart plugin
      // $scope.chartObject = {
       var co  = {
        "type": "AreaChart",
        "displayed": true,
        "data": {
          "cols": [
            {
              "id": "year",
              "label": "Year",
              "type": "string",
              "p": {}
            },
            {
              "id": "measurement-id",
              "label": "NO2 Measurement",
              "type": "number",
              "p": {}
            },
            {
              "id": "limit-id",
              "label": "EU Limit Value",
              "type": "number",
              "p": {}
            },
          ],
          "rows": [
          ]
        },
        "options": {
          "title": "NO2 Yearly Average",
          "isStacked": "false",
          "fill": 20,
          "displayExactValues": true,
          "vAxis": {
            "title": "µg/m3",
            "gridlines": {
              "count": 10
            }
          },
          "hAxis": {
            "title": "Date"
          }
        },
        "formatters": {}
      };

    // Fetch all types for the URI - then load the partial for each type
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
      if ( response.results.bindings != null ) {
        for ( var i=0; i<response.results.bindings.length; i++ ) {
          co.data.rows.push({c:[{v:response.results.bindings[i].start.value},{v:response.results.bindings[i].value.value}, {v:40}]});
        }
      }
    });

    $scope.chartObject = co;

    $scope.markerPartial = 'AirMap2/partial/AirMap2/DiffisionTube.html';
    $scope.$apply();
  }

  function clickAirMap2Marker(e) {
    if ( this.options.__type === 'Diffusion' ) {
      displayDiffusion(this.options.__id);
    }
    else if ( this.options.__type === 'Permit' ) {
      displayPermit(this.options.__id, this.options.__info);
    }
    else if ( this.options.__type === 'RTMonitoring' ) {
      displayRTMonitoring(this.options.__id, this.options.__info);
    }
    else {
      displayNotSelected();
    }
  }

  function update(map) {

    // Manually set the default image path, as when serving from a web server the app throws an
    // Error: Couldn't autodetect L.Icon.Default.imagePath, set it manually.
    // L.Icon.Default.imagePath = '../../../../bower_components/leaflet-dist/images/';
    // L.Icon.Default.imagePath = 'http://api.tiles.mapbox.com/mapbox.js/v1.0.0beta0.0/images';
    // L.Icon.Default.imagePath = '/bower_components/leaflet-dist/images';

    //Extend the Default marker class
    // Some icons at http://circusnow.org/wp-content/uploads/leaflet-maps-marker-icons/
    // var RedIcon = L.Icon.Default.extend({
    //   options: {
    //     iconUrl: 'http://circusnow.org/wp-content/uploads/leaflet-maps-marker-icons/Red-dot.png'
    //   }
    // });
    // var YellowIcon = L.Icon.Default.extend({
    //   options: {
    //     iconUrl: 'http://circusnow.org/wp-content/uploads/leaflet-maps-marker-icons/yellow-dot.png'
    //   }
    // });
    // var redIcon = new RedIcon();
    // var yellowIcon = new YellowIcon();

    // Get diffusion tubes
    $http.get("http://apps.opensheffield.org/sparql?default-graph-uri=&query=select+%3Fs+%3Fname+%3Flat+%3Flon%0D%0Awhere+%7B%0D%0A++%3Fs+a+%3Curi%3A%2F%2Fopensheffield.org%2Ftypes%23diffusionTube%3E+.%0D%0A++%3Fs+%3Chttp%3A%2F%2Fwww.w3.org%2F2000%2F01%2Frdf-schema%23label%3E+%3Fname+.%0D%0A++%3Fs+%3Chttp%3A%2F%2Fwww.w3.org%2F2003%2F01%2Fgeo%2Fwgs84_pos%23lat%3E+%3Flat+.%0D%0A++%3Fs+%3Chttp%3A%2F%2Fwww.w3.org%2F2003%2F01%2Fgeo%2Fwgs84_pos%23long%3E+%3Flon%0D%0A%7D%0D%0A&format=application%2Fsparql-results%2Bjson&timeout=0").success( function(data) {
      console.log("update 2 "+data.results.bindings.length);
      for ( var i = 0; i < data.results.bindings.length; i++ ) {   
        // console.log("%i %s %s %s %s",i,data.results.bindings[i].lat.value,data.results.bindings[i].lon.value,
        // data.results.bindings[i].name.value,data.results.bindings[i].s.value);
        // this.data.markers.push (L.marker( [data.results.bindings[i].lat.value,data.results.bindings[i].long.value])
                   // .bindPopup( lbl )
                   // .addTo(this.layer);

        // var marker = L.marker( [data.results.bindings[i].lat.value, data.results.bindings[i].lon.value],
       //                         {__id:data.results.bindings[i].s.value, __type:'Diffusion'}).addTo(map);
        // marker.on('click', clickAirMap2Marker);
        var p = new OpenLayers.LonLat(data.results.bindings[i].lon.value, data.results.bindings[i].lat.value).transform( fromProjection, toProjection);
        // markers.addMarker(new OpenLayers.Marker(p)); // ,diffusion_marker.clone()));
        markers.addMarker(new OpenLayers.Marker(p,diffusion_marker.clone()));

      }
    });

    // Get permits
    $http.get("http://apps.opensheffield.org/sparql?default-graph-uri=&query=select+%3Fs+%3Flat+%3Flon+%3Flabel+%3FaddrLabel+%3FdocUrl+%3Ftype+%3Fsection%0D%0Awhere+%7B+%0D%0A++%3Fs+a+%3Curi%3A%2F%2Fopensheffield.org%2Ftypes%23industrialPermit%3E+.%0D%0A++%3Fs+%3Chttp%3A%2F%2Fwww.w3.org%2F2003%2F01%2Fgeo%2Fwgs84_pos%23lat%3E+%3Flat+.%0D%0A++%3Fs+%3Chttp%3A%2F%2Fwww.w3.org%2F2003%2F01%2Fgeo%2Fwgs84_pos%23long%3E+%3Flon+.%0D%0A++%3Fs+%3Chttp%3A%2F%2Fwww.w3.org%2F2000%2F01%2Frdf-schema%23label%3E+%3Flabel+.%0D%0A++%3Fs+%3Curi%3A%2F%2Fopensheffield.org%2Fproperties%23permitAddressLabel%3E+%3FaddrLabel+.%0D%0A++%3Fs+%3Curi%3A%2F%2Fopensheffield.org%2Fproperties%23permitDocumentURI%3E+%3FdocUrl+.%0D%0A++%3Fs+%3Curi%3A%2F%2Fopensheffield.org%2Fproperties%23permitType%3E+%3Ftype+.%0D%0A++%3Fs+%3Curi%3A%2F%2Fopensheffield.org%2Fproperties%23permitSection%3E+%3Fsection+.%0D%0A%7D%0D%0Aorder+by+%3Fs&format=application%2Fsparql-results%2Bjson&timeout=0&debug=on").success( function(data) {
      for ( var i = 0; i < data.results.bindings.length; i++ ) {   
        // var marker = L.marker( [data.results.bindings[i].lat.value, data.results.bindings[i].lon.value],
        //                        {__id:data.results.bindings[i].s.value, 
        //                         __type:'Permit', 
        //                         icon:yellowIcon,
        //                         __info:data.results.bindings[i]}).addTo(map);
        // marker.on('click', clickAirMap2Marker);
        var p = new OpenLayers.LonLat(data.results.bindings[i].lon.value, data.results.bindings[i].lat.value).transform( fromProjection, toProjection);
        markers.addMarker(new OpenLayers.Marker(p,permit_marker.clone()));
      }
    });

    // Get Air Monitoring Stations
    $http.get("http://apps.opensheffield.org/sparql?default-graph-uri=&query=select+%3Fs+%3Flat+%3Flon+%3Fid+where+%7B%0D%0A++%3Fs+a+%3Chttp%3A%2F%2Fpurl.oclc.org%2FNET%2Fssnx%2Fssn%23SensingDevice%3E+.%0D%0A++%3Fs+%3Chttp%3A%2F%2Fwww.w3.org%2F2003%2F01%2Fgeo%2Fwgs84_pos%23lat%3E+%3Flat+.%0D%0A++%3Fs+%3Chttp%3A%2F%2Fwww.w3.org%2F2003%2F01%2Fgeo%2Fwgs84_pos%23long%3E+%3Flon+.%0D%0A++%3Fs+%3Curi%3A%2F%2Fopensheffield.org%2Fproperties%23sensorId%3E+%3Fid+.%0D%0A++FILTER%28NOT+EXISTS+%7B+%3Fs+a+%3Curi%3A%2F%2Fopensheffield.org%2Ftypes%23diffusionTube%3E+%7D+%29%0D%0A%7D%0D%0A&format=application%2Fsparql-results%2Bjson&timeout=0&debug=on").success( function(data) {
      for ( var i = 0; i < data.results.bindings.length; i++ ) {
        // var marker = L.marker( [data.results.bindings[i].lat.value, data.results.bindings[i].lon.value],
        //                        {__id:data.results.bindings[i].s.value,
        //                         __type:'RTMonitoring',
        //                         icon:redIcon,
        //                         __info:data.results.bindings[i]}).addTo(map);
        // marker.on('click', clickAirMap2Marker);
        var p = new OpenLayers.LonLat(data.results.bindings[i].lon.value, data.results.bindings[i].lat.value).transform( fromProjection, toProjection);
        // markers.addMarker(new OpenLayers.Marker(p,realtime_marker.clone()));
        markers.addMarker(new OpenLayers.Marker(p));
      }
    });


    // Get Alternative Fuels
  }



  // map = new L.Map('map-canvas2', {
  //   center: new L.LatLng(53.383611, -1.466944),
  //   zoom: 12
    // ,layers: [grayscale, cities]
  // });


  // map.addLayer(osm);

  update(map);

});
