function BuildMap(url,init_lat,init_long,zoom_level,info,rating_query,initial){

  //Before initializing map check for is the map is already initiated or not

  var info_list =[];
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
//build init plot_list

        
        info_list.push([company_info["stars"],company_info["review_count"]]);
        
       
      
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
    markers.addLayer(L.marker([company_info.latitude, company_info.longitude])
    .bindPopup("<h4>"+`${company_info.name}`+"</h4><hr><h5>"+
            `Address: ${company_info.address}`+"</h5><h5>"+
            `City: ${company_info.city},  Province: ${company_info.state}`+"</h5><h5>"+
            `Post Code: ${company_info.postal_code}`+"</h5><h5>"+
            `Business Status: ${business_status}`+"</h5><h5>"+
            `Review Counts: ${company_info.review_count}`+"</h5><h5>"+
            `Review Stars: ${stars}`+"</h5><hr><h6>"+
            `Categrories: ${company_info.categories}`+"</h6>"))
  }
    

    // Add our marker cluster layer to the map
   myMap.addLayer(markers);

  });
  if (initial) {
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
   buildBarChart(plot_list,"Rating Overview","rating_chart","340","8","GTA"); 
  }
  

//console.log(total_biz_number,total_5stars_number,total_review_number);
biz_number = total_biz_number.toString();
fivestar_number = total_5stars_number.toString();
review_number = total_review_number.toString();

var dash_biz_num = d3.select("#dash_card_num").html("");
dash_biz_num.append("div").attr("id","infotext").append("h4").text(`${info}`+" : "+`${biz_number}`);   

var dash_stars_num = d3.select("#dash_card_stars").html("");

switch (rating_query){
   case 1:
     dash_stars_num.append("div").attr("id","infotext").append("h4").text("Rating 1: "+total_1stars_number.toString());   
     break;
   case 1.5:
     dash_stars_num.append("div").attr("id","infotext").append("h4").text("Rating 1.5: "+total_15stars_number.toString());   
     break;
 case 2:
     dash_stars_num.append("div").attr("id","infotext").append("h4").text("Rating 2: "+total_2stars_number.toString());   
     break;
 case 2.5:
     dash_stars_num.append("div").attr("id","infotext").append("h4").text("Rating 2.5: "+total_25stars_number.toString());   
     break;
 case 3:
     dash_stars_num.append("div").attr("id","infotext").append("h4").text("Rating 3:  "+total_3stars_number.toString());   
     break;
 case 3.5:
     dash_stars_num.append("div").attr("id","infotext").append("h4").text("Rating 3.5:  "+total_35stars_number.toString());   
     break;
 case 4:
     dash_stars_num.append("div").attr("id","infotext").append("h4").text("Rating 4: "+total_4stars_number.toString());   
     break;
 case 4.5:
     dash_stars_num.append("div").attr("id","infotext").append("h4").text("Rating 4.5: "+total_45stars_number.toString());   
     break;
 case 5:
     dash_stars_num.append("div").attr("id","infotext").append("h4").
        text("Rating 5: "+total_5stars_number.toString());   
     break;
 default:
   stars="";
}

var dash_review_num = d3.select("#dash_card_review").html("");
dash_review_num.append("div").attr("id","infotext").append("h4").text(`${info}`+" : "+`${review_number}`);   

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
  title: `Total ${num} buseiness numbers in `+ description,
  xaxis: {
    tickangle: -40
  },
  height:555,
  width: bar_width,
  font: {size: f_size}

      
};
Plotly.newPlot(chartId, data, layout); 
}




//Filter Form Initialization

function init_filter(){
  var sel_city = d3.select("#selCity_on_List");
  var sel_cate = d3.select("#selCat_on_List");
  var sel_stars = d3.select("#selStars_on_List");
  
  // Use the list of sample names to populate the select options
  // Need start http.server if not use the firefox browser
  
  d3.json("/yelp_metadata/stars").then((filtername) => {
    filtername.sort(function(a, b){return a-b});
    //console.log(filtername);
    non_filtername = filtername.shift();
    //console.log(filtername);
    filtername.forEach((sample) => {
     
      sel_stars
        .append("option")
        .text(sample)
        .property("value", sample);
    })});

  
  d3.json("/yelp_metadata/city").then((filtername) => {
        filtername.sort();
        filtername.forEach((sample) => {
          //console.log(sample);
          sel_city
            .append("option")
            .text(sample)
            .property("value", sample);
        })});
  

  d3.json("/category_feature/30").then((filtername) => {
    filtername.forEach((sample) => {
          //console.log(sample);
          sel_cate
            .append("option")
            .text(sample)
            .property("value", sample);
        })})
      
  
var full_url ="/yelp_metadata";

// Initial location :Toronto:[43.6532, -79.3832]
var initialplot = true;
BuildMap(full_url,43.6532, -79.3832,10,"GTA",5,initialplot);

      
}


function optionChanged_stars(stars){
    star_filter_url = `/stars/${stars}`;
  
    //for table
    city_table = false;
    category_table = false;
    stars_table = true;

  page_count = 1;
  stars_filter_baseurl = `/stars/${stars}/`;
  stars_filter_baseurl_1 = `/stars/${stars}/1`;

  var stars_url = stars_filter_baseurl + page_count.toString()
  update_table(stars_url);


    d3.json(star_filter_url).then(function(info) {
      d3.select("#infotext").remove();
      rating = parseFloat(stars);
      BuildMap(star_filter_url,43.6532, -79.3832,10,"GTA",rating,0);
    }
    )}

function optionChanged_cities(city){
      city_filter_url = `/city/${city}`;

      //table update
    stars_table = false;
    category_table = false;
    city_table = true;

    page_count = 1;
    city_filter_baseurl = `/city/${city}/`;
    city_filter_baseurl_1 = `/city/${city}/1`;

    var city_url = city_filter_baseurl + page_count.toString()
    update_table(city_url);

      
      d3.json(city_filter_url).then(function(info) {
        var inti_Lat;
        var inti_Long;
        inti_Lat = parseFloat(info[0]["latitude"]);
        inti_Long = parseFloat(info[0]["longitude"]);
        d3.select("#infotext").remove();
        BuildMap(city_filter_url,inti_Lat,inti_Long,14,city,5,0);
        
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
        buildBarChart(plot_list,"Rating Overview","rating_chart","340","8",`${city}`); 
      });
}


    function optionChanged_cat(keyword){
        //keywords_list_url = '/category_feature/30'
        category_filter_url = `/category_feature/keyword/${keyword}`;

  
        //table update
      stars_table = false;
      city_table = false;
      category_table =true;
  
      page_count = 1;
      category_filter_baseurl = `/category_feature/keyword/${keyword}/`;
      category_filter_baseurl_1 = `/category_feature/keyword/${keyword}/1`;
  
      var category_url = category_filter_baseurl + page_count.toString()
      update_table(category_url);
  
        
      d3.json(category_filter_url).then(function(info) {
          d3.select("#infotext").remove();
          BuildMap(category_filter_url,43.6532, -79.3832,10,"GTA",5,0);
          
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
          buildBarChart(plot_list,"Category Rating Overview","rating_chart","340","8",`Category:${keyword}`); 
        });
  
      

      }
      
    


//Initial Filter
init_filter();

//Table Card
// The Table Card

var columns = ["name","address","city","postal_code","is_open","review_count","stars"];
var base_url ="/yelp_metadata/pages/";
var url_1 ="/yelp_metadata/pages/1";

var city_filter_baseurl;
var city_filter_baseurl_1;

var stars_filter_baseurl;
var stars_filter_baseurl_1;

var category_filter_baseurl;
var category_filter_baseurl_1;

var city_table = false;
var stars_table = false;
var category_table = false;
  


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
var full_list_page = d3.select("#back_full_page");


next_page.on("click", function() {
  if (city_table) {
    page_count++;
    url = city_filter_baseurl + page_count.toString();
    console.log(url);
    update_table(url);
  }  else if (stars_table) {
    page_count++;
    url = stars_filter_baseurl + page_count.toString();
    console.log(url);
    update_table(url);
  } else if (category_table) {
    page_count++;
    url = category_filter_baseurl + page_count.toString();
    console.log(url);
    update_table(url);
  } else {
  page_count++;
  url = base_url + page_count.toString();
  console.log(url);
  update_table(url);
  }
});  

pre_page.on("click", function() {
  if (city_table) {
    url_1 = city_filter_baseurl_1;
    if (page_count<=1) {
      update_table(url_1);
      page_count = 1;
    } else {
      page_count--;
      url = city_filter_baseurl + page_count.toString();
      console.log(url);
      update_table(url);
    }
  }  else if (stars_table) {
    url_1 = stars_filter_baseurl_1;
    if (page_count<=1) {
      update_table(url_1);
      page_count = 1;
    } else {
      page_count--;
      url = stars_filter_baseurl + page_count.toString();
      console.log(url);
      update_table(url);
    }
  }  else if (category_table) {
    url_1 = category_filter_baseurl_1;
    if (page_count<=1) {
      update_table(url_1);
      page_count = 1;
    } else {
      page_count--;
      url = category_filter_baseurl + page_count.toString();
      console.log(url);
      update_table(url);
    }
  }  else {
  if (page_count<=1) {
    update_table(url_1);
    page_count = 1;
  } else {
    page_count--;
    url = base_url + page_count.toString();
    console.log(url);
    update_table(url);
   }
}
});  

full_list_page.on("click", function(){
  city_table = false;
  stars_table = false;
  category_table = false;
  

  page_count = 1;
  url_1 = base_url + page_count.toString();
  update_table(url_1);
});
