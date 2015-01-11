var username;

function onAuthenticated(bmwClient, name) {
	username = name;
	bmwClient.get(bmwClient.model('Vehicle'), {}, function(error, result) {
		if (error) {
			console.log('Error retrieving vehicle information');
			return;
		}

		var Vehicles = bmwClient.getResults(bmwClient.model('Vehicle'), result);

    	// just get the first car
		var vehicle = Vehicles[0];
		var observer;

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
		window.location.replace("/hxgl/index.html" + window.location.hash);
	};
	socket.onerror = function(err) { console.log('Error in register-user socket'); };
}