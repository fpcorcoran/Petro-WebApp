//FINISH ADDING CITIES
var cities = {
			  //"Baltimore": "DUMMY FOR NOW",
			  "Baton Rouge":BATON_ROUGE_CNTRY_NAME,
		  	  "Beaumont":BEAUMONT_CNTRY_NAME,
		  	  "Boston": BOSTON_CNTRY_NAME,
		  	  "Charleston": CHARLESTON_CNTRY_NAME,
		  	  "Corpus Christi": CORPUS_CHRISTI_CNTRY_NAME,
			  "Galveston":GALVESTON_CNTRY_NAME,
		  	  "Houston": HOUSTON_CNTRY_NAME,
		  	  "Jacksonville": JACKSONVILLE_CNTRY_NAME,
		      "Lake Charles": LAKE_CHARLES_CNTRY_NAME,
		  	  "Los Angeles": LOS_ANGELES_CNTRY_NAME,
		  	  "Miami": MIAMI_CNTRY_NAME,
		  	  "Mobile": MOBILE_CNTRY_NAME,
		  	  "Morgan City": MORGAN_CITY_CNTRY_NAME,
			  "New Bedford": NEW_BEDFORD_CNTRY_NAME,
			  "New Haven": NEW_HAVEN_CNTRY_NAME,
			  "New Orleans": NEW_ORLEANS_CNTRY_NAME,
			  "New York": NEW_YORK_CNTRY_NAME,
		  	  "Newark": NEWARK_CNTRY_NAME,
		  	  "Norfolk":NORFOLK_CNTRY_NAME,
		  	  "Pascagoula": PASCAGOULA_CNTRY_NAME,
			  "Philadelphia":PHILADELPHIA_CNTRY_NAME,
			  "Port Arthur": PORT_ARTHUR_CNTRY_NAME,
			  "Portland": PORTLAND_CNTRY_NAME,
			  "Portsmouth":PORTSMOUTH_CNTRY_NAME,
			  "Providence": PROVIDENCE_CNTRY_NAME,
			  "Port Canaveral": PT_CANAVERAL_CNTRY_NAME,
			  "San Francisco": SAN_FRANCISCO_CNTRY_NAME,
			  "Savannah": SAVANNAH_CNTRY_NAME,
			  "Tampa": TAMPA_CNTRY_NAME,
			  "Wilmington": WILMINGTON_CNTRY_NAME
		     };


var Get_TimeSeries = function(countries){
	var all_totals = {};
	Object.keys(countries).forEach(function(year){
		Object.keys(countries[year]).forEach(function(cntry){
			all_totals[year] = countries[year][cntry]["Total"];
	 	});
	});
	return Object.values(all_totals);
};


var Organize = function(list) {

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
