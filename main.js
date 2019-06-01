/*
 * SET UP MAP
 */


//dark theme basemap
basemapURL = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';

//set date variable
var date = 0;

//Create map Object
var map = L.map('mapid', {
  zoomControl: false,
  center: [35, -107],
  zoom: 4.45
});

//Create Basemap Tile Layer
baseMap = L.tileLayer(basemapURL, {
  ext: 'png',
}).addTo(map);

//reset map with button
var map_button = document.getElementById("map-reset-button").addEventListener("click", function(){
	map.setView([35, -107],4.45); });

/*
 * SET UP DATA
 */


//get the first entry of the lists of data for each city (only necessary for input into Organize() function)
var c = {};
Object.keys(cities).forEach(function(city){
	c[city] = cities[city][0];
});

//Organize Data from precipitation
var Data = Organize(precip2, cities);

//Create SVG element inside map
L.svg().addTo(map);

//Create a Leaflet LatLng object for each of the ports
Data.objects.forEach(function(d){
  d.LatLng = new L.LatLng(d.circle.coordinates[0], d.circle.coordinates[1]);
});


/*
 * SET UP RADIO BUTTONS FOR COMPANY/COUNTRY/PRODUCT
 */

 //Get the current state of the model selection
 var selected_city;



/*
 * CREATE THE TIME SERIES AND MARKER LINE ON PAGE LOAD
 */

//Create dispatch event "statechange" - this can dispatch the change in timeseries to the map & chart
var dispatch = d3.dispatch("statechange");

//package dispatch events into a function so they can be passed to make_TimeSeries
var call_dispatch = function(index){
	//dispatch the circle event
	dispatch.on("statechange.circles", function(){
		clear_circles();
		selected_city = make_circles(map,index,map.getZoom());
		make_buttons(selected_city, index);
	});

	//define dispatch behavior - both called by the make_TimeSeries() function
	dispatch.on("statechange.chart", function(){
		clearSidebar();
		makeBars(Get_By_Label(selected_city), index);
	});



	//call the dispatch
	dispatch.call("statechange");

};

//make the time series - will dispatch events to circles and chart
make_TimeSeries(call_dispatch);



/*
 * CREATE THE CIRCLES ON PAGE LOAD
 */

make_circles(map, 0, map.getZoom());


/*
 * MAKE BAR CHART BASED ON TIME SERIES MARKER
 */
