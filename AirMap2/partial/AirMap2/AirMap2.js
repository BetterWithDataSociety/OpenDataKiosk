angular.module('AirMap2').controller('Airmap2Ctrl',function($scope, $http){

  var map = null;
  map = new ol.Map( { 
      // eventListeners: {
      //   featureclick: function(e) {
      //     console.log("Map says: " + e.feature.id + " clicked on " + e.feature.layer.name);
      //     clickAirMap2Marker(e.feature.data);
      //   }
      // },
      layers : [
        new ol.layer.Tile({
          source: new ol.source.OSM()
        })
      ],
      controls: ol.control.defaults({
        attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
          collapsible: false
        })
      }),
      target: 'map-canvas2',
      view: new ol.View({
        center: ol.proj.transform([-1.466944, 53.383611, 53.383611], 'EPSG:4326', 'EPSG:900913'),
        zoom: 12
      })

  });

  var layerListeners = {
    // featureclick: function(e) {
    //     console.log(e.object.name + " says: " + e.feature.id + " clicked.");
    //     return false;
    // },
    // nofeatureclick: function(e) {
    //     console.log(e.object.name + " says: No feature clicked.");
    // }
  };


  // See http://dev.openlayers.org/examples/feature-events.js for feature examples
  // var style_map = new ol.StyleMap({
  //   'default': ol.Util.applyDefaults(
  //       {label: "${l}", pointRadius: 10},
  //       ol.feature.Vector.style["default"]
  //   ),
  //   'select': ol.Util.applyDefaults(
  //       {pointRadius: 10},
  //       ol.feature.Vector.style.select
  //   )
  // });

  // map.zoomToMaxExtent();

  // var fromProjection = new ol.Projection("EPSG:4326");   // Transform from WGS 1984
  // var toProjection   = new ol.Projection("EPSG:900913"); // to Spherical Mercator Projection
  // var position = new ol.LonLat(-1.466944, 53.383611).transform( fromProjection, toProjection);
  // var zoom           = 12; 
  // map.setCenter(position, zoom );


  var markers = new ol.layer.Vector("Markers", {
    // Can't get this working L:( strategies : [ new ol.strategy.Cluster({threshold: 50}) ],
    // styleMap: style_map,
     eventListeners: layerListeners
  });

  map.addLayer(markers);

  // var size = new ol.Size(21,25);
  // var offset = new ol.Pixel(-(size.w/2), -size.h);
  // var marker = new ol.Icon('/dist/bower_components/openlayers/img/marker.svg', size, offset);
  // var diffusion_marker = new ol.Icon('/dist/bower_components/openlayers/img/marker-blue.png', size, offset);
  // var realtime_marker = new ol.Icon('/dist/bower_components/openlayers/img/marker-gold.png', size, offset);
  // var permit_marker = new ol.Icon('/dist/bower_components/openlayers/img/marker-green.png', size, offset);

  $scope.markerPartial = 'AirMap2/partial/AirMap2/noSelection.html';

  function displayNotSelected() {
    $scope.markerPartial = 'AirMap2/partial/AirMap2/noSelection.html';
    $scope.$apply();
  }

  function displayRTMonitoring(uri, info) {
    $scope.markerPartial = 'AirMap2/partial/AirMap2/RTMonitoring.html';
    $scope.uri = uri;
    $scope.info = info;

    var co = {
      lastDay : {
        "type": "AreaChart",
        "displayed": true,
        "data": {
          "cols": [
            {
              "id": "Timestamp",
              "label": "Hour and Date",
              "type": "string",
              "p": {}
            },
            {
              "id": "measurement-id",
              "label": "Measurement",
              "type": "number",
              "p": {}
            },
            // {
            //   "id": "limit-id",
            //   "label": "EU Limit Value",
            //   "type": "number",
            //   "p": {}
            // },
          ],
          "rows": [
          ]
        },
        "options": {
          "title": "Depends on measurement :: Last Day",
          "isStacked": "false",
          "fill": 20,
          "displayExactValues": true,
          "vAxis": {
            "title": "Hourly Average",
            "gridlines": {
              "count": 10
            }
          },
          "hAxis": {
            "title": "Date and hour",
            // slantedText:true,
            // slantedTextAngle:90,
            showTextEvery: 6,
            // "viewWindow":{max:48}
          }
        },
        "formatters": {}
      },
      lastMonth : {
        "type": "AreaChart",
        "displayed": true,
        "data": {
          "cols": [
            {
              "id": "Date",
              "label": "Date",
              "type": "string",
              "p": {}
            },
            {
              "id": "measurement-id",
              "label": "Measurement",
              "type": "number",
              "p": {}
            },
            {
              "id": "highest-id",
              "label": "Highest",
              "type": "number",
              "p": {}
            },
            {
              "id": "lowest-id",
              "label": "Lowest",
              "type": "number",
              "p": {}
            },
          ],
          "rows": [
          ]
        },
        "options": {
          "title": "Monthly average",
          "isStacked": "false",
          "fill": 20,
          "displayExactValues": true,
          "vAxis": {
            "title": "Hourly Average",
            "gridlines": {
              "count": 10
            }
          },
          "hAxis": {
            "title": "Date",
            // slantedText:true,
            // slantedTextAngle:90,
            showTextEvery: 6,
            // "viewWindow":{max:48}
          }
        },
        "formatters": {}
      }
    };

    // get last 24H measurements
    // select max(?day), max(?hour), avg(?observationValue)
    // where {
    //   graph ?g {
    //     ?s <uri://opensheffield.org/properties#sensor>  <uri://opensheffield.org/datagrid/sensors/Groundhog2/LD-Groundhog2_NO2.ic> .
    //     ?s a <http://purl.oclc.org/NET/ssnx/ssn#ObservationValue> .
    //     ?s <http://purl.oclc.org/NET/ssnx/ssn#endTime> ?observationTime.
    //     ?s <http://purl.oclc.org/NET/ssnx/ssn#hasValue> ?observationValue .
    //     BIND (bif:subseq( str( ?observationTime ),0,11) AS ?day) .
    //     BIND (bif:subseq( str( ?observationTime ),11,13) AS ?hour) .
    //     BIND (bif:subseq( str( ?observationTime ),0,13) AS ?dayhour) .
    //     FILTER ( xsd:date(?observationTime) > xsd:date("2014-10-13") && xsd:date(?observationTime) <=  xsd:date("2015-11-13") )  .
    //   }
    // }
    // GROUP BY ?dayhour
    // ORDER BY ?dayhour
    // Fetch all measurements
    var d = new Date();
    
    // Rewind 24H
    d.setDate(d.getDate() - 2);
    var startdate = d.getFullYear() + '-' + ('0' + (d.getMonth()+1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
    // FF 48H
    d.setDate(d.getDate() + 4);
    var enddate = d.getFullYear() + '-' + ('0' + (d.getMonth()+1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);

    $scope.startdate=startdate;
    $scope.enddate=enddate;
    var encoded_uri = encodeURIComponent(uri);

    var last_24h="http://apps.opensheffield.org/sparql?default-graph-uri=&query=select+max%28%3Fday%29%2C+max%28%3Fhour%29%2C+avg%28%3FobservationValue%29%0D%0Awhere+%7B%0D%0A++graph+%3Fg+%7B%0D%0A++++%3Fs+%3Curi%3A%2F%2Fopensheffield.org%2Fproperties%23sensor%3E+%3C"+encoded_uri+"%3E+.%0D%0A++++%3Fs+a+%3Chttp%3A%2F%2Fpurl.oclc.org%2FNET%2Fssnx%2Fssn%23ObservationValue%3E+.%0D%0A++++%3Fs+%3Chttp%3A%2F%2Fpurl.oclc.org%2FNET%2Fssnx%2Fssn%23endTime%3E+%3FobservationTime.%0D%0A++++%3Fs+%3Chttp%3A%2F%2Fpurl.oclc.org%2FNET%2Fssnx%2Fssn%23hasValue%3E+%3FobservationValue+.%0D%0A++++BIND+%28bif%3Asubseq%28+str%28+%3FobservationTime+%29%2C0%2C11%29+AS+%3Fday%29+.%0D%0A++++BIND+%28bif%3Asubseq%28+str%28+%3FobservationTime+%29%2C11%2C13%29+AS+%3Fhour%29+.%0D%0A++++BIND+%28bif%3Asubseq%28+str%28+%3FobservationTime+%29%2C0%2C13%29+AS+%3Fdayhour%29+.%0D%0A++++FILTER+%28+xsd%3Adate%28%3FobservationTime%29+%3E+xsd%3Adate%28%22"+startdate+"%22%29+%26%26+xsd%3Adate%28%3FobservationTime%29+%3C%3D++xsd%3Adate%28%22"+enddate+"%22%29+%29++%0D%0A++%7D%0D%0A%7D%0D%0AGROUP+BY+%3Fdayhour%0D%0AORDER+BY+%3Fdayhour%0D%0A%0D%0A%0D%0A&format=application%2Fsparql-results%2Bjson&timeout=0&debug=on";


    $http.get(last_24h).success( function(response) {
      console.log("Day range Response for %s : %o",encoded_uri,response);
      if ( response.results != null ) {
        if ( response.results.bindings != null ) {
          for ( var i=0; i<response.results.bindings.length; i++ ) {
            co.lastDay.data.rows.push({c:[{v: ( response.results.bindings[i]['callret-1'].value + ':00 ' + response.results.bindings[i]['callret-0'].value ) },
                                          {v:response.results.bindings[i]['callret-2'].value}, 
                                          {v:40}]});
          }
        }
      }
      else {
        console.log("no month range results for "+encoded_uri);
      }
    });

    // get last 31 readings with error bars
    // select max(?day), avg(?observationValue), max(?observationValue), min(?observationValue)
    // where {
    //   graph ?g {
    //     ?s <uri://opensheffield.org/properties#sensor> <uri://opensheffield.org/datagrid/sensors/Groundhog1/LD-Groundhog1_NO2.ic> .
    //     ?s a <http://purl.oclc.org/NET/ssnx/ssn#ObservationValue> .
    //     ?s <http://purl.oclc.org/NET/ssnx/ssn#endTime> ?observationTime.
    //     ?s <http://purl.oclc.org/NET/ssnx/ssn#hasValue> ?observationValue .
    //     BIND (bif:subseq( str( ?observationTime ),0,11) AS ?day) .
    //     FILTER ( xsd:date(?observationTime) > xsd:date("2015-05-09") && xsd:date(?observationTime) <=  xsd:date("2015-05-11") )  
    //   }
    // }
    // GROUP BY ?day
    // ORDER BY ?day
    d = new Date();
    enddate = d.getFullYear() + '-' + ('0' + (d.getMonth()+1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
    // Rewind 30D
    d.setDate(d.getDate() - 30);
    startdate = d.getFullYear() + '-' + ('0' + (d.getMonth()+1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);

    var last_month = "http://apps.opensheffield.org/sparql?default-graph-uri=&query=select+max%28%3Fday%29%2C+avg%28%3FobservationValue%29%2C+max%28%3FobservationValue%29%2C+min%28%3FobservationValue%29%0D%0Awhere+%7B%0D%0A++graph+%3Fg+%7B%0D%0A++++%3Fs+%3Curi%3A%2F%2Fopensheffield.org%2Fproperties%23sensor%3E+%3C"+encoded_uri+"%3E+.%0D%0A++++%3Fs+a+%3Chttp%3A%2F%2Fpurl.oclc.org%2FNET%2Fssnx%2Fssn%23ObservationValue%3E+.%0D%0A++++%3Fs+%3Chttp%3A%2F%2Fpurl.oclc.org%2FNET%2Fssnx%2Fssn%23endTime%3E+%3FobservationTime.%0D%0A++++%3Fs+%3Chttp%3A%2F%2Fpurl.oclc.org%2FNET%2Fssnx%2Fssn%23hasValue%3E+%3FobservationValue+.%0D%0A++++BIND+%28bif%3Asubseq%28+str%28+%3FobservationTime+%29%2C0%2C11%29+AS+%3Fday%29+.%0D%0A++++FILTER+%28+xsd%3Adate%28%3FobservationTime%29+%3E+xsd%3Adate%28%22"+startdate+"%22%29+%26%26+xsd%3Adate%28%3FobservationTime%29+%3C%3D++xsd%3Adate%28%22"+enddate+"%22%29+%29++%0D%0A++%7D%0D%0A%7D%0D%0AGROUP+BY+%3Fday%0D%0AORDER+BY+%3Fday%0D%0A%0D%0A%0D%0A&format=application%2Fsparql-results%2Bjson&timeout=0&debug=on";

    console.log(last_month);

    $http.get(last_month).success( function(response) {
      console.log("Month range Response for %s : %o",encoded_uri,response);
      if ( response.results != null ) {
        if ( response.results.bindings != null ) {
          for ( var i=0; i<response.results.bindings.length; i++ ) {
            co.lastMonth.data.rows.push({c:[{v:response.results.bindings[i]['callret-0'].value },
                                            {v:response.results.bindings[i]['callret-1'].value}, 
                                            {v:response.results.bindings[i]['callret-2'].value}, 
                                            {v:response.results.bindings[i]['callret-3'].value}, 
                                        ]});
          }
        }
      }
      else {
        console.log("no results for "+encoded_uri);
      }
   
    });

    // get yearly mean readings

    $scope.data = co;
    $scope.$apply();
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
            "title": "Hourly Average",
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
        // var p = new ol.geometry.Point(data.results.bindings[i].lon.value, data.results.bindings[i].lat.value).transform( fromProjection, toProjection);

        // markers.addFeatures([
        //     new ol.feature.Vector(p, 
        //                                   {
        //                                     type : 'Diffusion',
        //                                     uri : data.results.bindings[i].s.value,
        //                                   },
        //                                   {externalGraphic: '/dist/bower_components/openlayers/img/marker-blue.png', 
        //                                    graphicHeight: 25, 
        //                                    graphicWidth: 21, 
        //                                    graphicXOffset:-12, 
        //                                    graphicYOffset:-25 }),
        // ]);


      }
    });

    // Get permits
    $http.get("http://apps.opensheffield.org/sparql?default-graph-uri=&query=select+%3Fs+%3Flat+%3Flon+%3Flabel+%3FaddrLabel+%3FdocUrl+%3Ftype+%3Fsection%0D%0Awhere+%7B+%0D%0A++%3Fs+a+%3Curi%3A%2F%2Fopensheffield.org%2Ftypes%23industrialPermit%3E+.%0D%0A++%3Fs+%3Chttp%3A%2F%2Fwww.w3.org%2F2003%2F01%2Fgeo%2Fwgs84_pos%23lat%3E+%3Flat+.%0D%0A++%3Fs+%3Chttp%3A%2F%2Fwww.w3.org%2F2003%2F01%2Fgeo%2Fwgs84_pos%23long%3E+%3Flon+.%0D%0A++%3Fs+%3Chttp%3A%2F%2Fwww.w3.org%2F2000%2F01%2Frdf-schema%23label%3E+%3Flabel+.%0D%0A++%3Fs+%3Curi%3A%2F%2Fopensheffield.org%2Fproperties%23permitAddressLabel%3E+%3FaddrLabel+.%0D%0A++%3Fs+%3Curi%3A%2F%2Fopensheffield.org%2Fproperties%23permitDocumentURI%3E+%3FdocUrl+.%0D%0A++%3Fs+%3Curi%3A%2F%2Fopensheffield.org%2Fproperties%23permitType%3E+%3Ftype+.%0D%0A++%3Fs+%3Curi%3A%2F%2Fopensheffield.org%2Fproperties%23permitSection%3E+%3Fsection+.%0D%0A%7D%0D%0Aorder+by+%3Fs&format=application%2Fsparql-results%2Bjson&timeout=0&debug=on").success( function(data) {
      for ( var i = 0; i < data.results.bindings.length; i++ ) {   
        // var p = new ol.geometry.Point(data.results.bindings[i].lon.value, data.results.bindings[i].lat.value).transform( fromProjection, toProjection);
        // markers.addFeatures([
        //     new ol.feature.Vector(p, 
        //                                   {
        //                                     type : 'Permit',
        //                                     uri : data.results.bindings[i].s.value,
        //                                     lat : data.results.bindings[i].lat.value,
        //                                     lon : data.results.bindings[i].lon.value,
        //                                     label : data.results.bindings[i].label.value,
        //                                     addrLabel : data.results.bindings[i].addrLabel.value,
        //                                     docUrl : data.results.bindings[i].docUrl.value,
        //                                     permitType : data.results.bindings[i].type.value,
        //                                     section : data.results.bindings[i].section.value,
        //                                   },
        //                                   {externalGraphic: '/dist/bower_components/openlayers/img/marker-green.png', 
        //                                    graphicHeight: 25, 
        //                                    graphicWidth: 21, 
        //                                    graphicXOffset:-12, 
        //                                    graphicYOffset:-25 }),
        // ]);
      }
    });

    // Get Air Monitoring Stations
    
    $http.get("http://apps.opensheffield.org/sparql?default-graph-uri=&query=select+%3Fs+%3Flat+%3Flon+%3Fid+where+%7B%0D%0A++%3Fs+a+%3Chttp%3A%2F%2Fpurl.oclc.org%2FNET%2Fssnx%2Fssn%23SensingDevice%3E+.%0D%0A++%3Fs+%3Chttp%3A%2F%2Fwww.w3.org%2F2003%2F01%2Fgeo%2Fwgs84_pos%23lat%3E+%3Flat+.%0D%0A++%3Fs+%3Chttp%3A%2F%2Fwww.w3.org%2F2003%2F01%2Fgeo%2Fwgs84_pos%23long%3E+%3Flon+.%0D%0A++%3Fs+%3Curi%3A%2F%2Fopensheffield.org%2Fproperties%23sensorId%3E+%3Fid+.%0D%0A++FILTER%28NOT+EXISTS+%7B+%3Fs+a+%3Curi%3A%2F%2Fopensheffield.org%2Ftypes%23diffusionTube%3E+%7D+%29%0D%0A%7D%0D%0A&format=application%2Fsparql-results%2Bjson&timeout=0&debug=on").success( function(data) {
      for ( var i = 0; i < data.results.bindings.length; i++ ) {
        // var p = new ol.geometry.Point(data.results.bindings[i].lon.value, data.results.bindings[i].lat.value).transform( fromProjection, toProjection);
        // markers.addFeatures([
        //     new ol.feature.Vector(p, 
        //                                   {
        //                                     type : 'RTMonitoring',
        //                                     uri : data.results.bindings[i].s.value
        //                                   },
        //                                   {externalGraphic: '/dist/bower_components/openlayers/img/marker-gold.png', 
        //                                    graphicHeight: 25, 
        //                                    graphicWidth: 21, 
        //                                    graphicXOffset:-12, 
        //                                    graphicYOffset:-25 }),
        // ]);
      }
    });

  }

  // update(map);

});
