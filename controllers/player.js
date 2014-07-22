var request = require('request'),
	lame = require('lame'),
	fs = require('fs'),
	Speaker = require('speaker'),
	playlist = require('./playlist');

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
	var reg = /StreamTitle=\'(.*?)\'/gi;
	data = reg.exec(data);
	return data ? data[1] : data;
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
			'Icy-MetaData': '0'
		};
		stream = request({
			url: i,
			headers: headers
		});
		var countChunk = 0;
		stream.on('data', function (data) {
			if(+headers['Icy-MetaData']) {
				var track = parseStream(data);
				self.currentTrack = track ? track : self.currentTrack;
			}
			// fix memmory leak after recive 300 chunk
			if (countChunk > 300) {
				global.gc();
				countChunk = 0;
			} else {
				countChunk += 1;
			}
		});
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