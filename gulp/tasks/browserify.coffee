gulp = require 'gulp'
$ = require('gulp-load-plugins')()
browserify = require 'browserify'
watchify = require 'watchify'
source = require 'vinyl-source-stream'
buffer = require 'vinyl-buffer'
config = require '../config'

gulp.task 'browserify', ->
  config.watch.js.files.forEach (file) ->
    bundler = browserify
      entries: ["#{file.src}/#{file.name}"]
      fullPaths: false
      debug: true
      cache: {}
      packageCache: {}
    .transform('babelify', {presets: ['es2015']})

    if global.isWatching
      bundler = watchify bundler

    rebundle = ->
      startTime = new Date

      hour = ('0' + startTime.getHours()).slice(-2)
      minute = ('0' + startTime.getMinutes()).slice(-2)
      second = ('0' + startTime.getSeconds()).slice(-2)
      console.log("[#{hour}:#{minute}:#{second}] rebundle");

      bundler
      .bundle()
      .on('error', ->
        # via http://qiita.com/tanshio/items/b546b4b3eb2c648cb340
        $.notify.onError({
          message: '<%= error %>'
        }).apply @, Array.prototype.slice.call(arguments)
        @emit 'end'
      )
      .pipe source file.name
      .pipe buffer()
      .pipe $.if global.isRelease, $.uglify()
      .pipe $.rename file.dest.name
      .pipe gulp.dest file.dest.dir

    if global.isWatching
      bundler.on 'update', rebundle

    rebundle()
