var player = require('./player'),
	config = require('../config/config'),
	later = require('later'),
	tasks = [],
	hub = require('../libs/hub'),
	logger = hub.logger;

later.date.localTime();

exports.init = function () {
	var schedule = config.schedule;
	if (schedule) {
		var callback = function (action, sched) {
			logger.info('schedule: getCurrentStatus "' + player.getCurrentStatus() + '" action "' + action + '" sched "' + sched + '"');
			if (player.getCurrentStatus() !== action) {
				player[action]();
			}
			return false;
		};
		for (var action in schedule) {
			if (schedule.hasOwnProperty(action)) {
				for (var i = 0; i < schedule[action].length; i++) {
					logger.info('add schedule: ' + schedule[action][i] + ' ' + action);
					var sched = later.parse.cron(schedule[action][i], true),
						job = later.setInterval(callback.bind(this, action, schedule[action][i]), sched);
					tasks.push(job);
				}
			}
		}
	}
};

exports.clear = function () {
	for (var i = 0; i < tasks.length; i++) {
		tasks[i].clear();
	}
};