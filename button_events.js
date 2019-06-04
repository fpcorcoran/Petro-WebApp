/*
 * SET UP RADIO BUTTONS FOR COMPANY/COUNTRY/PRODUCT
 */

//Function for checking a button
var check = function(buttonID){
	$("#"+buttonID).prop("checked");
	$("#"+buttonID+"-label").addClass("active");
};

//Function for unchecking a button
var uncheck = function(buttonID){
	if (document.getElementById(buttonID).checked){
		$("#"+buttonID).removeProp("checked");
	}
	$("#"+buttonID+"-label").removeClass("active");
};

//Add event listeners to the data type buttons
var make_buttons = function(){
	//Countries button interactivity
	$("#country-button").on("click", function(){

		uncheck("product-button");
		uncheck("company-button");
		check("country-button");

		clearSidebar();
		//Get the selected city from the global variable, then take the first data type (i.e. country of origin)
		makeBars(Get_By_Label(cities[window.selected_city][0]), window.current_timestate);
	});

	//Products button interactivity
	$("#product-button").on("click", function(){

		check("product-button");
		uncheck("company-button");
		uncheck("country-button");

		clearSidebar();
		//Get the selected city from the global variable, then take the second data type (i.e. product type)
		makeBars(Get_By_Label(cities[window.selected_city][1]), window.current_timestate);

	});

	//Companies button interactivity
	$("#company-button").on("click", function(){

		uncheck("product-button");
		check("company-button");
		uncheck("country-button");

		clearSidebar();
		//Get the selected city from the global variable, then take the third data type (i.e. receiving company)
		makeBars(Get_By_Label(cities[window.selected_city][2]), window.current_timestate);
	});

};
