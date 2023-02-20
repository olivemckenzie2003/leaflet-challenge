# leaflet-challenge

Project background:

The United States Geological Survey, or USGS for short, is responsible for providing scientific data about natural hazards, the health of our ecosystems and environment, and the impacts of climate and land-use change. Their scientists develop new methods and tools to supply timely, relevant, and useful information about the Earth and its processes.

The USGS is interested in building a new set of tools that will allow them to visualize their earthquake data. They collect a massive amount of data from all over the world each day, but they lack a meaningful way of displaying it. In this challenge, you have been tasked with developing a way to visualize USGS data that will allow them to better educate the public and other government organizations (and hopefully secure more funding) on issues facing our planet.


Leaflet faciltates easy display of tiled web maps hosted on a public server without the knowledge of a GIS and it comes with optional tiled overlays. It also loads feature data from  GeoJSON files for which interactive layers are created , some of which are markers with popups when clicked.


D3 is a JavaScript library and framework for creating visualizations. D3 creates visualizations by binding the data and graphical elements to the Document Object Model (DOM). This allows the user to manipulate, change or add to the DOM.


"D3 and Leaflet use different APIs for rendering shapes and projecting points. Fortunately, it’s easy to adapt Leaflet’s API to fit D3 by implementing a custom geometric transformation." ref: https://bost.ocks.org/mike/leaflet/


The aim of section One of this Leaflet challenge is to import and visualize the data by doing the following:

        -Using Leaflet, create a map that plots all the earthquakes from your dataset based on their longitude and latitude.
        -Data markers should reflect the magnitude of the earthquake by their size and the depth of the earthquake by color. 
        -Earthquakes with higher magnitudes should appear larger, and earthquakes with greater depth should appear darker in color.
        -Hint: The depth of the earth can be found as the third coordinate for each earthquake.
        -Include popups that provide additional information about the earthquake when its associated marker is clicked.
        -Create a legend that will provide context for your map data.
        
        The starter code is downloaded onto personal computer and it contains a "logic.js", index.HTML and style.cs 


Part One

used https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson link to obtain earthquake data


![Screenshot (1237)](https://user-images.githubusercontent.com/115945473/220160829-bc78269d-8698-4b92-aeb1-dfbbbf90ef42.png)




Inside file "logic.js"

Method used to import imported JSON data into file "logic.js".

let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";    


Markers are created where the size increases with magnitude ("mag" in JSON file) and color becomes darker with increasing depth which is the third value in the geometry section of the JSON file the first and second value are the Longitude and the Latitude. 


d3.json(queryUrl).then(function(earthquakeData) {
        console.log(earthquakeData);
        createFeatures(earthquakeData.features);

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




"feature.geometry.coordinates[2]" is the method of accessing the depth value from geometry subsection which has three values.




"The GeoJsonLayer renders GeoJSON formatted data as polygons, lines and points (circles, icons and/or texts). GeoJsonLayer is a CompositeLayer. See the sub layers that it renders" Google



Popup messages are created showing location, magnitude and depth of the earthquake which are displayed when circle indicating the location of an earthquake is clicked on. A GeoJSONLayer is used to convert the marker information into circles.


function createFeatures(earthquakeData) {
    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3>Location:</h3> ${feature.properties.place}<h3> Magnitude:</h3> ${feature.properties.mag}<h3> Depth:</h3> ${feature.geometry.coordinates[2]}`);
    }

    let earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: createMarker
    });
    
    
    
    
The popup information is sent to the map
    createMap(earthquakes);



These sections of code creates the layers of maps for exampe there is the street map and the topograhic map. Basemap objects are created to hold streetmap and topographic map. Overlay object is created to hold the overlay which is the eatrthquake marker and popup information.




function createMap(earthquakes) {
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
        
    };

   Give the map a starting coordinate position 
    let myMap = L.map("map", {
        center: [37.09, -95.71],
        zoom: 5,
        layers: [street, earthquakes]
    });
    
    
    

A legend is basically a color map which describes the color that fills the markers which are different ranges of depeth values and also the position where it appears on the map can be defined. In this instance it is the bottomright that is stipulated.
    
    
    
    
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




Increase the magnitude by multiplying it by 5 and then assign a color a color to depend on the range of its value


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

});




In the style.css file additional code was inserted to add the legend to the map
html,
body,
#map {
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
}
.legend {
  padding: 10px;
  line-height: 18px;
  color: #555;
  background-color: #fff;
  border-radius: 5px;
}
.legend i {
  float: left;
  width: 18px;
  height: 18px;
  margin-right: 8px;
  opacity: 0.7;
}


The HTML file contains bootstrap and references to leaflet.css,leaflet.js,style.css, d3js, onfig.js and logic.js 


<link rel="stylesheet" href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
<script src="https://unpkg.com/leaflet@1.6.0/dist/leaflet.js"


<link rel="stylesheet" type="text/css" href="static/css/style.css">


<script src="https://d3js.org/d3.v5.min.js"></script>

<script type="text/javascript" src="static/js/config.js"></script>

<script type="text/javascript" src="static/js/logic.js"></script>





Part Two 

Plot a second dataset on your map to illustrate the relationship between tectonic plates and seismic activity. You will need to pull in this dataset and visualize it alongside your original data. Data on tectonic plates can be found at https://github.com/fraxen/tectonicplates

A few extra lines of code were added ma1nly in existing functions which were as follows:


The the PB2002_plates.json file contains tictonic plate data and is assigned to a variable plateUrl which is used with

let plateUrl = "static/data/PB2002_plates.json"

To make a request query to the plates.json file for plates feature data use

d3.json(plateUrl).then(function(plateData) 


// Perform a GET request to the query URL
d3.json(queryUrl).then(function(earthquakeData,) {
    d3.json(plateUrl).then(function(plateData) {
        console.log(earthquakeData);
        console.log(plateData);
        createFeatures(earthquakeData.features,plateData.features );
    
    });
});


"GeoJson. Represents a GeoJSON object or an array of GeoJSON objects, which allows the parsing of GeoJSON data and displays it on the map. Extends FeatureGroup." Google


This section of code creates the plates popup feature data by accessing the PB2002_plates.json file through plateData and use L.geoJson to dispay parse GeoJSON data and display it on the map


function createFeatures(earthquakeData, plateData) {
    
        var plates = L.geoJson(plateData, {
        onEachFeature: function (feature, layer) {
          layer.bindPopup("<h3>" + feature.properties.PlateName + "</h3>");
          
        }
      });

    // Send earthquakes layer to the createMap function
    createMap(earthquakes, plates);
}

function createMap(earthquakes,plates) {
    
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


//modified code //https://github.com/jonkwiatkowski/Leaflet/blob/main/static/js/logic.js 





![Screenshot (1250)](https://user-images.githubusercontent.com/115945473/220160824-cdb95dde-c56a-4c56-bd88-ee6dd16976c9.png)
![Screenshot (1236)](https://user-images.githubusercontent.com/115945473/220160827-54079572-0b73-417d-852d-ee62d6a06dce.png)

![Screenshot (1238)](https://user-images.githubusercontent.com/115945473/220160833-13e87cea-7806-425c-94c1-1b8355c52637.png)
![Screenshot (1239)](https://user-images.githubusercontent.com/115945473/220160836-04a29918-be6d-4f42-a7e2-daaaf4918973.png)
![Screenshot (1240)](https://user-images.githubusercontent.com/115945473/220160838-947d4a5c-609a-4996-a902-fc6fe80ab90d.png)
![Screenshot (1241)](https://user-images.githubusercontent.com/115945473/220160841-acbfc942-fa57-4251-9250-77765d37f69d.png)
![Screenshot (1242)](https://user-images.githubusercontent.com/115945473/220160844-3a6f8533-5709-4b5e-a2a9-9b8c2b2d4203.png)
![Screenshot (1243)](https://user-images.githubusercontent.com/115945473/220160850-4b6c2988-b4ac-40e7-8826-7dc828452825.png)
![Screenshot (1244)](https://user-images.githubusercontent.com/115945473/220160855-5e78efd7-01f7-47e4-8f5e-00d006240056.png)
![Screenshot (1245)](https://user-images.githubusercontent.com/115945473/220160857-aafe68bf-cd9a-45e3-aa1a-3bb9bfd085da.png)
![Screenshot (1246)](https://user-images.githubusercontent.com/115945473/220160858-4cc78fe1-8122-4988-b76e-0bfbf5dcc593.png)
![Screenshot (1247)](https://user-images.githubusercontent.com/115945473/220160859-47fa9861-89ca-4ac9-8002-73a19f448ba3.png)
![Screenshot (1248)](https://user-images.githubusercontent.com/115945473/220160860-0ea2e41a-652e-4c41-9dd6-51fea6de739c.png)
![Screenshot (1249)](https://user-images.githubusercontent.com/115945473/220160861-f3947c13-4fd7-4da1-944c-27d2415b74ef.png)




