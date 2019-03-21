///Function for digesting Ports_geo.js data and creating workable JSON
var Organize = (list) => {
  var Data = [];
  _.each(list, (obj) => {
    var city = obj.City;
    var geo = JSON.parse(obj[".geo"]).coordinates;
    var precip = [];
    for (year = 198601; year < 201612; year++){
      if(obj[year.toString()] != null){
        precip.push(obj[year.toString()]);
      }
    }
    Data.push({"City":city,
               "Precip":precip,
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
