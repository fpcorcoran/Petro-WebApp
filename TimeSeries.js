//Margins object (not sure if I'll need this)
var margin = {"top": 10, "bottom": 10, "left": 10, "right": 10};

//Not sure if I'll need this either, but use them in a few places below
var width = 90;
var height = 90;

var parse_dates = function(date){
	var new_date = date.slice(4,) + "-" + date.slice(0,4);
	var parse_time = d3.timeParse("%m-%Y");
	var format = d3.timeFormat("%b-%Y");
	return format(parse_time(new_date));
};

//set up data
var data = [];

//parse the dates
var dates = Object.keys(crude_prices).map(function(date){ return parse_dates(date); });

//append each month in the time series as a new object pair to the data variable
for(i=0; i<Objects.keys(dates).length; i++){
	var new_entry = {};
	
	new_entry.date = dates[i];
	new_entry.price = Object.values(crude_prices)[i];

	data.push(new_entry);
}
// var dates = Object.keys(crude_prices).map(function(date){ return parse_dates(date); });
// data.prices = Object.values(crude_prices);


//number of data points
var n = Object.keys(crude_prices).length;

//set up the x and y values - may need to parse dates from YYYYMM to MM-YYYY
var x = d3.scaleTime()
		  .domain(d3.extent(data.dates))                  //domain of inputs
		  .range([0, width]);                             //range of outputs

var y = d3.scaleLinear()
		  .domain(d3.extent(data.prices))                 //domain of inputs
		  .range([height, 0]); 							  //range of outputs

var line = d3.line()
				.x(function(d){ return x(d.dates); })
				.y(function(d){ return y(d.prices); });


var TS_svg = d3.select("#bottom")
			   .append("svg")
			   .attr("width", "100%")
			   .attr("height", height)
			   .attr("transform", "translate(10,10)");


TS_svg.append("g")
	  .attr("class","y-axis")
	  .call(d3.axisLeft(y));

TS_svg.append("g")
	  .attr("class", "x-axis")
	  .attr("transform", "translate(0,500)")
	  .call(d3.axisBottom(x));


TS_svg.append("path")
	  .data(crude_prices)
	  .attr("class", "line")
	  .attr("fill", "red")
	  .attr("stroke", "red")
	  .attr("d", line);
