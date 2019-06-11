//FINISH ADDING CITIES
var cities = {
			  //"Baltimore": "DUMMY FOR NOW",
			  "Baton Rouge": [BATON_ROUGE_CNTRY_NAME,BATON_ROUGE_PROD_NAME,BATON_ROUGE_R_S_NAME],
		  	  "Beaumont": [BEAUMONT_CNTRY_NAME,BEAUMONT_PROD_NAME,BEAUMONT_R_S_NAME],
		  	  "Boston": [BOSTON_CNTRY_NAME,BOSTON_PROD_NAME,BOSTON_R_S_NAME],
		  	  "Charleston": [CHARLESTON_CNTRY_NAME,CHARLESTON_PROD_NAME,CHARLESTON_R_S_NAME],
		  	  "Corpus Christi": [CORPUS_CHRISTI_CNTRY_NAME,CORPUS_CHRISTI_PROD_NAME,CORPUS_CHRISTI_R_S_NAME],
			  "Galveston":[GALVESTON_CNTRY_NAME,GALVESTON_PROD_NAME,GALVESTON_R_S_NAME],
		  	  "Houston": [HOUSTON_CNTRY_NAME,HOUSTON_PROD_NAME,HOUSTON_R_S_NAME],
		  	  "Jacksonville": [JACKSONVILLE_CNTRY_NAME,JACKSONVILLE_PROD_NAME,JACKSONVILLE_R_S_NAME],
		      "Lake Charles": [LAKE_CHARLES_CNTRY_NAME,LAKE_CHARLES_PROD_NAME,LAKE_CHARLES_R_S_NAME],
		  	  "Los Angeles": [LOS_ANGELES_CNTRY_NAME,LOS_ANGELES_PROD_NAME,LOS_ANGELES_R_S_NAME],
		  	  "Miami": [MIAMI_CNTRY_NAME,MIAMI_PROD_NAME,MIAMI_R_S_NAME],
		  	  "Mobile": [MOBILE_CNTRY_NAME,MOBILE_PROD_NAME,MOBILE_R_S_NAME],
		  	  "Morgan City": [MORGAN_CITY_CNTRY_NAME,MORGAN_CITY_PROD_NAME,MORGAN_CITY_R_S_NAME],
			  "New Bedford": [NEW_BEDFORD_CNTRY_NAME,NEW_BEDFORD_PROD_NAME,NEW_BEDFORD_R_S_NAME],
			  "New Haven": [NEW_HAVEN_CNTRY_NAME,NEW_HAVEN_PROD_NAME,NEW_HAVEN_R_S_NAME],
			  "New Orleans": [NEW_ORLEANS_CNTRY_NAME,NEW_ORLEANS_PROD_NAME,NEW_ORLEANS_R_S_NAME],
			  "New York": [NEW_YORK_CNTRY_NAME,NEW_YORK_PROD_NAME,NEW_YORK_R_S_NAME],
		  	  "Newark": [NEWARK_CNTRY_NAME,NEWARK_PROD_NAME,NEWARK_R_S_NAME],
		  	  "Norfolk":[NORFOLK_CNTRY_NAME,NORFOLK_PROD_NAME,NORFOLK_R_S_NAME],
		  	  "Pascagoula": [PASCAGOULA_CNTRY_NAME,PASCAGOULA_PROD_NAME,PASCAGOULA_R_S_NAME],
			  "Philadelphia":[PHILADELPHIA_CNTRY_NAME,PHILADELPHIA_PROD_NAME,PHILADELPHIA_R_S_NAME],
			  "Port Arthur": [PORT_ARTHUR_CNTRY_NAME,PORT_ARTHUR_PROD_NAME,PORT_ARTHUR_R_S_NAME],
			  "Portland": [PORTLAND_CNTRY_NAME,PORTLAND_PROD_NAME,PORTLAND_R_S_NAME],
			  "Portsmouth":[PORTSMOUTH_CNTRY_NAME,PORTSMOUTH_PROD_NAME,PORTSMOUTH_R_S_NAME],
			  "Providence": [PROVIDENCE_CNTRY_NAME,PROVIDENCE_PROD_NAME,PROVIDENCE_R_S_NAME],
			  "Port Canaveral": [PT_CANAVERAL_CNTRY_NAME,PT_CANAVERAL_PROD_NAME,PT_CANAVERAL_R_S_NAME],
			  "San Francisco": [SAN_FRANCISCO_CNTRY_NAME,SAN_FRANCISCO_PROD_NAME,SAN_FRANCISCO_R_S_NAME],
			  "Savannah": [SAVANNAH_CNTRY_NAME,SAVANNAH_PROD_NAME,SAVANNAH_R_S_NAME],
			  "Tampa": [TAMPA_CNTRY_NAME,TAMPA_PROD_NAME,TAMPA_R_S_NAME],
			  "Wilmington": [WILMINGTON_CNTRY_NAME,WILMINGTON_PROD_NAME,WILMINGTON_R_S_NAME]
		     };

/*
* function for getting all the unique dates of record in the data
*/

var Get_All_Dates = function(cities){
	//initialize array to hold all dates of all cities
	var lengths = [];
	//loop through each city
	Object.values(cities).forEach(function(city){
		//loop through each file (data type) for each city
		_.each(city, function(type){
			//concatenate all the recorded years for each type into master list
			lengths = lengths.concat(Object.keys(type));
		});
	});
	//return an array from the lengths containing only unique values (e.g. every distinct year on record, all cities)
	return Array.from(new Set(lengths));
};

/*
 * function for creating a time series of total import volume for a given city dataset - used to create the
 * radius of the circles for each transition.
 * Note: if a date is not recorded for that port, a volume of 0 is assumed
 */
var Get_TimeSeries = function(city_list){

	//collect all possible dates
	var all_dates = Get_All_Dates(cities);

	//isolate the CNTRY_NAME dataset for the city
	var countries = city_list[0];

	//set up array to hold import totals
	var time_series = [];

	//loop through all dates
	all_dates.forEach(function(date){

		//initialize a total starting at zero
		var total = 0;
		//check if there is a record for that city on that date
		if(countries[date] != null){
			//loop through shipments broken down by country
			Object.values(countries[date]).forEach(function(c){
				//add the total on that date from each country to the total variable
				total = total + c.Total;
			});
			//push the newly calculated total to the time series
			time_series.push(total);
		}
		else{
			//if the date is not on record for that city, push the total anyways (will push a 0 to the time series)
			time_series.push(total);
		}
	});

	return time_series;
};

/*
 * Function for organizing all the data from all cities into a single object
 * Data = {objects:[circle:{City:"Name",
 * 						    Precip:[...],
 * 						    Imports:[...],
 *						    Color:[...],
 *						    YearMonth:[...],
 *						    coordinates:[...]},
 *				    circle:{...}
 *			        circle: {...}]
 *		    }
 */

var Organize = function(list,cities) {
  //create a color scale from the domain of the data
  var f = chroma.scale(['#d3d6d9','#0042f9','000cf9','#0000ff']).domain([0,175,225,275]);

  //create an object to hold the final data output from each city
  var Data = {"objects":[]};

  var all_dates = Get_All_Dates(cities);
  //for each city in the list, parse its data
  _.each(list, function(obj) {
	//subobject for holding current city data
	var sub_obj = {};
	//get the name of the city
    var city = obj.City;
	//get the lat/lon of the city
    var geo = JSON.parse(obj[".geo"]).coordinates;
	//initialize array to hold precipitation
    var precip = [];
	//initialize array to hold year
    var years = [];

	//loop through all dates in the data
    _.forEach(all_dates, function(y){
	  //test if that is a year in the data
      if(obj[y] != null){
        years.push(y);
        precip.push(obj[y]);
	} else{
		years.push(0);
		precip.push(0);
	}
    });

	//map a color from the predefined scale to the precipitation of each year
    var color = _.map(precip, function(p){ return chroma(f(p)._rgb).hex(); });

	//populate the subobject with the parsed data for each category
    sub_obj.circle = {"City":city,
               "Precip":precip,
			   "Imports":Get_TimeSeries(cities[city]),
               "Color": color,
               "YearMonth": years,
               "coordinates":[geo[1],geo[0]]};

	  //push the subobject of the current city to the object responsible for holding all the data
	  Data.objects.push(sub_obj);
  });
  return Data;
};
