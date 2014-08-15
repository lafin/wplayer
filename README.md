# wPlayer
[![Dependency Status](https://david-dm.org/lafin/wplayer.svg)](https://david-dm.org/lafin/wplayer)
[![devDependency Status](https://david-dm.org/lafin/wplayer/dev-status.svg)](https://david-dm.org/lafin/wplayer#info=devDependencies)
___
Simple node.js audio player local files or audio stream.

![](https://raw.githubusercontent.com/lafin/wplayer/master/screen.png)

## Features
- play mp3
- play audio stream (radio)
- support m3u playlist
- control play, stop, next, prev
- scheduler cron style (use module [later](https://github.com/bunkat/later))
- show metadata (current track)
- ui support mobile browser (tested Iphone 4)

## Installation
```
$ npm install
$ ./node_modules/bower/bin/bower install
```

## Run
```
$ npm start
```

Open [http://localhost:3000](http://localhost:3000)

## Config
```js
$ vim config/config.js

// only for stream radio, recommendation set 0, if set 1 may have problems when playing
this.useMetaData = 0;

// if you want disable scheduler simple commenting this blog
// cron syntax with seconds (http://bunkat.github.io/later/parsers.html#cron)
this.schedule = {
	play: ['00 30 08 * * 1-5', '00 20 19 * * 1-5'],
	stop: ['00 30 09 * * 1-5', '00 45 02 * * *']
};
```

## Deploy example
### Rasberry Pi
For easy installation, use [pac](https://www.npmjs.org/package/pac)
### systemd
```
$ vim /etc/systemd/system/wplayer.service

[Service]
ExecStart=/usr/bin/node --expose-gc /home/user/wplayer/app.js
Restart=always
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=wplayer
User=user
Group=users
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target

$ systemctl enable wplayer
$ systemctl start wplayer
```
