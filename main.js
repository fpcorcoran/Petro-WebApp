/* This file contains the main functionality of the application:
 *
 * 1) Adding a basemap
 *      - zoom control buttons are turned off for asthetic purposes (two finger zoom still enabled)
 *
 * 2) Button Interactivity
 *      - get buttons by Id
 *      -
 *
 *
 */


/*
 * Add Basemap
 */

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

/*
var Organize = function(list, cities) {

  var f = chroma.scale(['#B22222','#EEC900','#228FCF','#0000ff']).domain([0,50,150,275]);

  var Data = {"objects":[]};

  _.each(list, function(obj) {

	var sub_obj = {};
    var city = obj.City;
    var geo = JSON.parse(obj[".geo"]).coordinates;
    var precip = [];
    var years = [];

    for (year = 198601; year < 201612; year++){
      y = year.toString();
      if(obj[y] != null){
        years.push(y);
        precip.push(obj[y]);
      }
    }
    var color = _.map(precip, function(p){ return chroma(f(p)._rgb).hex(); });

    sub_obj.circle = {"City":city,
               "Precip":precip,
			   "Imports":Get_TimeSeries(cities[city]),
               "Color": color,
               "YearMonth": years,
               "coordinates":[geo[1],geo[0]]};

	  Data.objects.push(sub_obj);
  });
  return Data;
};
*/

//Organize Data from precipitation
var Data = Organize(precip2, cities);

//Create SVG element inside map
L.svg().addTo(map);

//Create a Leaflet LatLng object for each of the ports
Data.objects.forEach(function(d){
  d.LatLng = new L.LatLng(d.circle.coordinates[0], d.circle.coordinates[1]);
});


//Select the g element of the map svg and append a circle for each port
var g = d3.select("#mapid").select("svg").select('g').selectAll("circle")
			                                             .data(Data.objects)
			                                             .enter().append("circle")
			                                             .style("stroke", "black")
			                                             .style("opacity", 0.6)
			                                             .style("fill", function(d){ return d.circle.Color[0]; })
			                                             .attr("r", function(d){ return d.circle.Imports[0]*0.01; })
														 .attr("id", function(d){ return d.circle.City; })
                                                   		 .attr("transform", function(d) {
				                                                 	  	return "translate("+
					                                                	map.latLngToLayerPoint(d.LatLng).x +","+
					                                                	map.latLngToLayerPoint(d.LatLng).y +")"; });

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
	d3.select("#mapid").select("svg").select("g").selectAll("circle")
                                               	 .data(Data.objects)
                                                 .transition()
												 .duration(1500)
												 .delay(1500*year)
												 .ease(d3.easeLinear)
                                                 .style("fill",function(d){ return d.circle.Color[year]; })
                                                 .attr("r", function(d){ return d.circle.Imports[year]*0.01; });

});


/*
 * Add button interactivity
 */


//get buttons from html
var next = document.getElementById("right-button");
var prev = document.getElementById("left-button");
var play = document.getElementById("play");
var pause = document.getElementById("pause");
//var dateSkip = document.getElementById("date-submit");

//register events to buttons
//backForth(next,prev,date,markers);

//PlayPause(play,pause,date,markers);

//SkipTo(dateSkip, markers);
