/*
The backForth function is used to control the arrow buttons and scroll the map back and forth through the months
*/
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

/*
The Playpause button is used to play the scrolling through the months as an animation and pause said animation by controlling
the play and pause buttons
*/

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
    markers = makeMarkers(Date, date);
    _.each(markers, (marker) => {
      marker.removeFrom(map);
    });
  });
};

/*
the SkipTo function is used to create options in the drop down menu allowing the user to skip to any given month.
*/


var SkipTo = function(dateButton,markers){
  //get the <select> tag for dates
  var dropdown = document.getElementById('skip-to-date');
  //loop through the dates for the first port (i.e. Portland, ME)
  _.each(Data[0].YearMonth, (d) => {
    var year = d.slice(0,4); //get the year (201601 -> 2016)
    var month = d.slice(4,6); // get the month (201601 -> 01)

    //create new <option> element
    var selectable = document.createElement("option");
    //combine month and year to more human readable format
    var month_year = document.createTextNode(month+"/"+year);
    //append the human readable date to the select tag
    selectable.appendChild(month_year);
    //append the <option> tag to the <select> tag
    dropdown.appendChild(selectable);
  });

  dateButton.addEventListener("click", function(){
    var newDate = document.getElementById("skip-to-date").value;
    var newDate = newDate.slice(3,7) + newDate.slice(0,2);
    var i = Data[0].YearMonth.indexOf(newDate);

    _.each(markers, (marker) => {
      marker.removeFrom(map);
    });

    markers = makeMarkers(Data, i);
  });
};
