app = './app'
src = './src'
tmp = './tmp'
release = './release'

dirJS = '/js'
dirCSS = '/css'

module.exports =
  app: app
  src: src

  browserSync:
    watch: [
      "#{app}/**/*.html"
      "#{app}/**/*.js"
      "#{app}/**/*.css"
    ]
    init:
      default:
        port: 8901
        server:
          baseDir: app
        open: false
        ghostMode: false
      open:
        port: 8901
        server:
          baseDir: app
        open: true
        ghostMode: false

  jsLib:
    name: 'lib.js'
    src: []
    dest: "#{app}#{dirJS}"

  watch:
    js:
      files: [
        {
          name: 'index.js'
          src: "#{src}#{dirJS}"
          dest:
            name: 'main.js'
            dir: "#{app}#{dirJS}"
        }
      ]
    css:
      files: [
        {
          src: "#{src}#{dirCSS}/**/*.scss"
          dest: "#{tmp}#{dirCSS}"
        }
      ]
      concat: [
        {
          name: 'main.css'
          src: "#{tmp}#{dirCSS}/**/*.css"
          dest: "#{app}#{dirCSS}"
        }
      ]

  release:
    src: "#{app}/**"
    base: app.replace(/\.\//, '')
    dest: release
