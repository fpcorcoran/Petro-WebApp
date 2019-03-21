var backForth = function(next,prev,date,markers){

  //function for next button click
  next.addEventListener("click", function(){
    if (date < 360){
      date++;
      _.each(markers, (marker) => {
        marker.removeFrom(map);
      });
      markers = makeMarkers(Data, date);
    }
  });

  //function for back button click
  prev.addEventListener("click", function(){
    if (date > 0){
      date--;
      _.each(markers, (marker) =>{
        marker.removeFrom(map);
      });
      markers = makeMarkers(Data, date);
    }
  });
};


var PlayPause = function(play,pause,date,markers){
  var interval;

  play.addEventListener("click", function(){
    interval = setInterval(function(){
    if(date < 360){
        date++;
        _.each(markers, (marker) => {
          marker.removeFrom(map);
        });
        markers = makeMarkers(Data, date);
      } else if(date == 360){
        date=0;
        marker = makeMarkers(Data, date);
      }
    },400);
  });



  pause.addEventListener("click", function(){
    clearInterval(interval);
    markers = makeMarkers(date);
    _.each(markers, (marker) => {
      marker.removeFrom(map);
    });
  });
};
