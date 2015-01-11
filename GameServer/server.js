Array.prototype.find = function (iterator, context) {
  for (var value, i = 0, len = this.length; i < len; i++) {
      value = this[i];
      if (iterator.call(context, value, i)) return value;
  }
  return undefined;
}

var port = 8001;

var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({port: port});

console.log('Server runnung on port %d...', port);

var users = [];
// user = {
// 	username: string,
// 	chargepoint: string (name of current chargepoint);
// }

var chargepoints = [];
// chargepoint = {
// 	name: string,
// 	highscore: array of { username: ..., score:... }
// }

// create some dummy data
initHighscoreData();

wss.on('connection', function(ws) {	
	ws.on('close', function() {
		console.log('Socket closed');
	});
 
	ws.on('error', function(err) {
		console.log('Socket error - %s', err);
	});

	ws.on('message', function(message) {
		message = JSON.parse(message);
		if (!message.type) {
			var response = JSON.stringify({
				type: 'error',
				message: 'No type field set in message'
			});
			ws.send(response);
		}

		switch (message.type) {
			case 'register-user':
				var username = message.username;
				var chargepoint = message.chargepoint;

				registerUser(username, chargepoint);
				break;
			case 'post-score':
				var username = message.username;
				var score = message.score;

				postScore(username, score);
				break;
			case 'request-highscore':
				var chargepoint = message.chargepoint

				var highscoreData = requestHighscore(chargepoint);

				var response = JSON.stringify({
					type: 'response-highscore',
					highscoreData: highscoreData
				});

				ws.send(response);
				break;
			default:
				var response = JSON.stringify({
					type: 'error',
					message: 'Unknown message type'
				});
				ws.send(response);
		}
	});
});


// --- Highscore handline ---

function requestHighscore(chargepointName) {
	var chargepoint = getChargepointByName(chargepointName);

	if (!chargepoint) return [];

	return chargepoint.highscore;
}

function postScore(username, score) {
	var user = getUserByName(username);
	var chargepoint = getChargepointByName(user.chargepoint);

	var scoreRecord = {
		username: username,
		score: score
	}

	insertSorted(chargepoint.highscore, scoreRecord);
}

function insertSorted(array, record) {
	var standing = 0;
	while (array[standing] && array[standing].score > record.score) standing++;

	array.splice(standing, 0, record);
}

// --- Chargepoint handling ---

function registerChargepoint(chargepointName) {
	// chargepoint is already registered
	if (getChargepointByName(chargepointName)) {
		console.log('Chargepoint %s already registered', chargepointName);
		return;
	}

	var newChargepoint = {
		name: chargepointName,
		highscore: []
	}

	chargepoints.push(newChargepoint);

	console.log('Registered new chargepoint %s', chargepointName);

	return newChargepoint;
}

function getChargepointByName(chargepointName) {
	var chargepoint = chargepoints.find(function(chargepoint) {
		return chargepoint.name === chargepointName;
	});

	return chargepoint;
}


// --- User handling ---

function getUserByName(username) {
	var user = users.find(function(user) {
		return user.username === username;
	});

	return user;
}

function registerUser(username, chargepoint) {
	if (!getChargepointByName(chargepoint)) {
		registerChargepoint(chargepoint);
	}

	// user is already registered
	var user = getUserByName(username);
	if (user) {
		console.log('Setting current chargepoint of %s to %s', username, chargepoint);
		user.chargepoint = chargepoint;
		return;
	}

	var newUser = {
		username: username,
		chargepoint: chargepoint
	}

	users.push(newUser);

	console.log('Registered %s at chargepoint %s', username, chargepoint);
}


// --- create dummy data ---

function initHighscoreData() {
	var chargepoint = registerChargepoint('0000:017A');
	chargepoint.highscore = [{
		username: 'Morton',
		score: 9005
	}, {
		username: 'Bowser',
		score: 7365
	}];
}