var columns = ["Rank","Company","Founded","Industry","City","State","Years_on_List","Growth"];
var base_url ="/2018metadata/pages/";
var url_1 ="/2018metadata/pages/1";

var year_filter_baseurl;
var year_filter_baseurl_1;

var founded_filter_baseurl;
var founded_filter_baseurl_1;

var statel_filter_baseurl;
var statel_filter_baseurl_1;

var city_filter_baseurl;
var city_filter_baseurl_1;

var industry_filter_baseurl;
var industry_filter_baseurl_1;

var page_count = 1;

var Years_Table = false;
var Founded_Table = false;
var State_Table = false;
var City_Table = false;
var Industry_Table = false;
  

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

// Next Page Button

next_page.on("click", function() {
  if (Years_Table) {
    page_count++;
    url = year_filter_baseurl + page_count.toString();
    console.log(url);
    update_table(url);
  
  } else if (Founded_Table) {
      page_count++;
      url = founded_filter_baseurl + page_count.toString();
      console.log(url);
      update_table(url);
  } else if (State_Table) {
    page_count++;
    url = statel_filter_baseurl + page_count.toString();
    console.log(url);
    update_table(url);
  } else if (City_Table) {
    page_count++;
    url = city_filter_baseurl + page_count.toString();
    console.log(url);
    update_table(url);
  }  else if (Industry_Table) {
    page_count++;
    url = industry_filter_baseurl + page_count.toString();
    console.log(url);
    update_table(url);
  } else {
  page_count++;
  url = base_url + page_count.toString();
  console.log(url);
  update_table(url);
  }
  
});  

// Pre page Button
pre_page.on("click", function() {
  if (Years_Table) {
    url_1 = year_filter_baseurl_1;
    if (page_count<=1) {
      update_table(url_1);
      page_count = 1;
    } else {
      page_count--;
      url = year_filter_baseurl + page_count.toString();
      console.log(url);
      update_table(url);
    }
  } else if (Founded_Table) {
    url_1 = founded_filter_baseurl_1;
    if (page_count<=1) {
      update_table(url_1);
      page_count = 1;
    } else {
      page_count--;
      url = founded_filter_baseurl + page_count.toString();
      console.log(url);
      update_table(url);
    }
  } else if (State_Table) {
    url_1 = statel_filter_baseurl_1;
    if (page_count<=1) {
      update_table(url_1);
      page_count = 1;
    } else {
      page_count--;
      url = statel_filter_baseurl + page_count.toString();
      console.log(url);
      update_table(url);
    }
  } else if (City_Table) {
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
  }  else if (Industry_Table) {
    url_1 = industry_filter_baseurl_1;
    if (page_count<=1) {
      update_table(url_1);
      page_count = 1;
    } else {
      page_count--;
      url = industry_filter_baseurl + page_count.toString();
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
  Years_Table = false;
  Founded_Table = false;
  State_Table = false;
  City_Table = false;
  Industry_Table = false;
  

  page_count = 1;
  url_1 = base_url + page_count.toString();
  update_table(url_1);
});




//Filter Form Initialization

function init_filter(){
  var sel_industry = d3.select("#selIndustry");
  var sel_state = d3.select("#selState");
  var sel_city = d3.select("#selCity");
  var sel_Founded = d3.select("#selFounded");
  var sel_YearList = d3.select("#selYrs_on_List");
  
  // Use the list of sample names to populate the select options
  // Need start http.server if not use the firefox browser
  d3.json("/2018metadata/Industry").then((filtername) => {
    filtername.sort();
    filtername.forEach((sample) => {
     
      sel_industry
        .append("option")
        .text(sample)
        .property("value", sample);
    })});

  d3.json("/2018metadata/State").then((filtername) => {
    filtername.sort();
    filtername.forEach((sample) => {
        //console.log(sample);
        sel_state
          .append("option")
          .text(sample)
          .property("value", sample);
      })});
  
  d3.json("/2018metadata/City").then((filtername) => {
        filtername.sort();
        filtername.forEach((sample) => {
          //console.log(sample);
          sel_city
            .append("option")
            .text(sample)
            .property("value", sample);
        })});
  

  d3.json("/2018metadata/Founded").then((filtername) => {
    filtername.sort(function(a, b){return b-a});   
    filtername.forEach((sample) => {
          //console.log(sample);
          sel_Founded
            .append("option")
            .text(sample)
            .property("value", sample);
        })})
        
  d3.json("/2018metadata/Years_on_List").then((filtername) => {
      filtername.sort(function(a, b){return b-a});    
      filtername.forEach((sample) => {
            //console.log(sample);
            sel_YearList
              .append("option")
              .text(sample)
              .property("value", sample);
          })})
  

      }

init_filter();

function optionChanged_years(year) {
  Years_Table = true;
  State_Table = false;
  Founded_Table = false;
  City_Table = false;
  Industry_Table = false;
  

  page_count = 1;
  year_filter_baseurl = `/years_on/${year}/`;
  year_filter_baseurl_1 = `/years_on/${year}/1`;

  var year_url = year_filter_baseurl + page_count.toString()
  update_table(year_url);
}

function optionChanged_founded(founded){
  Founded_Table = true;
  Industry_Table = false;
  State_Table = false;
  Years_Table = false;
  City_Table = false;

  page_count = 1;
  founded_filter_baseurl = `/founded_year/${founded}/`;
  founded_filter_baseurl_1 = `/founded_year/${founded}/1`;

  var founded_url = founded_filter_baseurl + page_count.toString()
  update_table(founded_url);

}

function optionChanged_state(state_l){
  Founded_Table = false;
  Years_Table = false;
  City_Table = false;
  Industry_Table = false;
  
  State_Table = true;

  page_count = 1;
  statel_filter_baseurl = `/state_l/${state_l}/`;
  statel_filter_baseurl_1 = `/state_l/${state_l}/1`;

  var statel_url = statel_filter_baseurl + page_count.toString()
  update_table(statel_url);

}

function optionChanged_city(city){
  Founded_Table = false;
  Years_Table = false;
  State_Table = false;
  Industry_Table = false;
  City_Table = true;

  page_count = 1;
  city_filter_baseurl = `/city/${city}/`;
  city_filter_baseurl_1 = `/city/${city}/1`;

  var city_url = city_filter_baseurl + page_count.toString()
  update_table(city_url);
}

function optionChanged_industry(industry){
  Founded_Table = false;
  Years_Table = false;
  State_Table = false;
  City_Table = false;

  Industry_Table = true;

  page_count = 1;
  industry_filter_baseurl = `/industry/${industry}/`;
  industry_filter_baseurl_1 = `/industry/${industry}/1`;

  var industry_url = industry_filter_baseurl + page_count.toString()
  update_table(industry_url);


}


