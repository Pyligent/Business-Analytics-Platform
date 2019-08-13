
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
//show first page  
var industry_url_0 = "/industry_growth_rev";
d3.json(industry_url_0).then(function(info) {
    //console.log(info);
    buildBubbleChart(info,"Growth(%)","Revenue(millions)","industry_card_1","1000","12","Industry Sectors- Average Growth vs. Revenue");
    
});}

function buildBubbleChart(data,name_x,name_y,chartId,bar_width,f_size,title_info){
    var size_a = [];
   
    for (var i=0;i<data[3].length;i++){
          var tmp = data[3][i]/7;
          size_a.push(tmp);
    }

    
    var trace1 = {
        x: data[1],
        y: data[2],
        text: data[0],
        mode:"markers",
        marker:{
            size: size_a,
            color: data[3],
            colorscale:"Rainbow"
        }
    };
  var layout = {
      title: title_info,
      height:550,
      width: bar_width,
      font: {size: f_size},
      sizemode: "area",
      hovermode:"closet",
      xaxis:{title:name_x},
      yaxis:{title:name_y}

  };
  var data = [trace1];
  Plotly.newPlot(chartId, data, layout); 

}

function buildBarChart(data,name1,name2,chartId,bar_type,bar_width,f_size,description){
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
    var trace2 = {
      x: data[0],
      y: data[2],
      type:"bar",
      name: name2,
      marker: {
        color: 'rgb(78,153,4)',
        opacity: 0.5
    }};
   
  
  var data = [trace1, trace2];
  
  var layout = {
    title: `Industry Sectors - Growth vs. Revenue :Total ${num}`+ description,
    xaxis: {
      tickangle: -40
    },
    barmode: bar_type,
    height:550,
    width: bar_width,
    font: {size: f_size}
  
        
  };
  Plotly.newPlot(chartId, data, layout,{responsive: true}); 
    }
  

function optionChanged_industry(industry){
        industry_filter_url = `/industry/${industry}/0`;
        d3.json(industry_filter_url).then(function(info) {
        
            var info_list =[];
            info.forEach(item =>{
                info_list.push([item["State"],item["Growth"],item["Revenue"]/(100000)]);
            
            });
            //transpose
            console.log(info_list);
            if (info_list.length === 1) {
                plot_list = [[info_list[0][0]],[info_list[0][1]],[info_list[0][2]]];
    
            } else {
            var plot_list = info_list.map(function(col, i){
                return info_list.map(function(row){
                    return row[i];
                });
            });}
           
            buildBarChart(plot_list,"Growth(%)","Revenue(10k)","industry_card_1","stack","950","8",` companies in ${industry} sector - States Distribution Chart.`);
    
    
      
      });}
      
    
function optionChanged_years(year) {
    years_filter_url = `/years_on/${year}/0`;
    d3.json(years_filter_url).then(function(info) {
        
        var info_list =[];
        info.forEach(item =>{
            info_list.push([item["Industry"],item["Growth"],item["Revenue"]/(100000)]);
        
        });
        //transpose
        if (info_list.length === 1) {
            plot_list = [[info_list[0][0]],[info_list[0][1]],[info_list[0][2]]];

        } else {
        var plot_list = info_list.map(function(col, i){
            return info_list.map(function(row){
                return row[i];
            });
        });}
        
 
        buildBarChart(plot_list,"Growth(%)","Revenue(10k)","industry_card_1","stack","950","8",` company(ies) stayed in ${year} years on the list.`);


});
}

function optionChanged_founded(founded){
    founded_filter_url = `/founded_year/${founded}/0`;
    d3.json(founded_filter_url).then(function(info) {
       
        var info_list =[];
        info.forEach(item =>{
            info_list.push([item["Industry"],item["Growth"],item["Revenue"]/(100000)]);
        
        });
        //transpose
        if (info_list.length === 1) {
            plot_list = [[info_list[0][0]],[info_list[0][1]],[info_list[0][2]]];

        } else {
        var plot_list = info_list.map(function(col, i){
            return info_list.map(function(row){
                return row[i];
            });
        });}
        //console.log(plot_list);
        d3.select("#infotext").remove();

 
        buildBarChart(plot_list,"Growth(%)","Revenue(10k)","industry_card_1","stack","950","8",` company(ies) founded in ${founded}.`);


        

});

  }

function optionChanged_state(state_l){
    state_filter_url = `/state_l/${state_l}/0`;
    d3.json(state_filter_url).then(function(info) {
        
        var info_list =[];
        console.log(info);
        info.forEach(item =>{
            info_list.push([item["Industry"],item["Growth"],item["Revenue"]/(100000)]);
        
        });
        console.log(info_list);
        
        //transpose
        if (info_list.length === 1) {
            plot_list = [[info_list[0][0]],[info_list[0][1]],[info_list[0][2]]];

        } else {
        var plot_list = info_list.map(function(col, i){
            return info_list.map(function(row){
                return row[i];
            });
        });}
        console.log(plot_list);
        d3.select("#infotext").remove();

 
        buildBarChart(plot_list,"Growth(%)","Revenue(10k)","industry_card_1","stack","950","8",` company(ies) in ${state_l}.`);


});

  
}

function optionChanged_city(city){
    city_filter_url = `/city/${city}/0`;
    d3.json(city_filter_url).then(function(info) {
        
        var info_list =[];
        info.forEach(item =>{
            info_list.push([item["Industry"],item["Growth"],item["Revenue"]/(100000)]);
        
        });
        //transpose
        if (info_list.length === 1) {
            plot_list = [[info_list[0][0]],[info_list[0][1]],[info_list[0][2]]];

        } else {
        var plot_list = info_list.map(function(col, i){
            return info_list.map(function(row){
                return row[i];
            });
        });}
         //console.log(plot_list);
        d3.select("#infotext").remove();

 
        buildBarChart(plot_list,"Growth(%)","Revenue(10k)","industry_card_1","stack","950","8",` company(ies) in ${city}.`);

});


  
}




init_filter();


