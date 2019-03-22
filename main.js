
//Create map Object
var map = L.map('mapid', {
  center: [39.82, -98.58],
  zoom: 4.45
});


//basemapURL = "http://tile.stamen.com/watercolor/{z}/{x}/{y}.jpg";
basemapURL = "http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png";
//basemapURL = "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

//Create Basemap Tile Layer
baseMap = L.tileLayer(basemapURL, {
  //ext: 'jpg'
  ext: 'png'
}).addTo(map);

//get buttons from html
var next = document.getElementById("right-button");
var prev = document.getElementById("left-button");
var play = document.getElementById("play");
var pause = document.getElementById("pause");
var dateSkip = document.getElementById("date-submit");


//set date variable
var date = 0;

//register events to buttons
backForth(next,prev,date,markers);


//Organize Data from precipitation
var Data = Organize(precip);

//Make Markers
var markers = makeMarkers(Data, date);

PlayPause(play,pause,date,markers);

SkipTo(dateSkip, markers);
