// Initialize the map with long, lat and zoom level
let myMap = L.map('map').setView([37.697948, -97.314835], 3);

// Add a tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Define a markerSize() function that will give each city a different radius based on its population.
function markerSize(magnitude) {
  return Math.sqrt(magnitude) * 12;
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
          fillColor: getColor(feature.geometry.coordinates[2]),
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

// Define a getColor function to set circle marker colors based on earthquake's depth
function getColor(depth) {
  return depth >= 80 ? '#3a1b2f' :
    depth >= 65 ? '#461257' :
      depth >= 50 ? '#51087E ' :
        depth >= 35 ? '#7921b1 ' :
          depth >= 20 ? '#b24bf3' :
            depth >= 10 ? '#ce8cf8 ' :
              depth >= 5 ? '#d7a1f9' :
                '#fddde6 ';
};

// Add a legend
let legend = L.control({ position: 'bottomright' });

function addLegend() {
  let div = L.DomUtil.create('div', 'info legend');
  let depth = [5, 10, 20, 35, 50, 65, 80];

  div.innerHTML += '<h4> Earthquake Depth </h4>';

  // Loop through the data values and generate a label with a colored square for each interval
  for (let i = 0; i < depth.length; i++) {
    div.innerHTML +=
    '<div class="legend-item">' +
    '<i class="legend-square" style="background:' + getColor(depth[i] + 1) + '"></i> ' +
    depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
}

  // Append the legend to the container with the specified ID
  document.getElementById('legend-container').appendChild(div);

  return div;
}

legend.onAdd = addLegend;
legend.addTo(myMap);