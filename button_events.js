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

//Get the current state of the model selection
var selected_city;

//Add event listeners to the data type buttons
var make_buttons = function(selected_city, index){
	//Countries button interactivity
	$("#country-button").on("click", function(){

		uncheck("product-button");
		uncheck("company-button");
		check("country-button");

		clearSidebar();
		//Get the selected city from the cities data object, then take the first data type (i.e. country of origin)
		makeBars(Get_By_Label(cities[selected_city][0]), index);
	});

	//Products button interactivity
	$("#product-button").on("click", function(){

		check("product-button");
		uncheck("company-button");
		uncheck("country-button");

		clearSidebar();
		//Get the selected city from the cities data object, then take the second data type (i.e. product type)
		makeBars(Get_By_Label(cities[selected_city][1]), index);

	});

	//Companies button interactivity
	$("#company-button").on("click", function(){

		uncheck("product-button");
		check("company-button");
		uncheck("country-button");

		clearSidebar();
		//Get the selected city from the cities data object, then take the third data type (i.e. receiving company)
		makeBars(Get_By_Label(cities[selected_city][2]), index);
	});

};
