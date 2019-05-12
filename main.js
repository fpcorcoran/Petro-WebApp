
//dark theme basemap
basemapURL = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';

//set date variable
var date = 0;

//Create map Object
var map = L.map('mapid', {
  zoomControl: false,
  center: [39.82, -98.58],
  zoom: 4.45
});

//Create Basemap Tile Layer
baseMap = L.tileLayer(basemapURL, {
  ext: 'png',
}).addTo(map);


//get the first entry of the lists of data for each city (only necessary for input into Organize() function)
var c = {};
Object.keys(cities).forEach(function(city){
	c[city] = cities[city][0];
});

//Organize Data from precipitation
var Data = Organize(precip2, c);

//Create SVG element inside map
L.svg().addTo(map);

//Create a Leaflet LatLng object for each of the ports
Data.objects.forEach(function(d){
  d.LatLng = new L.LatLng(d.circle.coordinates[0], d.circle.coordinates[1]);
});




var selected_city;
var start_time;

//Select the g element of the map svg and append a circle for each port
var g = d3.select("#mapid")
		  .select("svg")
		  .select('g')
		  .selectAll("circle")
		  //append a circle for every entry in Data.objects
		  .data(Data.objects)
		  .enter().append("circle")
		  //style the circles
		  .style("stroke", "none")
		  .style("opacity", 0.6)
		  //make the circles clickable (necessary?)
		  .style("pointer-events","visible")
		  //set circle fill color and radius based on values in data
		  .style("fill", function(d){ return d.circle.Color[0]; })
		  .attr("r", function(d){ return d.circle.Imports[0]*0.01; })	//look for better way to do this
		  .attr("id", function(d){ return d.circle.City; })
		  //translate the circles so that their centers align with the lat/long of their respective city
		  .attr("transform", function(d) {
						 return "translate("+
						 map.latLngToLayerPoint(d.LatLng).x +","+
						 map.latLngToLayerPoint(d.LatLng).y +")";
					 })
		 //add click functionality for the circles
		 .on("click", function(d){

			 		  selected_city = d.circle.City;

					  //get bar chart info tags
					  var title = document.getElementById("chart-title");
					  var city_text = document.createTextNode(selected_city);

					  if(title.childNodes.length > 1){
					  	title.removeChild(title.childNodes[1]);
					  }

					  title.appendChild(city_text);


					  //when clicked, city will have a red outline, all other cities will have no outline
					  d3.selectAll("circle").style("stroke","none");
					  d3.select(this).style("stroke", "red")
									 .style("stroke-width","2px");
					  //when you click a city, the sidebar responds with the breakdown, based on radio button state
					  var l;
					  if( document.getElementById("country-button").checked){
					  	  l = Get_By_Label(cities[selected_city][0]);

					  } else if( document.getElementById("product-button").checked){
					  	  l = Get_By_Label(cities[selected_city][1]);

					  } else if( document.getElementById("company-button").checked){
					  	  l = Get_By_Label(cities[selected_city][2]);

					  }
					  makeBars(l,start_time);


				  });

//apply translation to circles, moving them to their location on map
function update() {
	g.attr("transform",
	function(d) {
  		return "translate("+
        	map.latLngToLayerPoint(d.LatLng).x +","+
            map.latLngToLayerPoint(d.LatLng).y +")";
    });

}

map.on("zoom",update);


//equivalent of range(len(precipitation))
var range = Array.from(Array(Data.objects[0].circle.Precip.length).keys());

//create a transition for the circles between each month in the time series (color, radius)
range.forEach(function(year){

	setTimeout(function(){
		start_time = year;

		var current_year = document.getElementById("chart-date");

		var p = d3.timeParse("%m-%Y");
		var f = d3.timeFormat("%b-%Y");
		var d = Object.keys(BATON_ROUGE_CNTRY_NAME)[year];

		var formatted_date = f(p(d.slice(4,) + "-" + d.slice(0,4)));

		console.log(formatted_date);
		var time_node = document.createTextNode(formatted_date);

		if( current_year.childNodes.length > 1){
			current_year.removeChild(current_year.childNodes[1]);
		}

		current_year.appendChild(time_node);

	// 	d3.select("#mapid")
	// 	  .select("svg")
	// 	  .select("g")
	// 	  .selectAll("circle")
	// 	  .data(Data.objects)
	// 	 //add click functionality for the circles
	// 	 .on("click", function(d){
	// 	 selected_city = d.circle.City;
	//
	// 	//when clicked, city will have a red outline, all other cities will have no outline
	// 	d3.selectAll("circle").style("stroke","none");
	// 	d3.select(this).style("stroke", "red")
	// 				   .style("stroke-width","2px");
	// 	//when you click a city, the sidebar responds with the breakdown, based on radio button state
	// 	var l;
	// 	if( document.getElementById("country-button").checked){
	// 		l = Get_By_Label(cities[selected_city][0]);
	// 		makeBars(l,year);
	// 	} else if( document.getElementById("product-button").checked){
	// 		l = Get_By_Label(cities[selected_city][1]);
	// 		makeBars(l,year);
	// 	} else if( document.getElementById("company-button").checked){
	// 		l = Get_By_Label(cities[selected_city][2]);
	// 		makeBars(l,year);
	// 	}
	// });
	},1500*year);

	d3.select("#mapid").select("svg").select("g").selectAll("circle")
                                               	 .data(Data.objects)
												 // //add click functionality for the circles
												 // .on("click", function(d){
													//  		  selected_city = d.circle.City;
												 //
													// 		  //when clicked, city will have a red outline, all other cities will have no outline
													// 		  d3.selectAll("circle").style("stroke","none");
													// 		  d3.select(this).style("stroke", "red")
													// 						 .style("stroke-width","2px");
													// 		  //when you click a city, the sidebar responds with the breakdown, based on radio button state
													// 		  var l;
													// 		  if( document.getElementById("country-button").checked){
													// 		  	  l = Get_By_Label(cities[selected_city][0]);
												 //
													// 		  } else if( document.getElementById("product-button").checked){
													// 		  	  l = Get_By_Label(cities[selected_city][1]);
												 //
													// 		  } else if( document.getElementById("company-button").checked){
													// 		  	  l = Get_By_Label(cities[selected_city][2]);
												 //
													// 		  }
													// 		  makeBars(l,year);
													//   })
                                                 .transition()
												 //duration of each transition is 1500 milliseconds
												 .duration(1500)
												 //each transition must be delayed by an incrementing value or all...
												 //...will run at once
												 .delay(1500*year)
												 //make them look smoother
												 .ease(d3.easeLinear)
												 //change the fill color and radius to next values in the series
                                                 .style("fill",function(d){ return d.circle.Color[year]; })
                                                 .attr("r", function(d){ return d.circle.Imports[year]*0.01; });

});












// //Not sure if I'll need this either, but use them in a few places below
// var margin = {top: 2, right: 2, bottom: 5, left: 5};
// var width = document.getElementById("bottom").offsetWidth - margin.left - margin.right;
// var height = document.getElementById("bottom").offsetHeight - margin.top - margin.bottom;
//
// var parse_dates = function(date){
// 	var new_date = date.slice(4,) + "-" + date.slice(0,4);
// 	var parse_time = d3.timeParse("%m-%Y");
// 	var format = d3.timeFormat("%b-%Y");
// 	return parse_time(new_date);
// };
//
// //set up data
// var data = {};
//
// data.dates = Object.keys(crude_prices).map(function(date){ return parse_dates(date); });
// data.prices = Object.values(crude_prices);
//
//
// //number of data points
// var n = Object.keys(crude_prices).length;
//
// //set up the x and y values - may need to parse dates from YYYYMM to MM-YYYY
// var x = d3.scaleTime()
// 		  .domain(d3.extent(data.dates))                  //domain of inputs
// 		  .range([0, width]);                             //range of outputs
//
// var y = d3.scaleLinear()
// 		  .domain(d3.extent(data.prices))                 //domain of inputs
// 		  .range([height, 0]); 							  //range of outputs
//
//
// var line = d3.line()
// 			  .x(function(d){ return x(d.dates); })
// 			  .y(function(d){ return y(d.prices); });
//
//
// var TS_svg = d3.select("#bottom")
// 			   .append("svg")
// 			   .attr("width", width)
// 			   .attr("height", height)
// 			   .append("g")
// 			   .attr("class","line-chart")
// 			   .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
//
//
// TS_svg.append("g")
// 	  .attr("class","y axis")
// 	  .attr("height", height)
// 	  .call(d3.axisLeft(y));
//
// TS_svg.append("g")
// 	  .attr("class", "x axis")
// 	  .attr("transform", "translate(0,"+ height +")")
// 	  .call(d3.axisBottom(x));
//
// TS_svg.append("path")
// 	  	  .data(data)
// 	  	  .attr("class", "line")
// 	  	  .attr("d", line(data));
//
// d3.selectAll(".tick").attr("stroke", "red").attr("fill","blue");
