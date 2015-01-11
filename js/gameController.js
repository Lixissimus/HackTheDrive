function GameController(bmwClient) {
	// public controller fields
	// steering wheel [-100;100]
	this.steeringAngle = 0;
	// acceleration pedal [0 - 100]
	this.accelerationPedal = 0;

	var _this = this;
	function pollData() {
		bmwClient.get(bmwClient.model('Vehicle'), {}, function(error, result) {
    	// just get the first car
			var carData = result.Data[0];
			var evtId = carData.LastTripEvent;
			bmwClient.get(bmwClient.model('Event'), {id: evtId}, function(error, result) {
				debugger;
				var angle = result.SteeringWheelAngle;
				if (angle !== undefined && angle !== null) {
					_this.steeringAngle = angle;
				}

				var pedal = result.AcceleratorPedal;
				if (pedal !== undefined && pedal !== null) {
					_this.accelerationPedal = pedal;
				}
			});
		});
	}

	setInterval(pollData, 100);
}



//     $.each(result.Data, function(key, value) {
//       console.log(value.LastAcceleratorPedal);
//       if ((value.LastLocation != null) && (value.LastLocation.Lat != null) && (value.LastLocation.Lng != null)) {
//         lat[i] = value.LastLocation.Lat;
//         lng[i] = value.LastLocation.Lng;
//         return i++;
//       }
//     });
//     div = $("#result");
//     if (lat.length > 0) {
//       div.html('The vehicle is at: ' + lat[0] + ", " + lng[0]);
//       // return buildMap(lat[0], lng[0]);
//     } else {
//       return div.html("No vehicle detected!");
//     }
//   });
// 	}


// }


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