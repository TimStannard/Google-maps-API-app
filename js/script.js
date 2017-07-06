var map, mapOptions, originPlaced, destPlaced, placeRoute;
var travelMethod = "DRIVING";
var peopleChosen = 1;
var DaysChosen = 1;
var ValidDays = false;
var DaysWords = "oneDay";
var RadioNumberSelected = true;
var motorhomeSelected = false;
var DaysPattern = /^\d+$/;
var mixer = mixitup('#vehicles-container');
var VehicleArray = [
    {
      vehicleName: "Motorbike",
      CostPerDay: "109",
      FuelEconomy: "3.7"
    },
    {
      vehicleName: "Small car",
      CostPerDay: "129",
      FuelEconomy: "8.5"
    },
    {
      vehicleName: "Large car",
      CostPerDay: "144",
      FuelEconomy: "9.7"
    },
    {
      vehicleName: "Motor home",
      CostPerDay: "200",
      FuelEconomy: "17"
    }
  ];

function init(){
    mapOptions = {
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
  placeRoute = new AutocompleteDirectionsHandler(map);
  var destinationSaved;
}

//clear address inputs and hide errors if correct destination is there

$("#origin-input").focus(function(){
  $(this).val("");
  originPlaced = false;
});

$("#destination-input").focus(function(){
  $(this).val("");
  destPlaced = false;
});


//route plotting
 
function AutocompleteDirectionsHandler(map) {
  this.map = map;
  this.originPlaceId = null;
  this.destinationPlaceId = null;
  this.travelMode = 'DRIVING';
  var originInput = document.getElementById('origin-input');
  var destinationInput = document.getElementById('destination-input');
  this.directionsService = new google.maps.DirectionsService;
  this.directionsDisplay = new google.maps.DirectionsRenderer;
  this.directionsDisplay.setMap(map);

  var originAutocomplete = new google.maps.places.Autocomplete(
      originInput, {placeIdOnly: true, componentRestrictions: {country: "NZ"}
    });
  var destinationAutocomplete = new google.maps.places.Autocomplete(
      destinationInput, {placeIdOnly: true, componentRestrictions: {country: "NZ"}
    });
    destinationSaved = destinationAutocomplete;

  this.setupPlaceChangedListener(originAutocomplete, 'ORIG');
  this.setupPlaceChangedListener(destinationAutocomplete, 'DEST');
}

AutocompleteDirectionsHandler.prototype.setupPlaceChangedListener = function(autocomplete, mode) {
  var me = this;
  autocomplete.bindTo('bounds', this.map);
  autocomplete.addListener('place_changed', function() {
    var place = autocomplete.getPlace();
    if (!place.place_id) {
      window.alert("Please select an option from the dropdown list.");
      return;
    }
    if (mode === 'ORIG') {
      me.originPlaceId = place.place_id;
      originPlaced = true;
    } else {
      me.destinationPlaceId = place.place_id;
      destPlaced = true;
    }

    if(originPlaced && destPlaced) $("#error-dest").text("");


  });

};

AutocompleteDirectionsHandler.prototype.route = function() {
  if (!this.originPlaceId || !this.destinationPlaceId) {
    return;
  }
  var me = this;

  this.directionsService.route({
    origin: {'placeId': this.originPlaceId},
    destination: {'placeId': this.destinationPlaceId},
    travelMode: this.travelMode
  }, function(response, status) {
    if (status === 'OK') {
      me.directionsDisplay.setDirections(response);
    } else {
      window.alert('Directions request failed due to ' + status);
    }
  });
};


// normal code here

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

    $(this).css("top", ($(window).height()/2) - ($(this).height()/2) - 50 );
    $(this).css("left", ($(window).width()/2) - ($(this).width()/2) );

    });

  }).trigger("resize");

//unlock map function

 function unlockMap(){
  mapOptions = {
         
          disableDefaultUI: false, //turn off user interface
          scrollwheel: true,
          draggable: true,
          draggableCursor: "pointer",
          draggingCursor: "pointer",
          fullscreenControl: false,
          disableDoubleClickZoom: false,
          keyboardShortcuts: true
      };
      map.setOptions(mapOptions);
 };

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
      $("#error-vehicles").text("");
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
    peopleChosen = ($("[name=people-selector]:checked").val() + "Ppl");
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
        DaysWords = (toWords(DaysChosen) + "Day");
      }else if (ValidDays == false && RadioNumberSelected == true){
        DaysChosen = $("[name=days-selector]:checked").val();
        $('#modal-4-vehicle').css("display", "inline-block");
        $('#modal-3-days').css("display", "none");
        DaysWords = (toWords(DaysChosen) + "Day");
    }
    CreateVehicleMix();
  });

    $('#btn-back-vehicle').click(function() {
    $('#modal-4-vehicle').css("display", "none");
    $('#modal-3-days').css("display", "inline-block");
  });

  $('#btn-next-vehicle').click(function() {
    if ($(".v-selected").is(":visible")) {
      console.log("selected vehicle: " + $(".v-selected").attr('data-vehicle-type'));

      for (var i = 0; i < VehicleArray.length; i++) {
        if ($(".v-selected").attr('data-vehicle-type') == VehicleArray[i].vehicleName) {
            console.log(VehicleArray[i]);
          }
        }

      $('#modal-4-vehicle').css("display", "none"); 
      $('#modal-5-address').css("display", "inline-block"); 
    }else{
      $("#error-vehicles").text("\u2757 Please choose a vehicle.");
      
    }

  $('#btn-back-address').click(function() {
      $('#modal-4-vehicle').css("display", "inline-block");
      $('#modal-5-address').css("display", "none");
    });
  $('#btn-next-address').click(function() {
      if (originPlaced && destPlaced == true) {
      //create route here
      $('#modal-5-address').addClass('hide');
      $('#modal-5-address').css("opacity", "0");
      $('#modal-5-address').css("transform", "scale(0.75, 0.75)");
      setTimeout(function(){
        $('#modal-5-address').css("display", "none");
      }, 300);
      unlockMap(); 
      placeRoute.route();
      }else {
        $("#error-dest").text("\u2757 Both start and end addresses are required.");
      }

     });      
     
  });

  function CreateVehicleMix(){
    var FilterVariable = "." + DaysWords + "." + peopleChosen;
    mixer.filter(FilterVariable);
  }

});

//load map at end
  google.maps.event.addDomListener(window, 'load', init);