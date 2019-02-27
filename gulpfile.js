'use strict';

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    cleanCSS = require('gulp-clean-css'),
    gcmq = require('gulp-group-css-media-queries'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    browserSync = require('browser-sync').create(),
    sourcemaps = require('gulp-sourcemaps'),
    clean = require('gulp-clean'),
    notify = require('gulp-notify'),
    minify = require('gulp-minify'),
    sourcePath = './src',
    buildPath = './app/content/themes/mytheme/build',
    browserSyncPath = 'http://gefestexpo-gulp/app/';

sass.compiler = require('node-sass');

// scss
gulp.task('scss', function () {
    return gulp
        .src(sourcePath + '/scss/style.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({ browsers: ['last 2 versions'] }))
        .pipe(gcmq())
        .pipe(gulp.dest(buildPath + '/css'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(cleanCSS({ level: 2 }))
        .pipe(browserSync.stream())
        .pipe(gulp.dest(buildPath + '/css'))
        .pipe(notify({ message: 'scss task complete' }));
});

gulp.task('scss:watch', function () {
    return gulp.watch(sourcePath + '/scss/**/*.scss', ['scss']);
});

// js
gulp.task('js', function() {
    return gulp
        .src(sourcePath + '/js/main.js')
        .pipe(gulp.dest((buildPath + '/js')))
        .pipe(minify({
            ext:{
                src:'.js',
                min:'.min.js'
            }
        }))
        .pipe(browserSync.stream())
        .pipe(gulp.dest((buildPath + '/js')))
        .pipe(notify({ message: 'js task complete' }));
});

// libs
gulp.task('libs', function() {
    return gulp
        .src(sourcePath + '/libs/**/*')
        .pipe(browserSync.stream())
        .pipe(gulp.dest((buildPath + '/libs')))
        .pipe(notify({ message: 'libs task complete' }));
});

// Php
gulp.task('php', function() {
    return gulp
        .src("./app/content/themes/mytheme/**/*.php")
        .pipe(browserSync.stream())
        .pipe(notify({ message: 'php task complete' }));
});

// watch
gulp.task('watch', ['browser-sync'], function() {
    gulp.watch(sourcePath + "/scss/**/*.scss", ['scss']);
    gulp.watch(sourcePath + "/js/**/*.js", ['js']);
    gulp.watch(sourcePath + "/libs/**/*", ['libs']);
    gulp.watch("./app/content/themes/mytheme/**/*.php", ['php']);
});

gulp.task('browser-sync', function() {
    browserSync.init({
        proxy: browserSyncPath
    });
});

// Clean
gulp.task('clean', function() {
  return gulp
    .src(buildPath, {read: false})
    .pipe(clean());
});
// Build task
gulp.task('build', ['clean'], function() {
  return gulp
    .run('scss', 'js', 'libs');
});
// Default task
gulp.task('default', ['clean', 'build', 'libs' ], function() {
    return gulp
        .run('watch');
});
