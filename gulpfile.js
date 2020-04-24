"use strict";

var gulp = require("gulp");
var plumber = require("gulp-plumber");
var sourcemap = require("gulp-sourcemaps");
var sass = require("gulp-sass");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var server = require("browser-sync").create();
var csso = require("gulp-csso");
var rename = require("gulp-rename");
var imagemin = require("gulp-imagemin");
var pngquant = require("imagemin-pngquant")
var zopfli = require("imagemin-zopfli")
var mozjpeg = require("imagemin-mozjpeg")
var webp = require("gulp-webp");
var svgstore = require("gulp-svgstore")
var posthtml = require("gulp-posthtml");
var include = require("posthtml-include");
var del = require("del");
var uglify = require("gulp-uglify");
var concat = require("gulp-concat");
var pug = require("gulp-pug");
var prettyHtml = require("gulp-pretty-html");

function onError(err) {
  console.log(err);
  this.emit('end');
}

gulp.task("views", function buildHTML() {
  return gulp
    .src("pug/page/*.+(jade|pug)")
    .pipe(plumber(onError))
    .pipe(
      pug({
        pretty: "\t",
      })
    )
    .pipe(
      prettyHtml({
        indent_size: 2,
        indent_char: " ",
        unformatted: ["code", "pre", "em", "strong", "span", "i", "b", "br"],
        end_with_newline: true,
      })
    )
    .pipe(gulp.dest("source"));
});

gulp.task("css", function() {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber(onError))
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([autoprefixer({
      grid: true
    })]))
    .pipe(csso())
    .pipe(rename("style.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"))
    .pipe(server.stream());
});

gulp.task('js', function() {
  return gulp.src(["source/js/vendor.js", "source/js/main.js"])
    // .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('build/js'));
});

gulp.task("jscopy", function () {
  return gulp.src("source/js/**/*.js").pipe(gulp.dest("build/js"));
});

gulp.task("server", function() {
  server.init({
    server: "build/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("source/sass/**/*.{scss,sass}", gulp.series("css", "refresh"));
  gulp.watch("pug/**/*.pug", gulp.series("views"));
  gulp.watch("source/img/icon-*.svg", gulp.series("sprite", "html", "refresh"));
  gulp.watch("source/*.html", gulp.series("html", "refresh"));
  gulp.watch("source/js/**/*.js", gulp.series("jscopy", "refresh"));
});

gulp.task("refresh", function(done) {
  server.reload();
  done();
});

gulp.task("images", function() {
  return gulp
    .src(["source/img/**/*.{png,jpg,svg}", "!source/img/**/_*/**/*"])
    .pipe(
      imagemin([
        imagemin.optipng({ optimizationLevel: 3 }),
        imagemin.jpegtran({ progressive: true }),
        imagemin.svgo({
          plugins: [
            {
              removeViewBox: false,
            },
          ],
        }),
      ])
    )

    .pipe(gulp.dest("build/img"));

});

gulp.task("webp", function() {
  return gulp.src([
      'source/img/**/*.{png,jpg}',
      '!source/img/**/_*/**/*'
    ])
    .pipe(webp({
      quality: 90
    }))
    .pipe(gulp.dest("build/img"));
});

gulp.task("sprite", function() {
  return gulp.src([
      'source/img/**/*.svg',
      '!source/img/**/_*/**/*'
    ])
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename("sprite_auto.svg"))
    .pipe(gulp.dest("build/img"));
});

gulp.task("html", function() {
  return gulp.src("source/*.html")
    .pipe(posthtml([
      include()
    ]))
    .pipe(gulp.dest("build"));
});

gulp.task("copy", function() {
  return gulp.src([
      "source/fonts/**/*.{woff,woff2}",
      // "source/img/**",
      "source/js/**",
      "source//*.ico"
    ], {
      base: "source"
    })
    .pipe(gulp.dest("build"));
});

gulp.task("clean", function() {
  return del("build");
});

gulp.task("build", gulp.series("clean", "sprite", "images", "webp", "views", "copy", "css", "html"));
gulp.task("start", gulp.series("views", "html", "css", "server"));
