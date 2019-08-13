function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  // Use d3 to select the panel with id of `#sample-metadata`
  // Use `.html("") to clear any existing metadata

  // Use `Object.entries` to add each key and value pair to the panel
  
    var sample_metadata_panel = d3.select("#sample-metadata").html("");
    var metadata_url = `/metadata/${sample}`;
    //console.log(metadata_url);
    d3.json(metadata_url).then(function(metadata_sample){
      panel_list = Object.entries(metadata_sample);
      console.log(panel_list);
      panel_list.forEach((item => {
        sample_metadata_panel.append("p")
          .text(item[0]+ " : "+ item[1]);
      }));
    })
}


function buildCharts(sample) {
  
  // Data preparation

    var sample_pie = d3.select("#pie").html("");
    var sample_pie_url = `/samples/${sample}`;
    d3.json(sample_pie_url).then((sample_pie_data => {
      //console.log(sample_pie_data);
      
      sample_pie_data.sample_values.forEach((pie_values =>parseInt(pie_values)));
      
      var otu_ids_list = sample_pie_data["otu_ids"];
      var otu_labels_list = sample_pie_data["otu_labels"];
      var sample_values_list = sample_pie_data["sample_values"];

      var coombin_list = [sample_values_list,otu_labels_list,otu_ids_list];
      
      // Transpose 
      var new_pie_data = coombin_list[0].map(function(col, i){
        return coombin_list.map(function(row){
            return row[i];
        });
      });
      //Sort the data
      new_pie_data.sort(function(a, b){
        return b[0] - a[0];
        });
      
      //Slice top ten data
      var top_ten_pie_data = new_pie_data.slice(0,10);
      
      //Transpose for plot
      var pie_data = top_ten_pie_data[0].map(function(col, i){
        return top_ten_pie_data.map(function(row){
            return row[i];
        });
      });

    //Plot Pie Chart
      var data = [{
        values: pie_data[0],
        labels: pie_data[2],
        hovertext: pie_data[1],
        hoverinfo: 'hovertext',
        type: 'pie'
      }];
      
      var layout = {
        height: 510,
        width: 500
      };
      
      Plotly.newPlot('pie', data, layout);

  //Plot the bubble chart

    var bubble_data = [{
      x: otu_ids_list,
      y: sample_values_list,
      text: otu_labels_list,
      mode: "markers",
      marker: {
        size: sample_values_list,
        color: otu_ids_list,
        colorscale:"Rainbow"
      }
    }];
    
    var layout = {
      showlegend: false,
      height: 600,
      width: 1200,
      sizemode: "area",
      hovermode:"closet",
      xaxis:{title:"OTU_ID"}
    };
    
    Plotly.newPlot('bubble', bubble_data, layout);
    
     // console.log("pie_data",pie_data[1]);
      
           

      }));

  }

// Build the Gauge Chart
function buildGauge(sample){
  var wfreq_data_url = `/wfreq/${sample}`;

  d3.json(wfreq_data_url).then((guage_data => {
    console.log(guage_data.sample);
    console.log(guage_data.WFREQ);

if (guage_data.WFREQ === null) { guage_data.WFREQ = 0;} 

var level = (guage_data.WFREQ/9)*180;

// Trig to calc meter point
var degrees = 180 - level,
     radius = .5;
var radians = degrees * Math.PI / 180;
var x = radius * Math.cos(radians);
var y = radius * Math.sin(radians);

// Path: may have to change to create a better triangle
var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
     pathX = String(x),
     space = ' ',
     pathY = String(y),
     pathEnd = ' Z';
var path = mainPath.concat(pathX,space,pathY,pathEnd);

var data = [{ type: 'scatter',
   x: [0], y:[0],
    marker: {size: 28, color:'850000'},
    showlegend: false,
    name: 'WFREQ',
    text: level,
    hoverinfo: 'name'
  },
  { values: [50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9,50/9,50/9,50],
  rotation: 90,
  text: ['8-9','7-8','6-7','5-6','4-5','3-4','2-3','1-2','0-1'],
  textinfo: 'text',
  textposition:'inside',
  marker: {colors:['rgba(10, 20, 0, .5)','rgba(44, 157, 10, .5)', 'rgba(110, 184, 42, .5)',
                         'rgba(170, 202, 42, .5)', 'rgba(202, 209, 95, .5)',
                         'rgba(210, 206, 145, .5)', 'rgba(232, 226, 202, .5)',
                         'rgba(242, 226, 202, .5)','rgba(252, 236, 202, .5)',
                         'rgba(255, 255, 255, 0)']},
  labels: ['8-9','7-8','6-7','5-6','4-5','3-4','2-3','1-2','0-1'],
  hoverinfo: 'label',
  hole: .5,
  type: 'pie',
  showlegend: false
}];

var layout = {
  shapes:[{
      type: 'path',
      path: path,
      fillcolor: '850000',
      line: {
        color: '850000'
      }
    }],
  title: 'Belly Button Washing Frequency<br>Scrubs per Week',
  height: 500,
  width: 500,
  xaxis: {zeroline:false, showticklabels:false,
             showgrid: false, range: [-1, 1]},
  yaxis: {zeroline:false, showticklabels:false,
             showgrid: false, range: [-1, 1]}
};

Plotly.newPlot('gauge', data, layout);
   
  }));

}


function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  // Need start http.server if not use the firefox browser
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      //console.log(sample);
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
    buildGauge(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
  buildGauge(newSample);
}

// Initialize the dashboard
init();
