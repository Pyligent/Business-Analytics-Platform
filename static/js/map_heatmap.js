

// Adding tile layer to the map
var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
});

var satellitemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets-satellite",
  accessToken: API_KEY
});


// Assemble API query URL
var url ="/yelp_metadata";
console.log(url);



// Layer Markers



var rating5_markers = L.layerGroup();
var rating4_markers = L.layerGroup();
var rating3_markers = L.layerGroup();
var rating12_markers = L.layerGroup();

var Buble_Rev5_markers = L.layerGroup();
var Buble_Rev4_markers = L.layerGroup();
var Buble_Rev3_markers = L.layerGroup();
var Buble_Rev12_markers = L.layerGroup();


//color function
function getColor(d) {
  return d > 1000  ? '#996515' :
         d > 550  ? '#D2691E' :
         d > 200  ? '#CD853F' :
         d > 100  ? '#FF8C00' :
         d > 50   ? '#FFA500' :
         d > 0 ? '#FFD700' :
                    '#FAFAD2';
};




d3.json(url).then(data=> {

  var heatArray5 = [];
  var heatArray4 = [];
  var heatArray3 = [];
  var heatArray12 = [];
  
  data.forEach((company_info)=>{
    if (company_info.longitude) {
       //console.log(company_info.longitude)
      if (company_info.stars == 5){
        heatArray5.push([company_info.latitude, company_info.longitude]);
        L.circle([company_info.latitude, company_info.longitude], {
          stroke: false,
         fillOpacity: 0.75,
          color: "red",
          fillColor: getColor(company_info.review_count),
          radius: company_info.review_count/2
        }).addTo(Buble_Rev5_markers);    

      } 
      else if ((company_info.stars == 4.5)||(company_info.stars == 4))
      {
        heatArray4.push([company_info.latitude, company_info.longitude]);
        L.circle([company_info.latitude, company_info.longitude], {
          stroke: false,
         fillOpacity: 0.75,
          color: "red",
          fillColor: getColor(company_info.review_count),
          radius: company_info.review_count/4
        }).addTo(Buble_Rev4_markers);    

      } 
      else if ((company_info.stars == 3.5)||(company_info.stars == 3))
      {
        heatArray3.push([company_info.latitude, company_info.longitude]);
        L.circle([company_info.latitude, company_info.longitude], {
          stroke: false,
         fillOpacity: 0.75,
          color: "red",
          fillColor: getColor(company_info.review_count),
          radius: company_info.review_count/4
        }).addTo(Buble_Rev3_markers);    

      } else 
      {
        heatArray12.push([company_info.latitude, company_info.longitude]);
        L.circle([company_info.latitude, company_info.longitude], {
          stroke: false,
         fillOpacity: 0.75,
          color: "red",
          fillColor: getColor(company_info.review_count),
          radius: company_info.review_count
        }).addTo(Buble_Rev12_markers);    

      }
}
     
        
})
          
  L.heatLayer(heatArray5, {
    radius: 20,
    blur: 35
  }).addTo(rating5_markers);

  L.heatLayer(heatArray4, {
    radius: 20,
    blur: 35
  }).addTo(rating4_markers);

  L.heatLayer(heatArray3, {
    radius: 20,
    blur: 35
  }).addTo(rating3_markers);

  L.heatLayer(heatArray12, {
    radius: 20,
    blur: 35
  }).addTo(rating12_markers);
});




// Create a baseMaps object
var baseMaps = {
  "Street Map": streetmap,
  "Satellite Map": satellitemap
};

// Create an overlay object
var overlayMaps = {
  "Rating: 5 Stars": rating5_markers,
  "Rating: 4+ Stars": rating4_markers,
  "Rating: 3+ Stars":rating3_markers,
  "Rating: below 3 Stars":rating12_markers,
  "5 Stars Review Counts": Buble_Rev5_markers,
  "4+ Stars Review Counts": Buble_Rev4_markers,
  "3+ Stars Review Counts": Buble_Rev3_markers,
  "Below 3 Stars Review Counts": Buble_Rev12_markers
 
 };

// Creating map object
var myMap_1 = L.map("map_1", {
  center: [43.6532, -79.3832],
  zoom: 13,
  layers:[streetmap,rating5_markers,Buble_Rev5_markers]
});


// Pass our map layers into our layer control
// Add the layer control to the map
L.control.layers(baseMaps, overlayMaps, {
  collapsed: false
}).addTo(myMap_1);
addLegend(myMap_1)

//Add Legend

function addLegend(map){


  var legend = L.control({position: 'bottomright'});
  
      legend.onAdd = function () {
  
      var div = L.DomUtil.create('div', 'info legend');
      var level = [0,50,100,200,550,1000];
      var divItem =[];
      
      for (var i = 0; i < level.length; i++) {
        divItem.push("<i style=background:"+getColor(level[i] + 1)+"></i>" + level[i] + (level[i + 1] ? " - " + level[i + 1]:"+"));
      }
      div.innerHTML = divItem.join('<br>');
      return div;
    };
  
    legend.addTo(map);
  }
  


