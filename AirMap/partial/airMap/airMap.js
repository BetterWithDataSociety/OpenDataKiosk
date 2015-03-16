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

  var cfg = {
          // radius should be small ONLY if scaleRadius is true (or small radius is intended)
          "radius": 0.05,
          "maxOpacity": 0.8, 
          // scales the radius based on map zoom
          "scaleRadius": true, 
          // if set to false the heatmap uses the global maximum for colorization
          // if activated: uses the data maximum within the current map boundaries 
          //   (there will always be a red spot with useLocalExtremas true)
          "useLocalExtrema": true,
          // which field name in your data represents the latitude - default "lat"
          latField: 'lat',
          // which field name in your data represents the longitude - default "lng"
          lngField: 'lng',
          // which field name in your data represents the data value - default "value"
          valueField: 'count'
  };

  var layer_options = [
    {id:'no2heatmap', label:'NO2', layer:new HeatmapOverlay(cfg), uri:'http://dbpedia.org/resource/NO2'},
    {id:'sulfurDioxide', label:'Sulfur Dioxide', layer:new HeatmapOverlay(cfg), uri:'http://dbpedia.org/resource/Sulfur_dioxide'},
    {id:'ozone', label:'Ozone', layer:new HeatmapOverlay(cfg), uri:'http://dbpedia.org/resource/Ozone'},
    {id:'cm', label:'Carbon Monoxide', layer:new HeatmapOverlay(cfg), uri:'http://dbpedia.org/resource/Carbon_monoxide'},
    {id:'pm25', label:'PM2.5', layer:new HeatmapOverlay(cfg), uri:'http://dbpedia.org/resource/PM_2.5'},
    {id:'pm10', label:'PM10', layer:new HeatmapOverlay(cfg), uri:'http://dbpedia.org/resource/PM_10'},
    {id:'atmos', label:'Atmospheric Pressure', layer:new HeatmapOverlay(cfg), uri:'http://dbpedia.org/resource/Atmospheric_pressure'},
    {id:'temp', label:'Outside Air Temperature', layer:new HeatmapOverlay(cfg), uri:'http://dbpedia.org/resource/Outside_air_temperature'},
  ];

  // var littleton = L.marker([39.61, -105.02]).bindPopup('This is Littleton, CO.'),
  // denver    = L.marker([39.74, -104.99]).bindPopup('This is Denver, CO.'),
  // aurora    = L.marker([39.73, -104.8]).bindPopup('This is Aurora, CO.'),
  // golden    = L.marker([39.77, -105.23]).bindPopup('This is Golden, CO.');
  var permits = L.layerGroup([]);
  // 
  
  var baseMaps = {
    // "Base Map": osm,
  };

  for (var i = 0; i < layer_options.length; i++) {
    baseMaps[layer_options[i].label] = layer_options[i].layer;
  }

  var overlayMaps = {
    "Permits": permits
  };


  L.control.layers(baseMaps, overlayMaps).addTo(map);

  map.addLayer(osm);
  map.addLayer(layer_options[0].layer);
  // map.addLayer(no2heatmap);
  // map.addLayer(noheatmap);

  map.invalidateSize();

});


function updateHeatmapLayer(uri,heatmaplayer) {

  testData.data = [{lat:0,lng:0,count:0}];
  heatmapLayer.setData(testData);
  testData.data = [];

  // Remove all existing markers
  for ( var i = 0; i < markers.length; i++ ) {
    map.removeLayer(markers[i]);
  }
  markers = [];

  // Here is the sparql query to get all latest NO2 readings
  $.ajax({
        url: "http://apps.opensheffield.org/sparql?default-graph-uri=&query=select+%3Fsensor%2C+%3Flat%2C+%3Flong%2C+%3Ftimestamp%2C+%3FobservationValue%0D%0Awhere+%7B%0D%0A++++%3Fobservation+%3Chttp%3A%2F%2Fpurl.oclc.org%2FNET%2Fssnx%2Fssn%23hasValue%3E+%3FobservationValue+.%0D%0A++++%3Fobservation+%3Chttp%3A%2F%2Fpurl.oclc.org%2FNET%2Fssnx%2Fssn%23endTime%3E+%3Ftimestamp+.%0D%0A++++%3Fobservation+%3Curi%3A%2F%2Fopensheffield.org%2Fproperties%23sensor%3E+%3Fsensor+.%0D%0A++++%3Fsensor+%3Chttp%3A%2F%2Fpurl.oclc.org%2FNET%2Fssnx%2Fssn%23MeasurementProperty%3E+"+encodeURIComponent('<'+uri+'>')+".%0D%0A++++%3Fsensor+%3Chttp%3A%2F%2Fwww.w3.org%2F2003%2F01%2Fgeo%2Fwgs84_pos%23long%3E+%3Flong+.%0D%0A++++%3Fsensor+%3Chttp%3A%2F%2Fwww.w3.org%2F2003%2F01%2Fgeo%2Fwgs84_pos%23lat%3E+%3Flat+.%0D%0A%0D%0A++++%7B%0D%0A++++++++select+%28max%28%3Fr%29+AS+%3Fobservation%29%0D%0A++++++++where+%7B%0D%0A++++++++++++%3Fr+a+%3Chttp%3A%2F%2Fpurl.oclc.org%2FNET%2Fssnx%2Fssn%23ObservationValue%3E+.%0D%0A++++++++++++%3Fr+%3Curi%3A%2F%2Fopensheffield.org%2Fproperties%23sensor%3E+%3Fsensor+.%0D%0A++++++++++++%3Fr+%3Chttp%3A%2F%2Fpurl.oclc.org%2FNET%2Fssnx%2Fssn%23endTime%3E+%3Fts+.++%0D%0A++++++++++++FILTER+%28+xsd%3AdateTime%28%3Fts%29+%3E+xsd%3AdateTime%28%272015-01-01+00%3A00%3A00%27%29+%29%0D%0A++++++++%7D%0D%0A++++++++GROUP+BY+%3Fsensor%0D%0A++++%7D%0D%0A%0D%0A++++%0D%0A%7D&format=json&timeout=0&debug=on",
  }).done(function(data) {

    for ( var i = 0; i < data.results.bindings.length; i++ ) {
      testData.data.push({lat:data.results.bindings[i].lat.value,
                          lng:data.results.bindings[i].long.value,
                          count:data.results.bindings[i].observationValue.value});

      // L.marker( [data.results.bindings[i].lat.value,data.results.bindings[i].long.value],{icon: L.divIcon({
      //   className: 'count-icon', html: data.results.bindings[i].observationValue.value, iconSize: [40, 40] })}).addTo(map);
      markers.push (L.marker( [data.results.bindings[i].lat.value,data.results.bindings[i].long.value])
             .bindPopup( data.results.bindings[i].observationValue.value )
             .addTo(map));
    }

    // console.log("%o",testData.data);
    heatmapLayer.setData(testData);
  });
}
