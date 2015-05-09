angular.module('AirMap2').controller('Airmap2Ctrl',function($scope, $http){

  var map = null;
  map = new OpenLayers.Map( { 
      div : "map-canvas2",
      eventListeners: {
        featureclick: function(e) {
          console.log("Map says: " + e.feature.id + " clicked on " + e.feature.layer.name);
          clickAirMap2Marker(e.feature.data);
        }
      }
  });

  var layerListeners = {
    featureclick: function(e) {
        console.log(e.object.name + " says: " + e.feature.id + " clicked.");
        return false;
    },
    nofeatureclick: function(e) {
        console.log(e.object.name + " says: No feature clicked.");
    }
  };


  // See http://dev.openlayers.org/examples/feature-events.js for feature examples
  var style_map = new OpenLayers.StyleMap({
    'default': OpenLayers.Util.applyDefaults(
        {label: "${l}", pointRadius: 10},
        OpenLayers.Feature.Vector.style["default"]
    ),
    'select': OpenLayers.Util.applyDefaults(
        {pointRadius: 10},
        OpenLayers.Feature.Vector.style.select
    )
  });

  map.addLayer(new OpenLayers.Layer.OSM());
  // map.zoomToMaxExtent();
  var fromProjection = new OpenLayers.Projection("EPSG:4326");   // Transform from WGS 1984
  var toProjection   = new OpenLayers.Projection("EPSG:900913"); // to Spherical Mercator Projection
  var position = new OpenLayers.LonLat(-1.466944, 53.383611).transform( fromProjection, toProjection);
  var zoom           = 12; 
  map.setCenter(position, zoom );


  // var markers = new OpenLayers.Layer.Markers( "Markers" );
  var markers = new OpenLayers.Layer.Vector("Markers", {
    styleMap: style_map,
     eventListeners: layerListeners
  });
  map.addLayer(markers);

  var size = new OpenLayers.Size(21,25);
  var offset = new OpenLayers.Pixel(-(size.w/2), -size.h);
  var marker = new OpenLayers.Icon('/dist/bower_components/openlayers/img/marker.svg', size, offset);
  var diffusion_marker = new OpenLayers.Icon('/dist/bower_components/openlayers/img/marker-blue.png', size, offset);
  var realtime_marker = new OpenLayers.Icon('/dist/bower_components/openlayers/img/marker-gold.png', size, offset);
  var permit_marker = new OpenLayers.Icon('/dist/bower_components/openlayers/img/marker-green.png', size, offset);

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
    // console.log(uri);

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

    // console.log("load data");

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

  function clickAirMap2Marker(info) {
    console.log("%o",info);
    if ( info.type === 'Diffusion' ) {
      displayDiffusion(info.uri);
    }
    else if ( info.type === 'Permit' ) {
      displayPermit(info.uri, info);
    }
    else if ( info.type === 'RTMonitoring' ) {
      displayRTMonitoring(info.uri, info);
    }
    else {
      displayNotSelected();
    }
  }

  function update(map) {

    // Get diffusion tubes
    $http.get("http://apps.opensheffield.org/sparql?default-graph-uri=&query=select+%3Fs+%3Fname+%3Flat+%3Flon%0D%0Awhere+%7B%0D%0A++%3Fs+a+%3Curi%3A%2F%2Fopensheffield.org%2Ftypes%23diffusionTube%3E+.%0D%0A++%3Fs+%3Chttp%3A%2F%2Fwww.w3.org%2F2000%2F01%2Frdf-schema%23label%3E+%3Fname+.%0D%0A++%3Fs+%3Chttp%3A%2F%2Fwww.w3.org%2F2003%2F01%2Fgeo%2Fwgs84_pos%23lat%3E+%3Flat+.%0D%0A++%3Fs+%3Chttp%3A%2F%2Fwww.w3.org%2F2003%2F01%2Fgeo%2Fwgs84_pos%23long%3E+%3Flon%0D%0A%7D%0D%0A&format=application%2Fsparql-results%2Bjson&timeout=0").success( function(data) {
      // console.log("update 2 "+data.results.bindings.length);
      for ( var i = 0; i < data.results.bindings.length; i++ ) {   
        var p = new OpenLayers.Geometry.Point(data.results.bindings[i].lon.value, data.results.bindings[i].lat.value).transform( fromProjection, toProjection);

        markers.addFeatures([
            new OpenLayers.Feature.Vector(p, 
                                          {
                                            type : 'Diffusion',
                                            uri : data.results.bindings[i].s.value,
                                          },
                                          {externalGraphic: '/dist/bower_components/openlayers/img/marker-blue.png', 
                                           graphicHeight: 25, 
                                           graphicWidth: 21, 
                                           graphicXOffset:-12, 
                                           graphicYOffset:-25 }),
        ]);


      }
    });

    // Get permits
    $http.get("http://apps.opensheffield.org/sparql?default-graph-uri=&query=select+%3Fs+%3Flat+%3Flon+%3Flabel+%3FaddrLabel+%3FdocUrl+%3Ftype+%3Fsection%0D%0Awhere+%7B+%0D%0A++%3Fs+a+%3Curi%3A%2F%2Fopensheffield.org%2Ftypes%23industrialPermit%3E+.%0D%0A++%3Fs+%3Chttp%3A%2F%2Fwww.w3.org%2F2003%2F01%2Fgeo%2Fwgs84_pos%23lat%3E+%3Flat+.%0D%0A++%3Fs+%3Chttp%3A%2F%2Fwww.w3.org%2F2003%2F01%2Fgeo%2Fwgs84_pos%23long%3E+%3Flon+.%0D%0A++%3Fs+%3Chttp%3A%2F%2Fwww.w3.org%2F2000%2F01%2Frdf-schema%23label%3E+%3Flabel+.%0D%0A++%3Fs+%3Curi%3A%2F%2Fopensheffield.org%2Fproperties%23permitAddressLabel%3E+%3FaddrLabel+.%0D%0A++%3Fs+%3Curi%3A%2F%2Fopensheffield.org%2Fproperties%23permitDocumentURI%3E+%3FdocUrl+.%0D%0A++%3Fs+%3Curi%3A%2F%2Fopensheffield.org%2Fproperties%23permitType%3E+%3Ftype+.%0D%0A++%3Fs+%3Curi%3A%2F%2Fopensheffield.org%2Fproperties%23permitSection%3E+%3Fsection+.%0D%0A%7D%0D%0Aorder+by+%3Fs&format=application%2Fsparql-results%2Bjson&timeout=0&debug=on").success( function(data) {
      for ( var i = 0; i < data.results.bindings.length; i++ ) {   
        var p = new OpenLayers.Geometry.Point(data.results.bindings[i].lon.value, data.results.bindings[i].lat.value).transform( fromProjection, toProjection);
        markers.addFeatures([
            new OpenLayers.Feature.Vector(p, 
                                          {
                                            type : 'Permit',
                                            uri : data.results.bindings[i].s.value,
                                            lat : data.results.bindings[i].lat.value,
                                            lon : data.results.bindings[i].lon.value,
                                            label : data.results.bindings[i].label.value,
                                            addrLabel : data.results.bindings[i].addrLabel.value,
                                            docUrl : data.results.bindings[i].docUrl.value,
                                            permitType : data.results.bindings[i].type.value,
                                            section : data.results.bindings[i].section.value,
                                          },
                                          {externalGraphic: '/dist/bower_components/openlayers/img/marker-green.png', 
                                           graphicHeight: 25, 
                                           graphicWidth: 21, 
                                           graphicXOffset:-12, 
                                           graphicYOffset:-25 }),
        ]);
      }
    });

    // Get Air Monitoring Stations
    $http.get("http://apps.opensheffield.org/sparql?default-graph-uri=&query=select+%3Fs+%3Flat+%3Flon+%3Fid+where+%7B%0D%0A++%3Fs+a+%3Chttp%3A%2F%2Fpurl.oclc.org%2FNET%2Fssnx%2Fssn%23SensingDevice%3E+.%0D%0A++%3Fs+%3Chttp%3A%2F%2Fwww.w3.org%2F2003%2F01%2Fgeo%2Fwgs84_pos%23lat%3E+%3Flat+.%0D%0A++%3Fs+%3Chttp%3A%2F%2Fwww.w3.org%2F2003%2F01%2Fgeo%2Fwgs84_pos%23long%3E+%3Flon+.%0D%0A++%3Fs+%3Curi%3A%2F%2Fopensheffield.org%2Fproperties%23sensorId%3E+%3Fid+.%0D%0A++FILTER%28NOT+EXISTS+%7B+%3Fs+a+%3Curi%3A%2F%2Fopensheffield.org%2Ftypes%23diffusionTube%3E+%7D+%29%0D%0A%7D%0D%0A&format=application%2Fsparql-results%2Bjson&timeout=0&debug=on").success( function(data) {
      for ( var i = 0; i < data.results.bindings.length; i++ ) {
        var p = new OpenLayers.Geometry.Point(data.results.bindings[i].lon.value, data.results.bindings[i].lat.value).transform( fromProjection, toProjection);
        markers.addFeatures([
            new OpenLayers.Feature.Vector(p, 
                                          {
                                            type : 'RTMonitoring',
                                            uri : 'Permit',
                                          },
                                          {externalGraphic: '/dist/bower_components/openlayers/img/marker-gold.png', 
                                           graphicHeight: 25, 
                                           graphicWidth: 21, 
                                           graphicXOffset:-12, 
                                           graphicYOffset:-25 }),
        ]);
      }
    });

  }

  update(map);

});
