// only for stream radio, recommendation set 0, if set 1 may have problems when playing
this.useMetaData = 0;

// if you want disable scheduler simple commenting this blog
// cron syntax (http://www.nncron.ru/help/EN/working/cron-format.htm)
// exclude cron features (https://github.com/mattpat/node-schedule#unsupported-cron-features)
this.schedule = {
	play: ['30 08 * * 1-5', '20 19 * * 1-5'],
	stop: ['30 09 * * 1-5', '45 02 * * *']
};