var player = require('./player'),
	playlist = require('./playlist'),
	fs = require('fs');

// list
exports.add = function (req, res) {
	// TODO
};
exports.load = function (req, res) {
	var files = req.files,
		error = function (err) {
			res.send({
				status: 'error',
				err: [err]
			});
		},
		success = function () {
			return res.send({
				status: 'success',
				err: []
			});
		};
	for (var i in files) {
		if (files.hasOwnProperty(i)) {
			playlist.update(files[i].path, success, error);
		}
	}
};
exports.clear = function (req, res) {
	fs.writeFile(playlist.path, '', function (err) {
		if (err) {
			return res.send({
				status: 'error',
				err: [err]
			});
		}
		return res.send({
			status: 'success',
			err: []
		});
	});
};

// controll
exports.play = function (req, res) {
	player.player = player.play();
	res.send({
		status: 'success',
		err: []
	});
};
exports.stop = function (req, res) {
	player.stop(true);
	res.send({
		status: 'success',
		err: []
	});
};
exports.next = function (req, res) {
	player.next();
	res.send({
		status: 'success',
		err: []
	});
};
exports.prev = function (req, res) {
	player.prev();
	res.send({
		status: 'success',
		err: []
	});
};

// index
exports.index = function (req, res) {
	res.render('main');
};