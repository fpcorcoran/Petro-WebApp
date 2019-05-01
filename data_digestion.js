
var parse_imports = function(imports_json){

  var totals={};

  //list of all the years
  var years = Object.keys(imports_json[0]);


  var types = [];


  //loop through years
  _.each(years, function(y){
    //append the import types from each year to types
    types.push(Object.keys(imports_json[0][y]));
  });



  //get a list of all unique types in the dataset
  var unique_types = Array.from(new Set([].concat.apply([],types)));

  _.each(years, function(y){
    _.each(unique_types, function(type){
      if(Object.keys(imports_json[0][y]).includes(type)){
        totals[imports_json[0][y][type]].push(imports_json[0][y]["Total"]);
      }
      else{
        totals[imports_json[0][y][type]].push(0);
      }
    });
  });

  console.log(totals);
};


//var f = chroma.scale(['#B22222','#EEC900','#228FCF','#0000ff']).domain([0,50,150,275]);

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
               "Color": color,
               "YearMonth": years,
               "coordinates":[geo[1],geo[0]]};

	  Data.objects.push(sub_obj);
  });
  return Data;
};


/*
///Function for digesting Ports_geo.js data and creating workable JSON
var Organize = (list) => {
  var Data = [];
  _.each(list, (obj) => {
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
    Data.push({"City":city,
               "Precip":precip,
               "YearMonth": years,
               "Lat":geo[1],
               "Lng":geo[0]});
  });
  return Data;
};
*/

/*
var makeMarkers = function(list, date){
  //create color scale
  var f = chroma.scale(['#B22222','#EEC900','#228FCF','#0000ff']).domain([0,50,150,275]);


}
*/


//Function for making circular markers with radius relative to precipitation
var makeMarkers = (list, date) => {
  //create color scale
  var f = chroma.scale(['#B22222','#EEC900','#228FCF','#0000ff']).domain([0,50,150,275]);
  var mapped = _.map(list, (obj) => {

    //get rgb color array for precipitation value from color scale
    var rgb = f(obj["Precip"][date])["_rgb"];
    //get hexcode from rgb array
    var hex = chroma(rgb).hex()

    var circle = L.circle([obj.Lat, obj.Lng],{
      color: hex,
      fillColor: hex,
      fillOpacity: 0.5,
      radius: obj["Precip"][date]*500
    }).bindPopup(obj.City + " - " + obj["Precip"][date].toString()).addTo(map);
    return circle;
  });
  return mapped;
};


//f = chroma.scale(['#B22222','#EEC900','#228FCF','#364EB9'])
//rgb = f(obj)["_rgb"]
//hex = chroma(rgb).hex()
