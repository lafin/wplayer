var player = require('./player'),
	config = require('../config/config'),
	CronJob = require('cron').CronJob,
	tasks = [];

exports.init = function () {
	var schedule = config.schedule;
	if (schedule) {
		var callback = function (action) {
			player[action]();
		};
		for (var action in schedule) {
			if (schedule.hasOwnProperty(action)) {
				for (var i = 0; i < schedule[action].length; i++) {
					var job = new CronJob(schedule[action][i], callback.bind(this, action));
					job.start();
					tasks.push(job);
				}
			}
		}
	}
};

exports.clear = function () {
	for (var i = 0; i < tasks.length; i++) {
		tasks[i].stop();
	}
};