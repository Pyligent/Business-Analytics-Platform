function BuildRecInfo(rec_url,num){
        var rec_info = d3.select("#rec_info").html("");
        
        d3.json(rec_url).then(function(info) {
             
            for (var i=1;i<info.length;i++){
                rec_info.append("div").attr("id","infotext")
                    .append("h5").text("[Business ID] " + `${info[0]['business_id']}`)
                     .append("h5").text("Rating " + `${info[0]['Rating']}`)
                        .append("h5").text("Category Keywords: " +`${info[0]["tokenized_category"]}`)
                        .append("p").text(`Recommend  ${i} [Business ID]:`+ `${info[i]['business_id']}`)
                            .append("p").text("Rating " + `${info[i]['Rating']}`)
                          .append("p").text("Category Keywords: " +`${info[i]["tokenized_category"]}`)
                           .append("p").text("Similarity Score: " +`${info[i]["Similarity_score"]}`)
    
            }
           });
    
    }

// Searching Form
var search_btn = d3.select("#search-btn");



search_btn.on("click", function(){
    // Prevent the page from refreshing
    d3.event.preventDefault();
    
    // Select the input element and get the raw HTML node
    var inputElement_idx = d3.select("#filter_value_idx");
    var inputElement_num = d3.select("#filter_value_num");
        
    // Get the value property of the input element
        var idx = inputElement_idx.property("value");
        var num = inputElement_num.property("value");

    // remove the space
    idx = idx.replace(/\s+/g, '');
    num = num.replace(/\s+/g, '');
    console.log(idx,num)
    d3.select("#infotext").remove();

    //BuildRecInfo(`/recsys/${idx}/${num}`,num)
    // Initial location :Toronto:[43.6532, -79.3832]
    var api_query = false;
    BuildMap(`/recsys/${idx}/${num}`,43.6532, -79.3832,5,api_query);

    reset_form();
   })

   // reset function
function reset_form(){
    d3.select("#infotext").remove();
    d3.select("#filter_value_idx").property("value"," ");
    d3.select("#filter_value_num").property("value"," ");
    }


//Table Card
// The Table Card

var columns = ["index","name","address","city","postal_code","categories","review_count","stars"];
var base_url ="/yelp_rec_metadata/pages/";
var url_1 ="/yelp_rec_metadata/pages/1";
var url = "/yelp_rec_metadata"

 
var page_count = 1;

function display_table(url){

  d3.json(url).then((data) => {

  var	tbody = d3.select('tbody');

  var rows = tbody.selectAll('tr')
                  .data(data)
                  .enter()
                  .append('tr');
 // console.log(data);
        
  // create a cell in each row for each column
  var cells = rows.selectAll('td')
                .data(function (row) {
                 // console.log(row);
                  return columns.map(function (column) {
                  return {column: column, value: row[column]};
                });
              })
              .enter()
              .append('td')
              .text(function (d) { return d.value; });

  });
};

function update_table(url){

  d3.json(url).then((data) => {

  var	tbody = d3.select('tbody');
  tbody.selectAll('tr').remove();

  var rows = tbody.selectAll('tr')
                  .data(data)
                  .enter()
                  .append('tr');
 // console.log(data);
        
  // create a cell in each row for each column
  var cells = rows.selectAll('td')
                .data(function (row) {
                 // console.log(row);
                  return columns.map(function (column) {
                  return {column: column, value: row[column]};
                });
              })
              .enter()
              .append('td')
              .text(function (d) { return d.value; });

  });
};



display_table(url_1);

var pre_page = d3.select("#pre_page");
var next_page = d3.select("#next_page");

next_page.on("click", function() {
  page_count++;
  url = base_url + page_count.toString();
  console.log(url);
  update_table(url);
  
});  

pre_page.on("click", function() {
  if (page_count<=1) {
    update_table(url_1);
    page_count = 1;
  } else {
    page_count--;
    url = base_url + page_count.toString();
    console.log(url);
    update_table(url);
  }
});  
 
//Build Rec Map

function BuildMap(url,init_lat,init_long,zoom_level,api_query){

    //Before initializing map check for is the map is already initiated or not
  
    var container = L.DomUtil.get('map');
    if(container != null){
            container._leaflet_id = null;
        }
  
    
    var myMap = L.map("map", {
        center: [init_lat, init_long],
        zoom: zoom_level
        });
       
  
  // Adding tile layer to the map
  L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  }).addTo(myMap);
  
  var markers = L.markerClusterGroup();
  
  
  var total_5stars_number;
  var total_45stars_number;
  var total_4stars_number;
  var total_35stars_number;
  var total_3stars_number;
  var total_25stars_number;
  var total_2stars_number;
  var total_15stars_number;
  var total_1stars_number;
  
  total_5stars_number = 0;
  total_45stars_number = 0;
  total_4stars_number = 0;
  total_35stars_number = 0;
  total_3stars_number = 0;
  total_25stars_number = 0;
  total_2stars_number = 0;
  total_15stars_number = 0;
  total_1stars_number = 0;
  
  
  
  
  var total_biz_number;
  total_biz_number = 0;
  
  var total_review_number;
  total_review_number = 0;
  
  
  d3.json(url).then((data) => {
    //console.log(data);
    data.forEach((company)=>{
        company_info = company[0];
        console.log(company_info);
        
         
        
  //Build the info-box
  
  
      var stars;
      total_biz_number =total_biz_number+1;
      switch (company_info.stars) {
        case 1:
          stars = "<span>&#9733;</span>";
          total_1stars_number +=1;
          break;
        case 1.5:
          stars = "<span>&#9733;</span><span>&#189;</span>";
          total_15stars_number +=1;
          break;
        case 2:
          stars = "<span>&#9733;</span><span>&#9733;</span>";
          total_2stars_number +=1;
          break;
        case 2.5:
          stars = "<span>&#9733;</span><span>&#9733;</span><span>&#189;</span>";
          total_25stars_number +=1;
          break;
        case 3:
          stars = "<span>&#9733;</span><span>&#9733;</span><span>&#9733;</span>";
          total_3stars_number +=1;
          break;
        case 3.5:
          stars = "<span>&#9733;</span><span>&#9733;</span><span>&#9733;</span><span>&#189;</span>";
          total_35stars_number +=1;
          break;
        case 4:
          stars = "<span>&#9733;</span><span>&#9733;</span><span>&#9733;</span><span>&#9733;</span>";
          total_4stars_number +=1;
          break;
        case 4.5:
          stars = "<span>&#9733;</span><span>&#9733;</span><span>&#9733;</span><span>&#9733;</span><span>&#189;</span>";
          total_45stars_number +=1;
          break;
        case 5:
          stars = "<span>&#9733;</span><span>&#9733;</span><span>&#9733;</span><span>&#9733;</span><span>&#9733;</span>";
          total_5stars_number = total_5stars_number+1;
          break;
        default:
          stars="";
      }
  
      if (company_info.review_count) {
        total_review_number = total_review_number+company_info.review_count;
        
      }
      
      if (company_info.longitude) {
      console.log(company_info.longitude);
      markers.addLayer(L.marker([company_info.latitude, company_info.longitude])
      .bindPopup("<h4>"+`${company_info.name}`+"</h4>"+
              `Address: ${company_info.address}`+"</h5><h5>"+
              `City: ${company_info.city}`+"</h5><h5>"+
              `Post Code: ${company_info.postal_code}`+"</h5><h5>"+
              `Review Counts: ${company_info.review_count}`+"</h5><h5>"+
              `Review Stars: ${stars}`+"</h5><hr><h6>"+
              `Categrories: ${company_info.categories}`+"</h6>"));
     console.log(stars);
       }
      
  
      // Add our marker cluster layer to the map
     myMap.addLayer(markers);
  
    });
    
  
  })}
  
  
  