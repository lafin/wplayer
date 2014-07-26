var request = require('request'),
	lame = require('lame'),
	fs = require('fs'),
	Speaker = require('speaker'),
	playlist = require('./playlist'),
	config = require('../config/config'),
	Transform = require('stream').Transform;

var current = 0,
	speaker = null,
	self = this;

this.player = null;
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

function play(num) {
	var list = playlist.list();
	if (!list.length) {
		return false;
	}

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
			headers: headers
		});
		stream.on('error', function () {
			play(++current);
		});
		stream.on('response', function (data) {
			self.metaint = ~~data.headers['icy-metaint'];
		});
		if (config.useMetaData) {
			stream = stream.pipe(createParser());
		}
	} else {
		if (fs.existsSync(i)) {
			stream = fs.createReadStream(i);
		} else {
			return play(++current);
		}
	}
	list = undefined;

	self.player = stream.pipe(new lame.Decoder()).on('format', function (f) {
		speaker = new Speaker(f);
		speaker.on('close', function () {
			if (self.player) {
				return play(++current);
			}
		});
		this.pipe(speaker);
	}).on('id3v2', function (id3) {
		self.currentTrack = id3.artist + ' - ' + id3.title;
	});

	return self.player;
}

function switchTrack() {
	if (self.player) {
		self.player.unpipe();
		speaker.end();
	}
}

exports.play = function () {
	if (!self.player) {
		play();
	}
};

exports.stop = function () {
	if (this.player) {
		this.player.unpipe();
		this.player = null;
		speaker.end();
	}
};

exports.next = function () {
	switchTrack();
};

exports.prev = function () {
	++current;
	switchTrack();
};