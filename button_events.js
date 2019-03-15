var backForth = function(next,prev,date){

  //function for next button click
  next.addEventListener("click", function(){
    if (date < 360){
      date++;
      //map.removeLayer(markers);
      markers = makeMarkers(Data, date);
    }
  });

  //function for back button click
  prev.addEventListener("click", function(){
    if (date > 0){
      date--;
      //map.removeLayer(markers);
      markers = makeMarkers(Data, date);
    }
  });
};
