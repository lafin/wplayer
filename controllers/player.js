var request = require('request'),
	lame = require('lame'),
	fs = require('fs'),
	Speaker = require('speaker'),
	playlist = require('./playlist');

var current = 0,
	speaker = null,
	player = null,
	self = this;

exports.player = player;

exports.next = function () {
	this.stop();
};

exports.prev = function () {
	++current;
	this.stop();
};

exports.play = function (num) {
	num = num || 0;
	var list = playlist.getPlayList();
	if (!list.length) {
		return false;
	}
	num = num < 0 ? 0 : num;
	num = num >= list.length ? 0 : num;
	current = num;

	var i = list[num],
		stream;
	if (i.match(/^http[s]{0,1}:\/\//i)) {
		stream = request(i);
	} else {
		stream = fs.createReadStream(i);
	}
	return stream.pipe(new lame.Decoder()).on('format', function (f) {
		speaker = new Speaker(f);
		speaker.on('close', function () {
			return self.play(++current);
		});
		this.pipe(speaker);
	}).on('id3v1', function (id3) {
		console.log(id3.artist, '-', id3.title);
	}).on('id3v2', function (id3) {
		console.log(id3.artist, '-', id3.title);
	});
};

exports.stop = function () {
	if (player) {
		player.unpipe();
		player = null;
		speaker.end();
	}
};