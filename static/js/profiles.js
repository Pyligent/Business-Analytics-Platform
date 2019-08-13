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
var json_list = [];


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
  data.forEach((company_info)=>{
    var business_status;
    json_list.push(company_info);
       
       
      
//Build the info-box


    if (company_info.is_open) {
      business_status = "Open";
    } else {
      business_status = "Not Open";
    }
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
    if (api_query){
    markers.addLayer(L.marker([company_info.latitude, company_info.longitude])
    .bindPopup("<h4>"+`${company_info.name}`+"</h4>"+
            "<img src='" + company_info.img_url + "'/ width='50' height='50'><hr><h5>" +
            `Address: ${company_info.address}`+"</h5><h5>"+
            `City: ${company_info.city},  Province: ${company_info.state}`+"</h5><h5>"+
            `Post Code: ${company_info.postal_code}`+"</h5><h5>"+
            `Phone: ${company_info.phone}`+"</h5><h5>"+
            `Business Status: ${business_status}`+"</h5><h5>"+
            `Review Counts: ${company_info.review_count}`+"</h5><h5>"+
            `Review Stars: ${stars}`+"</h5><hr><h6>"+
            `Categrories: ${company_info.categories}`+"</h6>"));
  } else {
    markers.addLayer(L.marker([company_info.latitude, company_info.longitude])
    .bindPopup("<h4>"+`${company_info.name}`+"</h4>"+
            `Address: ${company_info.address}`+"</h5><h5>"+
            `City: ${company_info.city},  Province: ${company_info.state}`+"</h5><h5>"+
            `Post Code: ${company_info.postal_code}`+"</h5><h5>"+
            `Business Status: ${business_status}`+"</h5><h5>"+
            `Review Counts: ${company_info.review_count}`+"</h5><h5>"+
            `Review Stars: ${stars}`+"</h5><hr><h6>"+
            `Categrories: ${company_info.categories}`+"</h6>"));
  
  }}
    

    // Add our marker cluster layer to the map
   myMap.addLayer(markers);

  });
  

})}



function buildBarChart(data,name1,chartId,bar_width,f_size,description){
  var num = data[0].length;
  //console.log(data);

  var trace1 = {
      x: data[0],
      y: data[1],
      type:"bar",
      name: name1,
      marker: {
        color: 'rgb(49,130,189)',
        opacity: 0.7
    }
  };
  

var data = [trace1];

var layout = {
  title: description,
  xaxis: {
    tickangle: -40
  },
  height:555,
  width: bar_width,
  font: {size: f_size}

      
};
Plotly.newPlot(chartId, data, layout); 
}

// Build the Industry Chart

function buildDonutChart(data,title,plotId,plot_size,input_t){
    var label_list = data[0];
    var value_list = data[1]
    
    var data = [{
      values: value_list,
      labels: label_list,
      domain: {column: 0},
      name: title,
      hoverinfo: 'label+percent+value+name',
      hole: .5,
      type: 'pie'
    }];
    
    var layout = {
      title: '',
      annotations: [
        {
          font: {
            size: 16
          },
          showarrow: false,
          text: input_t,
          x: 0.5,
          y: 0.5
        }
      ],
      height: plot_size,
      width: plot_size,
      showlegend: false,
      font: {size: 8}

    };
    
    Plotly.newPlot(plotId, data, layout);



  
}





//initial loading
var full_url ="/yelp_metadata";
BuildMap(full_url,43.6532, -79.3832,9,0);

// Searching Form
var search_btn = d3.select("#search-btn");
var reset_btn = d3.select("#reset-btn");
var add_criteria_btn = d3.select("#add-condition-btn");

var filter_condition = [];
var filter_input = [];

var click_flag = false;

// reset function
function reset_form(){
  d3.select("#c_text").selectAll("li").remove();
  d3.select("#filter_value").property("value"," ");
  filter_condition = [];
  filter_input = [];
  click_flag = false;
}
  
add_criteria_btn.on("click", function() {

    click_flag = true;
// Prevent the page from refreshing
    d3.event.preventDefault();

// Select the input element and get the raw HTML node
    var inputElement = d3.select("#filter_value");

// Get the value property of the input element
    var inputValue = inputElement.property("value");
// remove the space
    inputValue = inputValue.replace(/\s+/g, '');

// Get the dropdown value
    var criteria_inputElement = d3.select("#query_item");
    var criteria_inputValue = criteria_inputElement.property("value");
    
    d3.select("#c_text").append("li").text(criteria_inputValue+": "+ inputValue);
    filter_condition.push(criteria_inputValue);
    filter_input.push(inputValue);
    console.log(filter_condition);
    console.log(filter_input);

    console.log(click_flag);

});

search_btn.on("click", function(){
  // Prevent the page from refreshing
  d3.event.preventDefault();
  var cate_term = "";
  var location = "";

  // Select the input element and get the raw HTML node
  var inputElement = d3.select("#filter_value");
        
  // Get the value property of the input element
      var inputValue = inputElement.property("value");
  // remove the space
      inputValue = inputValue.replace(/\s+/g, '');
  
  // Get the dropdown value
      var criteria_inputElement = d3.select("#query_item");
      var criteria_inputValue = criteria_inputElement.property("value");
      
      d3.select("#c_text").append("li").text(criteria_inputValue+": "+ inputValue);
      filter_condition.push(criteria_inputValue);
      filter_input.push(inputValue);

// Criterias Search:
console.log(filter_condition);
console.log(filter_input);

for (i=0;i<filter_condition.length;i++){
     if (filter_condition[i] == "category") {
      cate_term = filter_input[i];
     } 
    if ((filter_condition[i] == "city")||(filter_condition[i] == "postal_code")) {
      
      location = filter_input[i];}
   }
if (cate_term ==""){
    cate_term = "bars";
   }
if (location ==""){
     location = "Toronto";
   }
 
   build_api_query(cate_term,location);
   reset_form();

 })


reset_btn.on("click", function(){

  reset_form();
  BuildMap(full_url,43.6532, -79.3832,9);

})

function build_api_query(term,location){
  query_url = `/apiquery/${term}/${location}`;

  d3.json(query_url).then(function(info) {
    var inti_Lat;
    var inti_Long;
    inti_Lat = parseFloat(info[0]["latitude"]);
    inti_Long = parseFloat(info[0]["longitude"]);
    var is_api_query = true;
    BuildMap(query_url,inti_Lat,inti_Long,13,is_api_query);


    var info_list =[];
        info.forEach(item =>{
            info_list.push([item["stars"],item["review_count"]]);
        
        });
        //transpose
        if (info_list.length === 1) {
           var plot_list = [[info_list[0][0]],[info_list[0][1]]];

        } else {
         plot_list = info_list.map(function(col, i){
            return info_list.map(function(row){
                return row[i];
            });
          });}
        //console.log(plot_list);
        buildBarChart(plot_list,"Rating Overview","rating_chart","340","8",`${term} Rating vs.Review Count in ${location}`); 
       // buildDonutChart(plot_list,`${term} Rating vs.Review Count in ${location}`,"rating_chart",300,`${term}`);
      

  }
  )}




