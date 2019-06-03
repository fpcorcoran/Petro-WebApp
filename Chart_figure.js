//Get a timeseries array for each key in the dataset
var Get_By_Label = function(data){
	var labels = [];

	//append all the labels to the labels list from all the dates
	Object.keys(data).forEach(function(d){
		labels = labels.concat(Object.keys(data[d]));
	});

	//convert the labels array to a set, automatically erasing all duplicate labels
	// Note To Self: "new" is for constructing, not dynamic assignment (no need to clean up this var)
	var u_labels = new Set(labels);

	//add a key to the labeled_totals object for each unique label and match with an empty array
	var labeled_totals = [];
	u_labels.forEach(function(u){
		labeled_totals.push({"Label":u, "Imports":[],"Color":chroma.random()});
	});

	//loop through dates
	Object.keys(data).forEach(function(d){
		//loop through unique list of labels
		labeled_totals.forEach(function(l,i){
			//if the list of labels for that date contains the label in quesiton:
			if( Object.keys(data[d]).includes(l.Label) ){
				//append the total value to the list in labeled_totals
				labeled_totals[i].Imports.push(data[d][l.Label].Total);
			//if that label does not appear in that date period
			} else{
				//append a 0 to the list in labeled_totals
				labeled_totals[i].Imports.push(0);
			}


		});
	});
	//Example result: labeled_totals = {"ARGENTINA":[...], "CANADA":[...], "SAUDI ARABIA":[...]}
	return labeled_totals;
};

var sb_width = 300; barHeight = 20;

var makeBars = function(labeled_totals,start){

	//get the number of labels (e.g. countries/companies/products) for the ports
	var n_labels = labeled_totals.length;
	//get the number of imports in for the first port entry
	var n_inc = labeled_totals[0].Imports.length;

	//create a list of all possible labels
	var all_vals = [];
	labeled_totals.forEach(function(l){
		all_vals = all_vals.concat(l.Imports);
	});

	var x = d3.scaleLinear()
	    	  .domain([0, d3.max(all_vals)])
	    	  .range([0, sb_width]);

	var t = d3.transition()
		      .duration(1500)
		      .ease(d3.easeLinear);

	var chart = d3.select(".chart")
		  	      .attr("width", sb_width)
		  	      .attr("height", barHeight * n_labels);


	var bar = chart.selectAll("g")
				   .data(labeled_totals)
				   .enter().append("g")
				   .attr("transform", function(d, i) { return "translate(0," + i * barHeight + ")"; });

	bar.append("rect")
	   .attr("width", function(d){ return x(d.Imports[start]); })
	   .attr("height", barHeight - 1)
	   .style("fill",function(d){ return d.Color; })
	   .filter(function(d){ return d.Imports[start] > 0; });


	bar.append("text")
	   .attr("text-anchor","start")
	   .attr("x",sb_width)
	   .attr("y", barHeight / 2)
	   .attr("dy", ".35em")
	   .text(function(d) {
		   //if(x(d.Imports[0]) > 0){
		    return d.Label;
			//}
		})
		.filter(function(d){ return d.Imports[start] > 0; });

		d3.selectAll("rect")
		  .data(labeled_totals)
		  .on("mouseover", function(d){
			  d3.select(this).attr("stroke", "red")
							 .attr("stroke-width", "2px");
			  //need to be able to get the current state of the model to display amount value
			  console.log(d.Imports[0]);
		  })

		  .on("mouseout", function(d){
			  d3.select(this).attr("stroke","none")
							 .attr("stroke-width", "0px");
			  //insert function to remove amount value from screen when mouse moves off it
		  });



	var bar_transition = function(start){
		T=0;
		for(i=start; i < n_inc; i++){
			d3.selectAll("rect")
			  .data(labeled_totals)
			  .transition()
			  .duration(1500)
			  .delay(1500*T)
			  .ease(d3.easeLinear)
			  .attr("width", function(d){ return x(d.Imports[i]); })
			  .filter(function(d){ return d.Imports[i] > 0; });
			 T++;

  		}
	};

	bar_transition(start);

};

var clearSidebar = function(){
	d3.selectAll(".chart > *").remove();
};
