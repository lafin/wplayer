var request = require('request'),
	lame = require('lame'),
	Speaker = require('speaker'),
	m3u = require('playlist-parser').M3U,
	fs = require('fs'),
	stream;

// list
exports.add = function (req, res) {};
exports.load = function (req, res) {
	console.log(res);
};
exports.clear = function (req, res) {};

// controll
exports.play = function (req, res) {
	var list = m3u.parse(fs.readFileSync(__dirname + '/../playlist.m3u', {
		encodeing: 'utf8'
	}).toString());

	var playlist = [];
	var countItem = list.length;
	while (countItem--) {
		playlist[countItem] = list[countItem].file;
	}

	var item = playlist[0];
	if (item.match(/^http[s]{0,1}:\/\//gi)) {
		stream = request(item);
	} else {
		stream = fs.createReadStream(item);
	}

	stream.pipe(new lame.Decoder()).pipe(new Speaker());
};
exports.stop = function (req, res) {};
exports.next = function (req, res) {};
exports.prev = function (req, res) {};

exports.index = function (req, res) {
	res.render('main');
};