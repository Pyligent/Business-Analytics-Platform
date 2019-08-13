


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
var url ="/2018metadata";
console.log(url);

// Layer Markers

var Buble_Grow_markers = L.layerGroup();
var Buble_Rev_markers = L.layerGroup();


var markers = L.markerClusterGroup();

//color function
function getColor(d) {
  return d > 6000 ? '#800026' :
         d > 5000  ? '#BD0026' :
         d > 2000  ? '#E31A1C' :
         d > 1000  ? '#FC4E2A' :
         d > 500  ? '#FD8D3C' :
         d > 200   ? '#FEB24C' :
         d > 100  ? '#FED976' :
                    '#FFEDA0';
};


d3.json(url).then((data) => {
  //console.log(data);
  
  data.forEach((company_info)=>{
    //console.log(company_info.longtitude);
   // json_list_2018.push(company_info);
    if (company_info.longtitude) {
      var cordinate = [company_info.latitude, company_info.longtitude];
      if (company_info.Growth) {
        var growth_format = company_info.Growth.toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")+"%";
        }else {
          var growth_format =" ";
        }
      if (company_info.Revenue) {
      var revenue_format = '$' + company_info.Revenue.toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
      } else {
        var revenue_format = " "
      }

      if (company_info.longtitude) {
        markers.addLayer(L.marker([company_info.latitude, company_info.longtitude])
        .bindPopup("<h5><b>"+`Rank: ${company_info.Rank}`+"</b></h5><p><a href="+`${company_info.Website}`+">"+ `${company_info.Website}`+"</a></p><h6>"+`Company Name: ${company_info.Company}`+"</h6><h6><b>"+`City: ${company_info.City} ;  State: ${company_info.State}`+"</b></h6><h6>"+`Growth: ${growth_format}`+"</h6><h6>"+`Revenue: ${revenue_format}`+"</h6>"))
         }
        
        
        // Add our marker cluster layer to the map
        myMap_1.addLayer(markers);
      
  
      L.circle(cordinate, {
          stroke: false,
          fillOpacity: 0.75,
          color: "red",
          fillColor: getColor(company_info.Growth),
          radius: company_info.Growth*2
       }).bindPopup("<h5><b>"+`Rank: ${company_info.Rank}`+"</b></h5><p><a href="+`${company_info.Website}`+">"+ `${company_info.Website}`+"</a></p><h6>"+`Company Name: ${company_info.Company}`+"</h6><h6><b>"+`City: ${company_info.City} ;  State: ${company_info.State}`+"</b></h6><h6>"+`Growth: ${growth_format}`+"</h6><h6>"+`Revenue: ${revenue_format}`+"</h6>")
       .addTo(Buble_Grow_markers);

      
      L.circle(cordinate, {
          stroke: false,
          fillOpacity: 0.75,
          color: "red",
          fillColor: "yellow",
          radius: company_info.Revenue/100000
       }).bindPopup("<h5><b>"+`Rank: ${company_info.Rank}`+"</b></h5><p><a href="+`${company_info.Website}`+">"+ `${company_info.Website}`+"</a></p><h6>"+`Company Name: ${company_info.Company}`+"</h6><h6><b>"+`City: ${company_info.City} ;  State: ${company_info.State}`+"</b></h6><h6>"+`Growth: ${growth_format}`+"</h6><h6>"+`Revenue: ${revenue_format}`+"</h6>")
       .addTo(Buble_Rev_markers); 
    }
  });
    
});



// Create a baseMaps object
var baseMaps = {
    "Street Map": streetmap,
    "Satellite Map": satellitemap
  };

// Create an overlay object
var overlayMaps = {
    "Growth(%)": Buble_Grow_markers,
    "Revenue(10K)":Buble_Rev_markers
   };

// Creating map object
var myMap_1 = L.map("map_1", {
    center: [40.7, -87.95],
    zoom: 4,
    layers:[streetmap,Buble_Grow_markers]
  });
  
  

// Pass our map layers into our layer control
// Add the layer control to the map
L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap_1);
  