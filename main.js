
/*
 * KEEP ALL THIS IN MAIN
 */

//dark theme basemap
basemapURL = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';

//set date variable
var date = 0;

//Create map Object
//39.82, -98.58
var map = L.map('mapid', {
  zoomControl: false,
  center: [35, -107],
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

//Add event listeners to the data type buttons
var check = function(buttonID){
	$("#"+buttonID).prop("checked");
	$("#"+buttonID+"-label").addClass("active");
};

var uncheck = function(buttonID){
	if (document.getElementById(buttonID).checked){
		$("#"+buttonID).removeProp("checked");
	}
	$("#"+buttonID+"-label").removeClass("active");
};

//Get the current state of the model selection
var selected_city;
var start_time;

//Products button interactivity
$("#product-button").on("click", function(){

	check("product-button");
	uncheck("company-button");
	uncheck("country-button");

	clearSidebar();
	makeBars(Get_By_Label(cities[selected_city][1]),start_time);

});

//Companies button interactivity
$("#company-button").on("click", function(){

	uncheck("product-button");
	check("company-button");
	uncheck("country-button");

	clearSidebar();
	makeBars(Get_By_Label(cities[selected_city][2]),start_time);
});

//Countries button interactivity
$("#country-button").on("click", function(){

	uncheck("product-button");
	uncheck("company-button");
	check("country-button");

	clearSidebar();
	makeBars(Get_By_Label(cities[selected_city][0]),start_time);
});











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

					  //if the chart hint is still up, get rid of it
					  var hint = document.getElementById("chart-hint");
					  if(document.body.contains(hint)){
						  document.getElementById("chart-area").removeChild(hint);
					  }

					  //if there is city already being displayed, remove it
					  if(title.childNodes.length > 1){
					  	title.removeChild(title.childNodes[1]);
					  }

					  //add the newly selected city to <p>Port: </p>
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
					  clearSidebar();
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

		//Get the chart date
		var current_year = document.getElementById("chart-date");

		//create data parse and format functions
		var p = d3.timeParse("%m-%Y");
		var f = d3.timeFormat("%b-%Y");

		//get a list of dates (just used baton rouge for ease, could be any city)
		var d = Object.keys(BATON_ROUGE_CNTRY_NAME)[year];

		//change YYYYmm to mm-YYYY, parse the date and format it to bbb-YYY
		var formatted_date = f(p(d.slice(4,) + "-" + d.slice(0,4)));

		//create a text node with the new date
		var time_node = document.createTextNode(formatted_date);

		//if the date tag already has a date in it, remove that date
		if( current_year.childNodes.length > 1){
			current_year.removeChild(current_year.childNodes[1]);
		}
		//append the new date to the date tag
		current_year.appendChild(time_node);

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
                                                 .attr("r", function(d){
													 return d.circle.Imports[year]*0.01;
													 // if(isNaN(d.circle.Imports[year])){
														// console.log("Problem with " + d.circle.City);
														// console.log(year);
														// //return d.circle.Imports[year]*0.01;
													 // }else{
														//  return d.circle.Imports[year]*0.01;}
													  });

});















make_TimeSeries();
