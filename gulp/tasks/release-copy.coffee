gulp = require 'gulp'
$ = require('gulp-load-plugins')()
rimraf = require 'rimraf'
runSequence = require 'run-sequence'
config = require '../config'

gulp.task 'release-copy-rimraf', (cb) ->
  rimraf(config.release.dest, cb)

gulp.task 'release-copy-copy', ->
  gulp.src config.release.src, {base: config.release.base}
  .pipe gulp.dest config.release.dest

gulp.task 'release-copy', ->
  runSequence 'release-copy-rimraf', 'release-copy-copy'
