browserSync = require('browser-sync').create()
gulp = require 'gulp'
config = require '../config'

gulp.task 'browser-sync', ->
  if global.isWatching
    config.browserSync.watch.forEach (target) ->
      browserSync
      .watch target
      .on 'change', browserSync.reload

  if global.isOpen
    browserSync.init config.browserSync.init.open
  else
    browserSync.init config.browserSync.init.default
