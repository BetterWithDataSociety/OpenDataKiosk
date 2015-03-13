angular.module('AirMap').controller('AirmapCtrl',function($scope){

  var heatmapLayer = null;
  var map = null;

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


  heatmapLayer = new HeatmapOverlay(cfg);

  map = new L.Map('map-canvas', {
          center: new L.LatLng(53.383611, -1.466944),
          zoom: 12,
          layers: [baseLayer, heatmapLayer]
  });

});
