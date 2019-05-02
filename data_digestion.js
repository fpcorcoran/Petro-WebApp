var cities = {"Galveston":Galveston_CNTRY_NAME};


var Get_TimeSeries = function(filename){
	var all_totals = {};
	filename.forEach(function(years){
		Array.from(Object.keys(years)).forEach(function(y){
			all_totals[y] = 0;
			Object.keys(years[y]).forEach(function(countries){
				all_totals[y] += years[y][countries]["Total"];
			});
		});
	});
	return Object.values(all_totals);
};


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
