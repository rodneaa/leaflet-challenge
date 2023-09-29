// Initialize the map with long, lat and zoom level
let myMap = L.map('map').setView([37.697948, -97.314835], 4); 

// Add a tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Define a markerSize() function that will give each city a different radius based on its population.
function markerSize(magnitude) {
    return Math.sqrt(magnitude) * 15;
  };

// Fetch earthquake data URL JSON file
fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson')
  .then(response => response.json())
  .then(data => {
    // Create a GeoJSON layer for earthquakes
    L.geoJSON(data, {
      pointToLayer: function (feature, latlng) {
        // Create a circle marker for each earthquake
        return L.circleMarker(latlng, {
          radius: markerSize(feature.properties.mag),
          fillColor: getColor(feature.properties.mag), 
          color: '#000',
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8
        }).bindPopup(
          'Magnitude: ' + feature.properties.mag + '<br>' +
          'Location: ' + feature.properties.place
        );
      }
    }).addTo(myMap);
  });

// Define a getColor function to set circle marker colors based on earthquake magnitude
function getColor(magnitude) {
  return magnitude >= 6 ? '#722f37' :
         magnitude >= 5 ? '#a8516e' :
         magnitude >= 4 ? '#b53389' :
         magnitude >= 3 ? '#c84186 ' :
         magnitude >= 2 ? '#d470a2' :
         magnitude >= 1 ? '#f38fa9 ' :
         magnitude >= 0.5 ? '#ffbcd9' :
                         '#fddde6 ';
};
