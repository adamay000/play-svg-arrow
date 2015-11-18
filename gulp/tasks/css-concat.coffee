gulp = require 'gulp'
$ = require('gulp-load-plugins')()
config = require '../config'

gulp.task 'css-concat', ->
  config.watch.css.concat.forEach (concat) ->
    gulp.src concat.src
    .pipe $.concat concat.name
    .pipe $.if global.isRelease, $.csso()
    .pipe gulp.dest concat.dest
