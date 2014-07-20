'use strict';

var gulp = require('gulp'),
    concat = require('gulp-concat'),
    less = require('gulp-less'),
    csso = require('gulp-csso'),
    nodemon = require('gulp-nodemon'),
    bower = require('main-bower-files'),
    filter = require('gulp-filter');

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

gulp.task('vendors', function () {
    return gulp.src(bower())
        .pipe(filter('**/*.{css,js}'))
        .pipe(gulp.dest('build/vendors'));
});

gulp.task('fonts', function () {
    return gulp.src(bower())
        .pipe(filter('**/*.{eot,svg,ttf,woff}'))
        .pipe(gulp.dest('build/fonts'));
});

// Rerun the task when a file changes
gulp.task('watch', function () {
    gulp.watch(['public/js/**/*.js', '*.js'], ['js']);
    gulp.watch(['public/less/**/*.less', '*.less'], ['less']);
});

gulp.task('server', function () {
    nodemon({
        script: 'app.js',
        nodeArgs: ['--expose-gc'],
        ext: 'jade js',
        ignore: ['public/**', 'build/**', 'node_modules/**', 'bower_components/**']
    });
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['vendors', 'fonts', 'js', 'less', 'watch', 'server']);