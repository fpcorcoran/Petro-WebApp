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

//Function for making circular markers with radius relative to precipitation
var makeMarkers = (list, date) => {
  var mapped = _.map(list, (obj) => {
    var circle = L.circle([obj.Lat, obj.Lng],{
      color: 'blue',
      fillColor: '#30f',
      fillOpacity: 0.5,
      radius: obj["Precip"][date]*500
    }).bindPopup(obj.City + " - " + obj["Precip"][date].toString()).addTo(map);
    return circle;
  });
  return mapped;
};
