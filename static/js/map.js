// Creating map object
var myMap_1 = L.map("map_1", {
  center: [40.7, -87.95],
  zoom: 4
});



// Adding tile layer to the map
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
}).addTo(myMap_1);

// Assemble API query URL
var url ="/2018metadata";
console.log(url);

var markers = L.markerClusterGroup();

d3.json(url).then((data) => {
  //console.log(data);
  
  data.forEach((company_info)=>{
    //console.log(company_info.longtitude);
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
  });
    
});
