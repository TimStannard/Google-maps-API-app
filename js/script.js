var map, marker, infobox, userLocation, clickmarker, directionService, directionDisplay, closestMarker, savedLocation;
var travelMethod = "DRIVING";
var markers = [];
var AllMarkers = [ //array of objects
  {
    lat: -41.292876,
    lng: 174.779813,
    title: "Reading Cinemas",
    // description: "<img src='img/readings.png' alt='reading'><br>Basic Cinema with the Gold Lounge. <br><i>You can get drunk in there.</i>"
    // icon: "icon1.png"
  },
  {
    lat: -41.294320,
    lng: 174.784058,
    title: "Embassy Theatre",
    description: "<img src='img/embassy.png' alt='embassy'><br>Probably Wellington's best cinema."
  },
  {
    lat: -41.296200,
    lng: 174.775225,
    title: "Lighthouse Cuba",
    // description: "<img src='img/lighthouse.png' alt='lighthouse'><br>Smaller cinema where you can buy beer, and has couches.<br><i>Much better than Reading Cinemas.</i>"
  },
    {
    lat: -41.305871,
    lng: 174.763611,
    title: "Penthouse Cuba",
    // description: "<img src='img/Penthouse.png' alt='penthouse'><br>Retro cinema!.<br><i>Definitely worth checking out.</i>"
  },
      {
    lat: -41.337049,
    lng: 174.772374,
    title: "Empire Cinema",
    // description: "<img src='img/empire.png' alt='empire'><br>Wonderful cinema!.<br><i>Definitely worth checking out.</i>"
  },
        {
    lat: -41.105987,
    lng: 174.916561,
    title: "Light House Pauatahanui",
    // description: "<img src='img/lighthouse2.png' alt='lighthouse pautahanui'><br>Small town cinema, apparently pretty good."
  },
          {
    lat: -41.315791,
    lng: 174.816127,
    title: "Roxy",
    description: "<img src='img/roxy.png' alt='roxy'><br>Great cinema ito check out if you're in the area."
  },
            {
    lat: -41.226066,
    lng: 174.879539,
    title: "Light House Petone",
    // description: "<img src='img/lighthouse3.png' alt='lighthouse petone'><br>Great cinema ito check out if you're in the area."
  },
              {
    lat: -41.136708,
    lng: 174.841283,
    title: "Reading Cinemas - North City",
    // description: "<img src='img/readings2.png' alt='Reading Cinemas - North City'><br>Never been here, probably pretty average."
  },
    {
    lat: -41.293982,
    lng: 174.782115,
    title: "Paramount Cinema",
    // description: "<img src='img/paramount.png' alt='paramount.png'><br>Overall, a bit crap.<br><i> Fun to watch late night screenings of the Room here though.</i>"
  }
];
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
  addAllMarkers();

// adding markers
  google.maps.event.addListener(map, 'click', function(event) {
     placeMarker(event.latLng);
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
      icon: "img/cinema-icon.png",
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

$(document).ready(function() {

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

});

//popups
function popup() {
    var popup = document.getElementById("myPopup");
    popup.classList.toggle("show");
}
//load map at end
  google.maps.event.addDomListener(window, 'load', init);