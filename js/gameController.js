function GameController(bmwClient) {
	// public controller fields
	// steering wheel [-100;100]
	this.steeringAngle = 0;
	// acceleration pedal [0 - 100]
	this.accelerationPedal = 0;

	var _this = this;
	var maxSteeringAngle = 365;
	var pollTime = 100;

	function pollData() {
		bmwClient.get(bmwClient.model('Vehicle'), {}, function(error, result) {
			if (error) {
				console.log('Error retrieving vehicle information');
				return;
			}

    	// just get the first car
			var carData = result.Data[0];
			var evtId = carData.LastTripEvent;

			// invalid event, no need to get Event data
			if (evtId === '00000000-0000-0000-0000-000000000000') return;
			
			bmwClient.get(bmwClient.model('Event'), {id: evtId}, function(error, result) {
				if (error) {
					console.log('Error retrieving event information');
					return;
				}

				// just trip status events contain the required information
				if (result.EventType !== 'TripStatus') return;

				// SteeringWheelAngle
				var angle = result.SteeringWheelAngle;
				if (angle !== undefined && angle !== null) {
					// normalize to [-100;100]
					var normalized = (angle / maxSteeringAngle) * 100;
					// clip at 100
					if (normalized > 100) normalized = 100;
					if (normalized < -100) normalized = -100;
					// flip sign to make positiv numbers indicate right steering
					normalized = -normalized;

					_this.steeringAngle = normalized;
				}

				// AcceleratorPedal
				var pedal = result.AcceleratorPedal;
				if (pedal !== undefined && pedal !== null) {
					_this.accelerationPedal = pedal;
				}

				console.log('steering wheel: %d, accelerator pedal: %d', _this.steeringAngle, _this.accelerationPedal);
			});
		});
	}

	setInterval(pollData, pollTime);
}