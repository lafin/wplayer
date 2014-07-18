var m3u = require('playlist-parser').M3U,
	fs = require('fs');

var playlistPath;

exports.playlistPath = playlistPath = __dirname + '/../playlist.m3u';

exports.getPlayList = function () {
	var list = m3u.parse(fs.readFileSync(playlistPath, {
		encodeing: 'utf8'
	}).toString());

	var playlist = [],
		i = list.length;
	while (i--) {
		playlist[i] = list[i].file;
	}
	return playlist;
};

exports.updatePlayList = function (path, success, error) {
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