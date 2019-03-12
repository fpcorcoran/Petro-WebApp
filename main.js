

var map = L.map('mapid', {
  center: [39.82, -98.58],
  zoom: 4.45
});

//basemapURL = "http://tile.stamen.com/watercolor/{z}/{x}/{y}.jpg";
//basemapURL = "http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png";
basemapURL = "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";


baseMap = L.tileLayer(basemapURL, {
  //ext: 'jpg'
  ext: 'png'
}).addTo(map);
