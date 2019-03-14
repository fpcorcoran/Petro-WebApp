

var map = L.map('mapid', {
  center: [39.82, -98.58],
  zoom: 4.45
});

//basemapURL = "http://tile.stamen.com/watercolor/{z}/{x}/{y}.jpg";
//basemapURL = "http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png";
basemapURL = "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

///Function for digesting Ports_geo.js data and creating workable JSON
var Markers = (list) => {
  var LatLong = [];
  _.each(list, (obj) => {
    var city = obj.City;
    var geo = JSON.parse(obj[".geo"]).coordinates;
    LatLong.push({"City":city,
                  "Lat":geo[1],
                  "Lng":geo[0]});
  });
  return LatLong;
};


var makeMarkers = (list) => {
  _.each(list, (obj) => {
    var cicle = L.circle([obj.Lat, obj.Lng],{
      color: 'red',
      fillColor: '#f03',
      fillOpacity: 0.5,
      radius: 200
    }).bindPopup(obj.City).addTo(map);
  });
};


var latlong = Markers(Ports);
makeMarkers(latlong);

baseMap = L.tileLayer(basemapURL, {
  //ext: 'jpg'
  ext: 'png'
}).addTo(map);
