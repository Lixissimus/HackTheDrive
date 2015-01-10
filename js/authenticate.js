(function() {
  var App, BMWClient, buildMap, config, bmw_client;

  BMWClient = this.BMWClient;

  config = {
    application: '9a2bad4b-b159-40da-b880-d59ed4154b76',
    redirect_uri: 'http://localhost:8000/index.html',
    hostname: 'data.api.hackthedrive.com',
    version: 'v1',
    port: '443',
    scheme: 'https'
  };

  bmw_client = new BMWClient(config);

  App = bmw_client.model('App');

  $(function() {
    var div;
    bmw_client.token(function(error, result) {
      if (error) {
        console.log("redirecting to login.");
        return bmw_client.authorize(config.redirect_uri);
      } else {
        bmw_client.get(bmw_client.model("User"), {
          id: result.UserId
        }, function(error, result) {
          var message;
          message = 'Successfully authorizeed ';
          if (result.FirstName) {
            message += result.FirstName;
          } else if (result.UserName) {
            message += result.UserName;
          } else if (result.LastName) {
            message += result.LastName;
          } else if (result.Email) {
            message += result.Email;
          } else {
            message += "Unknown";
          }
          alert(message);
        });
      }
    });
    return $("#button").click(function() {
      return bmw_client.unauthorize(config.redirect_uri);
    });
  });
}).call(this);

//   getData = function () {
//     bmw_client.get(bmw_client.model("Vehicle"), {}, function(error, result) {
//       var i, lat, lng;
//       lat = [];
//       lng = [];
//       i = 0;
//       $.each(result.Data, function(key, value) {
//         console.log(value.LastAcceleratorPedal);
//         if ((value.LastLocation != null) && (value.LastLocation.Lat != null) && (value.LastLocation.Lng != null)) {
//           lat[i] = value.LastLocation.Lat;
//           lng[i] = value.LastLocation.Lng;
//           return i++;
//         }
//       });
//       div = $("#result");
//       if (lat.length > 0) {
//         div.html('The vehicle is at: ' + lat[0] + ", " + lng[0]);
//         // return buildMap(lat[0], lng[0]);
//       } else {
//         return div.html("No vehicle detected!");
//       }
//     });
//   }

//   setInterval(getData, 100);

//   buildMap = function(lat, lng) {
//     var map;
//     map = new GMaps({
//       el: '#map',
//       lat: lat,
//       lng: lng,
//       panControl: false,
//       streetViewControl: false,
//       mapTypeControl: false,
//       overviewMapControl: false
//     });
//     return setTimeout(function() {
//       return map.addMarker({
//         lat: lat,
//         lng: lng,
//         animation: google.maps.Animation.DROP,
//         draggable: false,
//         title: 'Current Location'
//       }, 1000);
//     });
//   };

// }).call(this);