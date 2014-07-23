# wPlayer
[![Dependency Status](https://david-dm.org/lafin/wplayer.svg)](https://david-dm.org/lafin/wplayer)
[![devDependency Status](https://david-dm.org/lafin/wplayer/dev-status.svg)](https://david-dm.org/lafin/wplayer#info=devDependencies)
___
Simple web audio player local files or audio stream.

![](https://raw.githubusercontent.com/lafin/wplayer/master/screen.png)

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

## Deploy example
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
