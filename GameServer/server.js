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
var database, usersCollection, chargepointsCollection;

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

openDatabaseConnection(startSocketServer);


function openDatabaseConnection(then) {
	var MongoClient = require('mongodb').MongoClient;

	// Connect to the db
	MongoClient.connect("mongodb://localhost:27017/PlayNowHighscores", function(err, db) {
		if (err) {
			console.log(err);
			return;
		}

		console.log('Connected to Database');
		database = db;

		database.collection('users', function(err, collection) {
			usersCollection = collection;
			console.log('Retrieved users collection');
			database.collection('chargepoints', function(err, collection) {
				chargepointsCollection = collection;
				console.log('Retrieved chargepoints collection');

				then();
			});
		});
	});
}


function startSocketServer() {
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

					requestHighscore(chargepoint, function(highscoreData) {
						var response = JSON.stringify({
							type: 'response-highscore',
							highscoreData: highscoreData
						});

						ws.send(response);
					});
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
}


// --- Highscore handline ---

function requestHighscore(chargepointName, callback) {
	chargepointsCollection.findOne({name: chargepointName}, function(err, chargepoint) {
		if (!chargepoint) {
			callback([]);
		} else {
			callback(chargepoint.highscore.slice(0, 5));
		}
	});
}

function postScore(username, score) {
	usersCollection.findOne({username: username}, function(err, user) {
		chargepointsCollection.findOne({name: user.chargepoint}, function(err, chargepoint) {
			var scoreRecord = {
				username: username,
				score: score
			}

			insertSorted(chargepoint.highscore, scoreRecord);

			chargepointsCollection.update({name: chargepoint.name}, {$set:{highscore: chargepoint.highscore}}, {w:1}, function(err, result) {
				if (err) {
					console.log(err);
					return;
				}

				console.log('updated highscore of %s', chargepoint.name);
			});
		});
	});
}

function insertSorted(array, record) {
	var standing = 0;
	while (array[standing] && array[standing].score > record.score) standing++;

	array.splice(standing, 0, record);
}

// --- Chargepoint handling ---

function registerChargepoint(chargepointName, callback) {
	chargepointsCollection.findOne({name: chargepointName}, function(err, item) {
		if (item) {
			// chargepoint already exists
			console.log('chargepoint %s already exists', chargepointName);
			return;
		}

		var newChargepoint = {
			name: chargepointName,
			highscore: []
		}

		chargepointsCollection.insert(newChargepoint, {w:1}, function(err, result) {
			if (err) {
				callback(err);
				return;
			}

			console.log('chargepoint %s inserted', chargepointName);
			callback(null, chargepointName);
		});
	});
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
	chargepointsCollection.findOne({name: chargepoint}, function(err, item) {
		if (!item) {
			registerChargepoint(chargepoint, function() {
				registerUser(username, chargepoint);
			});
			registerUser(username, chargepoint);
			return;
		}
	});

	usersCollection.findOne({username: username}, function(err, item) {
		if (item) {
			// user already exists, update chargepoint
			usersCollection.update({username: username}, {$set:{chargepoint: chargepoint}}, {w:1}, function(err, result) {
				if (err) {
					console.log(err);
					return;
				}

				console.log('%s updated to chargepoint %s', username, chargepoint);
			});
		} else {
			var newUser = {
				username: username,
				chargepoint: chargepoint
			}
			usersCollection.insert(newUser, {w:1}, function(err, result) {
				if (err) {
					console.log(err);
					return;
				}

				console.log('%s inserted with chargepoint %s', username, chargepoint);
			});
		}
	});
}