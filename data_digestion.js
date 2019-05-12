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


var Get_TimeSeries = function(countries){
	var all_totals = {};
	Object.keys(countries).forEach(function(year){
		Object.keys(countries[year]).forEach(function(cntry){
			all_totals[year] = countries[year][cntry]["Total"];
	 	});
	});
	return Object.values(all_totals);
};


var Organize = function(list,cities) {

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
