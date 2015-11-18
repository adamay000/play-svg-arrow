gulp = require 'gulp'
$ = require 'gulp-load-plugins'
runSequence = require 'run-sequence'

gulp.task 'dev', ->
  global.isWatching = true
  global.isRelease = false
  global.isOpen = false
  runSequence 'js-lib', 'sass', 'browserify', 'browser-sync'

gulp.task 'release', ->
  global.isWatching = false
  global.isRelease = true
  global.isOpen = false
  runSequence 'js-lib', 'sass', 'browserify', 'release-copy'

gulp.task 'default', ->
  gulp.start 'dev'
