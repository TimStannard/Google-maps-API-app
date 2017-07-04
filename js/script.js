var map, marker, infobox, userLocation, clickmarker, directionService, directionDisplay, closestMarker, savedLocation;
var travelMethod = "DRIVING";

function init(){

    var mapOptions = {
        //set where the map starts
        center : {
            lat:-40.245063,
            lng: 168.824066
            // lat: -41.2950049,
            // lng: 174.7814311
        },

        zoom: 7, 
        disableDefaultUI: true, //turn off user interface
        scrollwheel: false,
        draggable: false,
        draggableCursor: "default",
        draggingCursor: "pointer",
        fullscreenControl: false,
        backgroundColor: "grey",
        disableDoubleClickZoom: true,
        ketboardShortcuts: false,
        mapTypeControlOptions: {
        position: google.maps.ControlPosition.TOP_CENTER
        },
        styles: [
    {
        "featureType": "water",
        "stylers": [
            {
                "saturation": 43
            },
            {
                "lightness": -11
            },
            {
                "hue": "#0088ff"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "hue": "#ff0000"
            },
            {
                "saturation": -100
            },
            {
                "lightness": 99
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#808080"
            },
            {
                "lightness": 54
            }
        ]
    },
    {
        "featureType": "landscape.man_made",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#ece2d9"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#ccdca1"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#767676"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "color": "#ffffff"
            }
        ]
    },
    {
        "featureType": "poi",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "landscape.natural",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "color": "#b8cb93"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "poi.sports_complex",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "poi.medical",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "poi.business",
        "stylers": [
            {
                "visibility": "simplified"
            }
        ]
    }
]
    }

// set google maps into div

  map = new google.maps.Map(document.getElementById("map"), mapOptions)

// adding markers
  google.maps.event.addListener(map, 'click', function(event) {
     // placeMarker(event.latLng);
  });

}

//function to place one marker at a time
  function placeMarker(location) {

if (yourlocation) {
      savedLocation = location;
    if (clickmarker){
      clickmarker.setMap(null);
    }

       clickmarker = new google.maps.Marker({
          position: location, 
          map: map
      });
      markers.push(clickmarker);
      showDirection(location);
    }else{
      popup();
    }
      
  }

  //plot route from marker

function showDirection(location){
  if (directionDisplay) {
    directionDisplay.setMap(null);
  }
  directionService = new google.maps.DirectionsService();
  directionDisplay = new google.maps.DirectionsRenderer();

  directionDisplay.setMap(map);
  directionService.route({
    origin: userLocation.position,
    destination: {location},
    travelMode: google.maps.TravelMode[travelMethod] 
    // transitOptions: 
  }, function(response, status){
    if(status =="OK"){
      directionDisplay.setDirections(response);
      // console.log(response);
      updateRouteText(response.routes[0].legs[0].distance.text, response.routes[0].legs[0].duration.text, response.routes[0].legs[0].start_address, response.routes[0].legs[0].end_address);
    }else if (status =="NOT_FOUND"){
alert("not found");
    }else if (status =="ZERO_RESULTS"){
      alert("Zero results found");

    }
  });
}

//updates text of route info

function updateRouteText(distance, duration, start, end){
  $("#route-text").html('<b>' + travelMethod + '</b><br>' + '<b>Your location: </b>' + start + '<br><b>Travelling to: </b>' + end + '<br><b>Distance: </b>'+ distance + '<br>'+ '<b>Duration: </b>' + duration)
}

//add markers

function addAllMarkers(){
  for (var i = 0; i < AllMarkers.length; i++) {
    marker = new google.maps.Marker({
      position:{
        lat: AllMarkers[i].lat,
        lng: AllMarkers[i].lng
      },
      map: map,
      // icon: "img/cinema-icon.png",
      title: AllMarkers[i].title,
      description: AllMarkers[i].description
    })
    
    markers.push(marker);
    Allinfobox(marker);

  };
}

//bounce animation

function toggleBounce(){
  if(marker.getAnimation() === null){
    marker.setAnimation(google.maps.Animation.BOUNCE);
  } else {
    marker.setAnimation(null);
  }
}

//load info boxes

function Allinfobox(marker){
  if(infobox){
    infobox.close();
  }
  infobox = new google.maps.InfoWindow();
  google.maps.event.addListener(marker, "click", function(){ 
    infobox.setContent("<div><strong>"+marker.title+"</strong></div><hr>"+
              "<div>"+marker.description+"</div>"
      );
    infobox.open(map, marker);
    placeMarker(marker.position);

  });
}

//toggle markers function show/hide

var toggleMarkerOn = true;
function toggleMarkers(){
  for (var i = 0; i < markers.length; i++) {
    if(toggleMarkerOn === true){
      markers[i].setMap(null);
    } else {
      markers[i].setMap(map);
    }
  };
  if(toggleMarkerOn === true){
    toggleMarkerOn = false;
  } else {
    toggleMarkerOn = true;
  }
}

//get user position

function findUser(){
  if(navigator.geolocation){

    navigator.geolocation.getCurrentPosition(function(position){
      userLocation = new google.maps.Marker({
        position: {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude
         },
        map: map,
        icon: "img/you-pin.png",
        animation: google.maps.Animation.DROP,
      });
      userLocation.setAnimation(google.maps.Animation.BOUNCE);
      map.panTo(userLocation.position);


      // FindClosestMarker();
      //run this if required
    })
  }
}

// function FindClosestMarker(){
//   var closestDistance = 99999999999999999999; //this function shows us the distance in a straight line 
//   for (var i = 0; i < markers.length; i++) {
//     var SingleMarker = markers[i];
//     var distance = google.maps.geometry.spherical.computeDistanceBetween(userLocation.position, SingleMarker.position); 

//     if (distance < closestDistance){
//       closestDistance = distance;
//       closestMarker = SingleMarker;
      
//     }
//   }
//   console.log(closestMarker);
// }

var yourlocation = false;

//toggle user location button

$("#find-location").click(function() {
      $("#myPopup").removeClass("show");
  if (!yourlocation) {
      $("#find-location").html('Turn off your location');
      yourlocation = !yourlocation;
      $(this).addClass("selected");
      findUser();
    }else{
      $("#find-location").html('Find your location');
      yourlocation = !yourlocation;
      userLocation.setMap(null);
      $(this).removeClass("selected");
    }


})

//route buttons

$(".button-route").click(function() {
 
  $(".button-route").removeClass("selected");
    $(this).addClass("selected");
    travelMethod = $(this).attr('data-mode');

    if(savedLocation) showDirection(savedLocation);
})

//toggling the markers button

$("#toggleMarkers").click(function() {
 if ($(this).hasClass( "selected" )){
    $(this).toggleClass("selected");
   $(this).html('Toggle markers on');
  }else{
    $(this).toggleClass("selected");
   $(this).html('Toggle markers off');
  }


})

// normal code here

var DaysChosen = 1;
var ValidDays = false;
var RadioNumberSelected = true;
var motorhomeSelected = false;
var DaysPattern = /^\d+$/;

$(document).ready(function() {

// fade in welcome modal
  setTimeout(function(){
    $('#modal-1-start').css("display", "inline-block");
  }, 800);
    setTimeout(function(){
    $('#modal-1-start').css("opacity", "1");
    $('#modal-1-start').css("transform", "scale(1, 1)");
  }, 900);

// align modals to center
  $(window).resize(function(){

    $(".modal.center").each(function(){

    $(this).css("top", ($(window).height()/2) - ($(this).height()/2) - 30 );
    $(this).css("left", ($(window).width()/2) - ($(this).width()/2) );

    });

  }).trigger("resize");

// validate amount of days

  $("#specify-days")
    .keyup(function(){
        if($(this).val().match(DaysPattern) && $(this).val() > 0 && $(this).val() < 16){
          $('#tick-days').css("display", "inline");
          $('#error-days').text("");
          $('input[name=days-selector]').attr('disabled', true);
          $('#days-form').css('color', 'lightgrey');
          ValidDays = true;
          RadioNumberSelected = false;
        }else if ($(this).val() == ""){
          $('#error-days').text("");
          $('#tick-days').css("display", "none");
          $('input[name=days-selector]').attr('disabled', false);
          $('#days-form').css('color', 'black');
          RadioNumberSelected = true;
          ValidDays = false;
        }else if ($(this).val() == 0){
          $('#error-days').text("\u2757 Number must be greater than 1.");
          $('#tick-days').css("display", "none");
          $('input[name=days-selector]').attr('disabled', true);
          $('#days-form').css('color', 'lightgrey');
          ValidDays = false;
          RadioNumberSelected = false;
        }else if ($(this).val() > 15) {
          $('#error-days').text("\u2757 Number must be less than 16.");
          $('#tick-days').css("display", "none");
          ValidDays = false;
        }else {
          $('#error-days').text("\u2757 Please enter a whole number only.");
          $('#tick-days').css("display", "none");
          $('input[name=days-selector]').attr('disabled', true);
          $('#days-form').css('color', 'lightgrey');
          ValidDays = false;
        }
      }).focus(function(){
        $('input[name=days-selector]').attr('disabled', true);
        $('#days-form').css('color', 'lightgrey');
        RadioNumberSelected = false;
      }).blur(function(){
        if (ValidDays == true) {
          $('input[name=days-selector]').attr('disabled', true);
          $('#days-form').css('color', 'lightgrey');
          RadioNumberSelected = false;
        }else if ($(this).val() == ""){
          $('#error-days').text("");
          $('#tick-days').css("display", "none");
          $('input[name=days-selector]').attr('disabled', false);
          $('#days-form').css('color', 'black');
          ValidDays = false;
          RadioNumberSelected = true;
        }
   });

  // selecting vehicle
  $(".vehicle-item")
    .click(function(){
      motorhomeSelected = false;
      $( "#motorhome-icon" ).css('opacity', '0.7');
      $(".vehicle-item").removeClass('v-selected');
      $(this).addClass('v-selected');
      $('.check-box').text('');
      $(this).find('.check-box').text('\u2714');
    });

  $( "#motorhome" ).mouseover(function() {
   $( "#motorhome-icon" ).css('opacity', '1');
  });
  $( "#motorhome" ).mouseout(function() {
    if (motorhomeSelected == false){
   $( "#motorhome-icon" ).css('opacity', '0.7');
 }
  });
  $( "#motorhome" ).click(function() {
    motorhomeSelected = true;
   $( "#motorhome-icon" ).css('opacity', '1');
  });

// button navigation

  $('#go').click(function() {
    $('#modal-1-start').css("display", "none");
    $('#modal-2-people').css("display", "inline-block");
    });

  $('#btn-back-people').click(function() {
    $('#modal-1-start').css("display", "inline-block");
    $('#modal-2-people').css("display", "none");
  });

    $('#btn-next-people').click(function() {
    $('#modal-2-people').css("display", "none");
    $('#modal-3-days').css("display", "inline-block");
  });

    $('#btn-back-days').click(function() {
    $('#modal-2-people').css("display", "inline-block");
    $('#modal-3-days').css("display", "none");
  });

    $('#btn-next-days').click(function() {
      if(ValidDays == true) {
        DaysChosen = $("#specify-days").val();
        $('#modal-4-vehicle').css("display", "inline-block");
        $('#modal-3-days').css("display", "none");
        console.log(DaysChosen);
      }else if (ValidDays == false && RadioNumberSelected == true){
        DaysChosen = $("[name=days-selector]:checked").val();
        $('#modal-4-vehicle').css("display", "inline-block");
        $('#modal-3-days').css("display", "none");
        console.log(DaysChosen);
    }
  });

    $('#btn-back-vehicle').click(function() {
    $('#modal-4-vehicle').css("display", "none");
    $('#modal-3-days').css("display", "inline-block");
  });

});

//popups
function popup() {
    var popup = document.getElementById("myPopup");
    popup.classList.toggle("show");
}
//load map at end
  google.maps.event.addDomListener(window, 'load', init);