var make_circles = function(map, start, zoomLevel){

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
		  .style("fill", function(d){ return d.circle.Color[start]; })
		  .attr("r", function(d){ return d.circle.Imports[start]*0.00175; })	//look for better way to do this
		  .attr("id", function(d){ return d.circle.City; })
		  //translate the circles so that their centers align with the lat/long of their respective city
		  .attr("transform", function(d) {
						 return "translate("+
						 map.latLngToLayerPoint(d.LatLng).x +","+
						 map.latLngToLayerPoint(d.LatLng).y +")";
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



	var circle_transition = function(start){
		var T = 0;
		for (i=start; i<Data.objects[0].circle.Imports.length; i++){
			window.current_timestate = i;
		   	 g.data(Data.objects)
		     .transition()
			 //duration of each transition is 1500 milliseconds
			 .duration(1500)
			 //each transition must be delayed by an incrementing value or all...
			 //...will run at once
			 .delay(1500*T)
			 //make them look smoother
			 .ease(d3.easeLinear)
			 //change the fill color and radius to next values in the series
		     .style("fill",function(d){ return d.circle.Color[i]; })
		     .attr("r", function(d){ return d.circle.Imports[i]*0.00175; });
			T++;
	    }
	};

	//activate transition on circles when parent function is called
	circle_transition(start);

	return g;
};


var select_circle = function(g, start_time){

	//add click functionality for the circles
	g.on("click", function(d){
				 //update the global variable "selected_city" in main.js (accessed using window."variable name")
				 window.selected_city = d.circle.City;
				 window.selected_elem = this;
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
	// console.log("select_circle function - ", selected_city);
	// return selected_city;
};


var clear_circles = function(){
	d3.selectAll("circle").remove();
};
