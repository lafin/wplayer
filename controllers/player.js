var request = require('request'),
	lame = require('lame'),
	fs = require('fs'),
	Speaker = require('speaker'),
	playlist = require('./playlist'),
	config = require('../config/config'),
	Transform = require('stream').Transform;

var current = 0,
	stop = false,
	speaker = null,
	player = null,
	self = this;

this.currentTrack = '';

function parseStream(data) {
	var reg = /StreamTitle=\'(.*?)\'/i;
	data = reg.exec(data);
	return data ? data[1] : data;
}

function createParser() {
	var parser = new Transform();
	var count = 0;
	parser._transform = function (data, encoding, done) {
		var len = data.length;
		count += len;
		if (count >= self.metaint) {
			var offset = ((count - self.metaint) - len) * -1;
			var metaLen = ~~data[offset] * 16;

			var track = parseStream(data.slice(offset, offset + metaLen + 1).toString('utf8'));
			self.currentTrack = track ? track : self.currentTrack;

			this.push(data.slice(0, offset));
			this.push(data.slice(offset + metaLen + 1));

			if (track) {
				global.gc();
			}

			count = len - (offset + metaLen + 1);
			return done();
		}

		this.push(data);
		return done();
	};
	return parser;
}

function closeSpeaker(clear) {
	clear = clear === false ? false : true;
	if (speaker) {
		speaker.end();
		if (clear) {
			speaker = null;
		}
	}
}

function closePlayer(clear) {
	clear = clear === false ? false : true;
	if (player) {
		player.end();
		if (clear) {
			player = null;
		}
	}
}

function switchTrack() {
	clear();
}

function clear() {
	closePlayer();
	closeSpeaker();
}

function play(num) {
	self.currentTrack = '';
	var list = playlist.list();
	if (!list.length) {
		return false;
	}
	stop = false;
	current = num || 0;
	if (current < 0 || current >= list.length) {
		current = 0;
	}

	var i = list[current],
		stream = null;
	if (i.match(/^http[s]{0,1}:\/\//i)) {
		var headers = {
			'Icy-MetaData': config.useMetaData
		};
		stream = request({
			url: i,
			headers: headers,
			timeout: 2000
		});
		stream.on('error', function () {
			stream.end();
		});
		stream.on('response', function (data) {
			self.metaint = ~~data.headers['icy-metaint'];
		});
		if (config.useMetaData) {
			stream = stream.pipe(createParser());
		} else {
			var chunk = 0;
			stream.on('data', function () {
				chunk++;
				if (chunk === 20) {
					chunk = 0;
					global.gc();
				}
			});
		}
	} else {
		if (fs.existsSync(i)) {
			stream = fs.createReadStream(i);
		} else {
			return play(++current);
		}
	}
	list = null;
	player = stream.pipe(new lame.Decoder()).on('format', function (f) {
		speaker = new Speaker(f);
		speaker.on('flush', function () {
			clear();
		}).on('close', function () {
			if (!stop) {
				return play(++current);
			}
		});
		this.pipe(speaker);
	}).on('id3v2', function (id3) {
		self.currentTrack = id3.artist + ' - ' + id3.title;
	});
	player.on('error', function () {
		stream.end();
		return play(++current);
	});
	return player;
}

exports.play = function () {
	if (!player) {
		return play();
	}
};

exports.stop = function () {
	stop = true;
	switchTrack();
};

exports.next = function () {
	switchTrack();
};

exports.prev = function () {
	++current;
	switchTrack();
};