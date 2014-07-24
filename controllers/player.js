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

exports.player = null;
exports.currentTrack = '';

exports.next = function () {
	this.stop();
};

exports.prev = function () {
	++current;
	this.stop();
};

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

exports.play = function (num) {
	var list = playlist.list();
	if (!list.length) {
		return false;
	}

	num = num || 0;
	num = num < 0 ? 0 : num;
	num = num >= list.length ? 0 : num;
	current = num;

	var i = list[num],
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
			self.play(++current);
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
			return this.play(++current);
		}
	}
	list = undefined;

	return stream.pipe(new lame.Decoder()).on('format', function (f) {
		speaker = new Speaker(f);
		speaker.on('close', function () {
			if (self.player) {
				return self.play(++current);
			}
		});
		this.pipe(speaker);
	}).on('id3v2', function (id3) {
		self.currentTrack = id3.artist + ' - ' + id3.title;
	});
};

exports.stop = function (silence) {
	if (this.player) {
		this.player.unpipe();
		if (silence) {
			this.player = null;
		}
		speaker.end();
	}
};