function onAuthenticated(bmwClient) {
	// var gameController = new GameController(bmwClient);

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
	window.location.replace("/hxgl/index.html" + window.location.hash);
}