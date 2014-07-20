var request = require('request'),
	lame = require('lame'),
	fs = require('fs'),
	Speaker = require('speaker'),
	playlist = require('./playlist');

var current = 0,
	speaker = null,
	self = this;

exports.player = null;

exports.next = function () {
	this.stop();
};

exports.prev = function () {
	++current;
	this.stop();
};

exports.play = function (num) {
	var list = playlist.getPlayList();
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
		stream = request(i);
	} else {
		if (fs.existsSync(i)) {
			stream = fs.createReadStream(i);
		} else {
			return this.play(++current);
		}
	}
	list = null;

	var chunk = 0;
	stream.on('data', function () {
		chunk++;
		if (chunk >= 100) {
			global.gc();
			chunk = 0;
		}
	});

	return stream.pipe(new lame.Decoder()).on('format', function (f) {
		speaker = new Speaker(f);
		speaker.on('close', function () {
			if (self.player) {
				return self.play(++current);
			}
		});
		this.pipe(speaker);
	}).on('id3v1', function (id3) {
		console.log(id3.artist, '-', id3.title);
	}).on('id3v2', function (id3) {
		console.log(id3.artist, '-', id3.title);
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