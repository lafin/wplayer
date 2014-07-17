var request = require('request'),
	lame = require('lame'),
	Speaker = require('speaker'),
	m3u = require('playlist-parser').M3U,
	fs = require('fs'),
	speaker = null,
	player = null;

var playlistPath = __dirname + '/../playlist.m3u',
	currentItem = 0,
	next = function () {
		stop();
		return play(++currentItem);
	},
	prev = function () {
		stop();
		return play(--currentItem);
	},
	play = function (num) {
		if (player) {
			return stop();
		}
		num = num || 0;
		var list = m3u.parse(fs.readFileSync(playlistPath, {
			encodeing: 'utf8'
		}).toString());

		var playlist = [],
			i = list.length,
			stream = null;
		while (i--) {
			playlist[i] = list[i].file;
		}

		if (!playlist.length) {
			return false;
		}
		num = num < 0 ? 0 : num;
		num = num >= playlist.length ? 0 : num;
		currentItem = num;

		i = playlist[num];
		if (i.match(/^http[s]{0,1}:\/\//gi)) {
			stream = request(i);
		} else {
			stream = fs.createReadStream(i);
		}
		return stream.pipe(new lame.Decoder()).on('format', function (f) {
			speaker = new Speaker(f);
			speaker.on('close', function () {
				console.log('close');
			});
			this.pipe(speaker);
		}).on('id3v1', function (id3) {
			console.log(id3.artist, '-', id3.title);
		}).on('id3v2', function (id3) {
			console.log(id3.artist, '-', id3.title);
		});
	},
	stop = function () {
		if (player) {
			player.unpipe();
			player = null;
			speaker.end();
		}
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
	stop();
	res.send({
		status: 'success',
		err: []
	});
};
exports.next = function (req, res) {
	player = next();
	res.send({
		status: 'success',
		err: []
	});
};
exports.prev = function (req, res) {
	player = prev();
	res.send({
		status: 'success',
		err: []
	});
};

// index
exports.index = function (req, res) {
	res.render('main');
};