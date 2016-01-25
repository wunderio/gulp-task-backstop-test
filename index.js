'use strict';

var path = require('path');
var defaultsDeep = require('lodash.defaultsdeep');
var plumber = require('gulp-plumber');
var chug = require('gulp-chug');

module.exports = function (gulp, gulpConfig) {

  gulpConfig = gulpConfig || { basePath: '.' };

  // Merge default config with gulp config.
  var defaultConfig = {
    backstopTest: {
      gitHook: true
    }
  };

  var config = defaultsDeep(gulpConfig, defaultConfig).backstopTest;
  var onError = function(err) {
    console.log(err);
  };

  gulp.task('bs-reference',
    'create reference files for backstop tests', function() {
    gulp.src('./node_modules/backstopjs/gulpfile.js')
      .pipe(plumber({
        errorHandler: onError
      }))
      .pipe(chug({
        tasks:  ['reference']
      }));
  });

  gulp.task('bs-test', 'run backstop test', function() {
    gulp.src('./node_modules/backstopjs/gulpfile.js')
      .pipe(plumber({
        errorHandler: onError
      }))
      .pipe(chug({
        tasks:  ['test']
      }));
  });

  gulp.task('pre-push', function() {
    if (config.gitHook === true) {
      gulp.start('bs-test');
    }
  })
};
