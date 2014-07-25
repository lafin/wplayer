var player = require('./player'),
	config = require('../config/config'),
	cron = require('node-schedule'),
	tasks = [];

exports.init = function () {
	var schedule = config.schedule;
	if (schedule) {
		var callback = function (action) {
			if (action === 'stop') {
				player[action](true);
			} else {
				player.player = player[action]();
			}
		};
		for (var action in schedule) {
			if (schedule.hasOwnProperty(action)) {
				for (var i = 0; i < schedule[action].length; i++) {
					var job = cron.scheduleJob(schedule[action][i], callback.bind(this, action));
					tasks.push(job);
				}
			}
		}
	}
};

exports.clear = function () {
	for (var i = 0; i < tasks.length; i++) {
		tasks[i].cancel();
	}
};