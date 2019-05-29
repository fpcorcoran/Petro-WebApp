var make_TimeSeries = function(){

	var margin = {top: 2, right: 2, bottom: 5, left: 25};

	var width = document.getElementById("bottom").offsetWidth - margin.left - margin.right;
	var height = document.getElementById("bottom").offsetHeight - margin.top - margin.bottom;

	var parse_dates = function(date){
		var new_date = date.slice(4,) + "-" + date.slice(0,4);
		var parse_time = d3.timeParse("%m-%Y");
		var format = d3.timeFormat("%b-%Y");
		return parse_time(new_date);
	};

	//set up data
	var data = [];

	//parse the dates
	var dates = Object.keys(crude_prices).map(function(date){ return parse_dates(date); });
	var prices = Object.values(crude_prices);

	//append each month in the time series as a new object pair to the data variable
	for(i=0; i<Object.keys(dates).length; i++){
		var new_entry = {};

		new_entry.date = dates[i];
		new_entry.price = Object.values(crude_prices)[i];

		data.push(new_entry);
	}

	//set up the x and y values - may need to parse dates from YYYYMM to MM-YYYY
	var x = d3.scaleTime()
			  .domain(d3.extent(dates))                  //domain of inputs
			  .range([0, width]);                             //range of outputs

	var y = d3.scaleLinear()
			  .domain([0, d3.max(prices)+10])                 //domain of inputs
			  .range([height, 0]); 							  //range of outputs


	var line = d3.line()
				  .x(function(d){ return x(d.date); })
				  .y(function(d){ return y(d.price); });

	//append an SVG element to the bottom bar, reshape it to the bottom dimensions, and append <g> tag with margins
	var TS_svg = d3.select("#bottom")
				   .append("svg")
				   .attr("width", width)
				   .attr("height", height)
				   .append("g")
				   .attr("class","line-chart")
				   .attr("transform", "translate(" + margin.left + "," + "-" + margin.bottom + ")");


	//apend Y Axis
	TS_svg.append("g")
		  .attr("class","y-axis")
		  .attr("height", height)
		  .attr("stroke","white")
		  .call(d3.axisLeft(y));

	//append X Axis
	TS_svg.append("g")
		  .attr("class", "x-axis")
		  .attr("transform", "translate(0,0"+")")
		  .attr("stroke","white")
		  .call(d3.axisBottom(x));

	//append the actual time series line
	TS_svg.append("path")
		  	  .data(data)
		  	  .attr("class", "line")
		  	  .attr("d", line(data));

    //create invisible dots on the timeline - when moused over, will give the date
	TS_svg.selectAll(".dot")
	      .data(data)
		  .enter().append("circle")
		  .attr("class","dot")
		  .attr("cx", function(d){ return x(d.date); })
		  .attr("cy", function(d){ return y(d.price); })
		  .attr("r", "3px")
		  .style("fill-opacity",0.0)
		  .on("click", function(d){
			  console.log(d.date);
		  });

	//remove every other Y Axis label to avoid cluttering
	d3.select(".y-axis").selectAll(".tick text")
	  .attr("stroke-width", "1px")
	  .attr("stroke","white")
	  .attr("class",function(d,i){
		  //remove
		  if(i%3 != 0){
			  d3.select(this).remove();
		  }
	  });

	//append the marker line that indicates the time state of the model
	TS_svg.append("line")
		  .attr("x1",x(dates[0]))
		  .attr("y1",0)
		  .attr("x2",x(dates[0]))
		  .attr("y1",height)
		  .attr("T",1)
		  .attr("stroke","red")
		  .attr("stroke-width","4px")
		  .attr("class","marker-line");

	//transition the marker line across of the time series
	var marker_transition = function(start){
		var T = 1;
	  	for(i=start; i<dates.length; i++){
	  		d3.select(".marker-line")
	  		  .transition()
	  		  .duration(1500)
	  		  .delay(1500*T)
	  		  .ease(d3.easeLinear)
	  		  .attr("x1", x(dates[i]) )
	  		  .attr("x2", x(dates[i]) );
			T++;
	  		}
	  	};

	marker_transition(1);

    //find the index of the nearest value when marker is dragged/dropped on the timeline
	var find_nearest = function(dragged_x){
			//get the x-axis coordinate for all the dates
			var x_dates = dates.map(function(d){ return x(d); });

			//get the distance between each coordinate and the dragged_x
			var dist = x_dates.map(function(d){ return Math.abs(d - dragged_x); });

			//get the index of the smallest distance
			return dist.indexOf(Math.min.apply(null,dist));
	};

	//make marker line clickable and dragable (needs to also return its time state)
	var drag_line = d3.drag()
					  .on("start",function(d){
						  //Stop previous transition
						  d3.select(".marker-line")
						    .transition()
							.duration(0);
						  //make the line actively clickable
						  d3.select(this)
						    .raise()
							.classed("active", true);
					  })
					  .on("drag",function(d){
						  //get the date closest to the new x
						  var new_x = dates[find_nearest(d3.event.x)];
						  //set the x values to the x value of the closest x
						  d3.select(this)
						    .attr("x1", x(new_x))
							.attr("x2", x(new_x));
					  })
					  .on("end",function(d){
						  //restart the transition using that nearest index
						  var index = find_nearest(this.getAttribute("x1"));
      				      marker_transition(index);

						  //deactivate marker
						  d3.select(this)
							.classed("active",false);
					  });

	d3.select(".marker-line")
	  .call(drag_line);

};
