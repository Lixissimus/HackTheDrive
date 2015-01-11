var username;

var ZENDRIVE_MOCK_APP_KEY = "bqUu9FJxbii5AZFBnTVj0MQLzuqZSwjj";
var ZENDRIVE_APP_KEY = "k3vJh9Ft6cYGRW4jH8KtmngGfnaSQL7K";
var ZENDRIVE_DRIVER_MAP = {
	"lixissimus" : "Drogo(Dangerous)",
	"frable" : "Grant(Great)",
	"sfinterns" : "Jenna(Fair)"
}

function onAuthenticated(bmwClient, name) {
	username = name;
	localStorage.setItem("username", username);
	bmwClient.get(bmwClient.model('Vehicle'), {}, function(error, result) {
		if (error) {
			console.log('Error retrieving vehicle information');
			return;
		}

		// Zendrive SDK setup
		cordova.exec(function(res){console.log(res)}, function(err){console.error(err)}, "Zendrive", "setup", [ ZENDRIVE_APP_KEY, ZENDRIVE_DRIVER_MAP[name] ]);

		var Vehicles = bmwClient.getResults(bmwClient.model('Vehicle'), result);

    	// just get the first car
		var vehicle = Vehicles[0];
		var observer;


		$( "#content" ).html( '' + 
			'<div vertical layout style="min-width:450px">' +
  				'<div self-center><strong id="play">Play</strong><strong id="now">Now</strong></div>' +
  				'<div self-center><paper-spinner active class="blue"></paper-spinner></div>' +
  				'<div self-center><strong id="charger">Waiting for Charger</strong></div>' +
			'</div>');


		bmwClient.observe(vehicle, null, function(entity) {
			if (entity.ChargingStatus === 'Charging') {
				console.log('Detected charging');
				bmwClient.unobserve(observer, vehicle, null, null, function(error, result) {
					if (error) {
						console.log('Error while unobserving');
						return;
					}

					console.log('Successfully unobserved');
				});
				onChargingDetected();
			}
		}, function(error, result) {
			console.log('Observer registered');
			observer = result;
		});
	});
}

function onChargingDetected() {
	var socket = new WebSocket('ws://104.131.62.171:8001');

	socket.onopen = function() {
		console.log('Socket open');
		var message = JSON.stringify({
			type: 'register-user',
			username: username,
			chargepoint: '0000:017A'
		});
		console.log('Sending register-user for %s', username);
		socket.send(message);
		socket.close();

		
	};
	socket.onclose = function() {
		console.log('Socket closed');
		//window.location.replace("/hxgl/index.html" + window.location.hash);
		window.location.replace("/scores.html" + window.location.hash);
	};
	socket.onerror = function(err) { console.log('Error in register-user socket'); };
}