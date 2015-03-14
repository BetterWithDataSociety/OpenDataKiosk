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
          "maxOpacity": .8, 
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
    {id:'no2heatmap', label:'NO2', layer:new HeatmapOverlay(cfg)},
    {id:'noheatmap', label:'NO', layer:new HeatmapOverlay(cfg)},
    {id:'sulfurDioxide', label:'Sulfur Dioxide', layer:new HeatmapOverlay(cfg)},
    {id:'ozone', label:'Ozone', layer:new HeatmapOverlay(cfg)},
    {id:'pm25', label:'PM2.5', layer:new HeatmapOverlay(cfg)},
    {id:'pm10', label:'PM10', layer:new HeatmapOverlay(cfg)},
    {id:'atmos', label:'Atmospheric Pressure', layer:new HeatmapOverlay(cfg)},
    {id:'temp', label:'Outside Air Temperature', layer:new HeatmapOverlay(cfg)},
  ];

  // var littleton = L.marker([39.61, -105.02]).bindPopup('This is Littleton, CO.'),
  // denver    = L.marker([39.74, -104.99]).bindPopup('This is Denver, CO.'),
  // aurora    = L.marker([39.73, -104.8]).bindPopup('This is Aurora, CO.'),
  // golden    = L.marker([39.77, -105.23]).bindPopup('This is Golden, CO.');
  var permits = L.layerGroup([]);
  // 
  
  var baseMaps = {
    // "Base": map,
  };

  for (var i = 0; i < layer_options.length; i++) {
    baseMaps[layer_options[i].label] = layer_options[i].layer;
  }

  var overlayMaps = {
    "Permits": permits
  };



  L.control.layers(baseMaps, overlayMaps).addTo(map);

  map.addLayer(osm);
  map.addLayer(no2heatmap);
  map.addLayer(noheatmap);

  map.invalidateSize();

});
