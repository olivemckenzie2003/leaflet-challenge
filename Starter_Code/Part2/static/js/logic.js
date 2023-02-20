let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
let plateUrl = "static/data/PB2002_plates.json"

// Perform a GET request to the query URL
d3.json(queryUrl).then(function(earthquakeData,) {
    d3.json(plateUrl).then(function(plateData) {
        console.log(earthquakeData);
        console.log(plateData);
        createFeatures(earthquakeData.features,plateData.features );
    
    });
});


// Create markers where the size increases with magnitude and color becomes darker with increasing depth
function createMarker(feature, latlng) {
    return L.circleMarker(latlng, {
        radius: markerSize(feature.properties.mag),
        fillColor: markerColor(feature.geometry.coordinates[2]),
        color:"#000",
        weight: 0.5,
        opacity: 0.5,
        fillOpacity: 1
    });
}



function createFeatures(earthquakeData, plateData) {
    
    //Run for each feature in the features array.
    //Popup displays location , magnitude and depth of earth quake
    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3>Location:</h3> ${feature.properties.place}<h3> Magnitude:</h3> ${feature.properties.mag}<h3> Depth:</h3> ${feature.geometry.coordinates[2]}`);
    }

    // GeoJSON layer that contains the features array on the earthquakeData object.
    // Run the onEachFeature function for each piece of data in the array.
    let earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: createMarker
    });


    var plates = L.geoJson(plateData, {
        onEachFeature: function (feature, layer) {
          layer.bindPopup("<h3>" + feature.properties.PlateName + "</h3>");


          function onEachFeature(feature, layer) {
            layer.bindPopup(`<h3>Location:</h3> ${feature.properties.place}<h3> Magnitude:</h3> ${feature.properties.mag}<h3> Depth:</h3> ${feature.geometry.coordinates[2]}`);
        }

          
        }
      });

    // Send earthquakes layer to the createMap function
    createMap(earthquakes, plates);
}

function createMap(earthquakes,plates) {
    // Create the base layers
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      });

    let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
      
    
    
    });





    

    // Create a baseMaps object
    let baseMaps = {
        "Street Map": street,
        "Topographic Map": topo
    };

    // Create an overlay object to hold our overlay.
    let overlayMaps = {
        "Earthquakes": earthquakes,
        "Tectonic Plates":plates
        
    };

    // Create map
    let myMap = L.map("map", {
        center: [37.09, -95.71],
        zoom: 5,
        layers: [street, earthquakes,plates]
    });

    // Create a control
    // Pass in baseMaps and overlayMaps
    // Add the control to the map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap); 
    
    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function () {

        var div = L.DomUtil.create('div', 'info legend');
            
        var grades = [-10, 10, 30, 50,70, 90];
           

          var colors = [
            "#98EE00",
            "#D4EE00",
            "#EECC00",
            "#EE9C00",
            "#EA822C",
            "#EA2C2C"
          ];

        for (let i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + colors[i] + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');


                
        }    

        return div;

        };

        // Add legend to map
        legend.addTo(myMap);
}

// Increase marker size based on magnitude
function markerSize(magnitude) {
    return magnitude * 5;
}

// Change marker color based on depth
function markerColor(depth) {
    return depth > 90 ? "#EA2C2C" :
            depth > 70 ? "#EA822C" :
            depth > 50 ? "#EE9C00" :
            depth > 30 ? "#EECC00" :
            depth > 10 ? "#D4EE00" :
                          "#98EE00" ;          
}

//modified code //https://github.com/jonkwiatkowski/Leaflet/blob/main/static/js/logic.js 
// modified code https://github.com/richardkyu/Leaflet-Earthquake-Project/blob/master/index.html

