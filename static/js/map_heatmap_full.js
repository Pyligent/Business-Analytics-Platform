// Creating map object
var myMap_1 = L.map("map_1", {
  center: [43.6532, -79.3832],
  zoom: 13
});



// Adding tile layer to the map
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
}).addTo(myMap_1);

// Assemble API query URL
var url ="/yelp_metadata";
console.log(url);



d3.json(url).then(data=> {

  var heatArray = [];
  data.forEach((company_info)=>{
    if (company_info.longitude) {
       console.log(company_info.longitude)
       heatArray.push([company_info.latitude, company_info.longitude]);
   
       }
     })


  var heat = L.heatLayer(heatArray, {
    radius: 20,
    blur: 35
  }).addTo(myMap_1);

});




