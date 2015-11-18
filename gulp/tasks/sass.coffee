gulp = require 'gulp'
$ = require('gulp-load-plugins')()
config = require '../config'

gulp.task 'sass', ->
  config.watch.css.files.forEach (css) ->
    rebundle = ->
      gulp.src css.src
      .pipe $.plumber(
        errorHandler: $.notify.onError('<%= error.message %>')
      )
      .pipe $.sass()
      .pipe $.autoprefixer(css.autoprefixer)
      .pipe $.if not global.isRelease, $.sourcemaps.write '.'
      .pipe gulp.dest css.dest
      .on 'end', ->
         gulp.start 'css-concat'

    if global.isWatching
      gulp.watch css.src, rebundle

    rebundle()
