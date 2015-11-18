gulp = require 'gulp'
$ = require('gulp-load-plugins')()
config = require '../config'

gulp.task 'js-lib', ->
  gulp.src config.jsLib.src
  .pipe $.concat config.jsLib.name
  .pipe $.if global.isRelease, $.uglify {preserveComments: 'license'}
  .pipe gulp.dest config.jsLib.dest