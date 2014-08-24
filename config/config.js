// only for stream radio, recommendation set 0, if set 1 may have problems when playing
this.useMetaData = 0;

// if you want disable scheduler simple commenting this blog
// cron syntax with seconds (http://bunkat.github.io/later/parsers.html#cron)
this.schedule = {
    play: ['0 30 8 * * 1-5', '0 20 19 * * 1-5'],
    stop: ['0 30 9 * * 1-5', '0 45 2 * * *']
};