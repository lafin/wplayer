var m3u = require('playlist-parser').M3U,
	fs = require('fs'),
	self = this;

exports.path = __dirname + '/../playlist.m3u';

exports.list = function () {
	if (!fs.existsSync(this.path)) {
		fs.writeFileSync(this.path, '');
	}
	var list = m3u.parse(fs.readFileSync(this.path, {
		encodeing: 'utf8'
	}).toString());

	var playlist = [];
	for (var i = 0; i < list.length; i++) {
		playlist[i] = list[i].file;
	}
	return playlist;
};

exports.update = function (path, success, error) {
	fs.readFile(path, function (err, data) {
		if (err) {
			return error(err);
		}
		fs.writeFile(self.path, data, function (err) {
			if (err) {
				return error(err);
			}
			success();
		});
	});
};