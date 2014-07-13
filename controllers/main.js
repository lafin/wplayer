var request = require('request'),
	lame = require('lame'),
	Speaker = require('speaker'),
	m3u = require('playlist-parser').M3U,
	fs = require('fs'),
	decoder = new lame.Decoder(),
	speaker = new Speaker(),
	player = null;

var playlistPath = __dirname + '/../playlist.m3u',
	currentItem = 0,
	play = function (num) {
		if (player) {
			player.end();
		}
		num = num || 0;
		var list = m3u.parse(fs.readFileSync(playlistPath, {
			encodeing: 'utf8'
		}).toString());

		var playlist = [],
			i = list.length,
			stream;
		while (i--) {
			playlist[i] = list[i].file;
		}

		num = num < 0 ? 0 : num;
		num = num >= playlist.length ? 0 : num;

		i = playlist[currentItem];
		if (i.match(/^http[s]{0,1}:\/\//gi)) {
			stream = request(i);
		} else {
			stream = fs.createReadStream(i);
		}
		return stream.pipe(decoder).pipe(speaker);
	},
	updatePlaylist = function (path, success, error) {
		fs.readFile(path, function (err, data) {
			if (err) {
				return error(err);
			}
			fs.writeFile(playlistPath, data, function (err) {
				if (err) {
					return error(err);
				}
				success();
			});
		});
	};

// list
exports.add = function (req, res) {};
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
			updatePlaylist(files[i].path, success, error);
		}
	}
};
exports.clear = function (req, res) {
	fs.writeFile(playlistPath, '', function (err) {
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
	player = play();
	res.send({
		status: 'success',
		err: []
	});
};
exports.stop = function (req, res) {
	res.send({
		status: 'success',
		err: []
	});
};
exports.next = function (req, res) {
	player = play(++currentItem);
	res.send({
		status: 'success',
		err: []
	});
};
exports.prev = function (req, res) {
	player = play(--currentItem);
	res.send({
		status: 'success',
		err: []
	});
};

exports.index = function (req, res) {
	res.render('main');
};