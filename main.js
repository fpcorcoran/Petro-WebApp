

var map = L.map('mapid', {
  center: [39.82, -98.58],
  zoom: 4.45
});

//basemapURL = "http://tile.stamen.com/watercolor/{z}/{x}/{y}.jpg";
basemapURL = "http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png";
//basemapURL = "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

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


var makeMarkers = (list, date) => {
  _.each(list, (obj) => {
    var cicle = L.circle([obj.Lat, obj.Lng],{
      color: 'blue',
      fillColor: '#30f',
      fillOpacity: 0.5,
      radius: obj["Precip"][date]*500
    }).bindPopup(obj.City + " - " + obj["Precip"][date].toString()).addTo(map);
  });
};



var next = document.getElementById("right-button");
var prev = document.getElementById("left-button");

var date = 0;

var Data = Organize(precip);
makeMarkers(Data, date);





baseMap = L.tileLayer(basemapURL, {
  //ext: 'jpg'
  ext: 'png'
}).addTo(map);
