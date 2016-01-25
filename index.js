'use strict';

var path = require('path');
var defaultsDeep = require('lodash.defaultsdeep');
var plumber = require('gulp-plumber');
var chug = require('gulp-chug-pretty');

module.exports = function (gulp, gulpConfig) {

  gulpConfig = gulpConfig || { basePath: '.' };

  // Merge default config with gulp config.
  var defaultConfig = {
    backstopTest: {
      gitHook: false
    }
  };

  var config = defaultsDeep(gulpConfig, defaultConfig).backstopTest;
  var onError = function(err) {
    console.log(err);
  };

  gulp.task('bs-reference', function() {
    gulp.src('./node_modules/gulp-task-backstop-test/node_modules/backstopjs/gulpfile.js')
      .pipe(plumber({
        errorHandler: onError
      }))
      .pipe(chug({
        tasks:  ['reference'],
        args:   ['--backstopConfigFilePath=../../../../backstop.json']
      }));
  });

  gulp.task('bs-test', function() {
    gulp.src('./node_modules/gulp-task-backstop-test/node_modules/backstopjs/gulpfile.js')
      .pipe(plumber({
        errorHandler: onError
      }))
      .pipe(chug({
        tasks:  ['test'],
        args:   ['--backstopConfigFilePath=../../../../backstop.json']
      }));
  });

  gulp.task('pre-push', function() {
    if (config.gitHook === true) {
      gulp.start('bs-test');
    }
  })
};
