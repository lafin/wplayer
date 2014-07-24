var player = require('./player'),
	config = require('../config/config');

var zero = function (num) {
	return num < 10 ? '0' + num : num;
};

var scheduleJob = function (time, action, callback) {
	return setInterval(function () {
		var date = new Date();
		if (time + ':00' === zero(date.getHours()) + ':' + zero(date.getMinutes()) + ':' + zero(date.getSeconds())) {
			callback(action);
		}
	}, 1000);
};

exports.init = function () {
	var schedule = config.schedule;
	for (var action in schedule) {
		if (schedule.hasOwnProperty(action)) {
			for (var i = 0; i < schedule[action].length; i++) {
				scheduleJob(schedule[action][i], action, function (action) {
					if (action === 'stop') {
						player[action](true);
					} else {
						player.player = player[action]();
					}
				});
			}
		}
	}
};