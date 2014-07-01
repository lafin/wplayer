'use strict';

var gulp = require('gulp'),
    concat = require('gulp-concat'),
    less = require('gulp-less'),
    csso = require('gulp-csso'),
    nodemon = require('gulp-nodemon'),
    bower = require('gulp-bower-files'),
    livereload = require('gulp-livereload');

gulp.task('js', function () {
    // Minify and copy all JavaScript
    return gulp.src(['public/js/**/*.js'])
        .pipe(concat('app.js'))
        .pipe(gulp.dest('build/js'));
});

gulp.task('less', function () {
    return gulp.src(['public/less/**/*.less'])
        .pipe(concat('style.css'))
        .pipe(less())
        .pipe(csso())
        .pipe(gulp.dest('build/css'));
});

gulp.task('bower', function () {
    bower().pipe(gulp.dest('build/libs'));
});

// Rerun the task when a file changes
gulp.task('watch', function () {
    livereload.listen();
    gulp.watch(['public/js/**/*.js', '*.js'], ['js']);
    gulp.watch(['public/less/**/*.less', '*.less'], ['less']);
    gulp.watch('build/css/*.css').on('change', livereload.changed);
});

gulp.task('server', function () {
    nodemon({
        script: 'app.js',
        ext: 'jade js',
        ignore: ['public/**', 'build/**', 'node_modules/**', 'bower_components/**']
    });
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['bower', 'js', 'less', 'watch', 'server']);