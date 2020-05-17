"use strict";

var gulp = require("gulp");
var plumber = require("gulp-plumber");
var sourcemap = require("gulp-sourcemaps");
var sass = require("gulp-dart-sass");
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
var uglify = require("gulp-uglify-es").default;
var pug = require("gulp-pug");
var prettyHtml = require("gulp-pretty-html");
var touch = require("gulp-touch-fd");
var favicons = require("gulp-favicons");

function onError(err) {
  console.log(err);
  this.emit('end');
}

gulp.task("uglify", function () {
  return (
    gulp
      .src("source/js/*.js")
      .pipe(sourcemap.init())
      .pipe(uglify())
      .pipe(rename({ suffix: ".min" }))
      .pipe(sourcemap.write()) // Inline source maps.
      // For external source map file:
      //.pipe(sourcemaps.write("./maps")) // In this case: lib/maps/bundle.min.js.map
      .pipe(gulp.dest("build/js"))
  );
});

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
        unformatted: [],
        preserve_newlines: false,
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
    .pipe(touch())
    .pipe(server.stream());
});

gulp.task("server", function () {
  server.init({
    server: "build/",
    injectChanges: true,
    middleware: [
      require("compression")(),
      {
        route: "/api", // per-route
        handle: function (req, res, next) {
          // handle any requests at /api
        },
      },
    ],
    notify: false,
    open: true,
    cors: true,
    ui: false,
  });

  gulp.watch("source/sass/**/*.{scss,sass}", gulp.series("css", "refresh"));
  gulp.watch("pug/**/*.pug", gulp.series("views"));
  gulp.watch("source/img/icon-*.svg", gulp.series("sprite", "html", "refresh"));
  gulp.watch("source/*.html", gulp.series("html", "refresh"));
  gulp.watch("source/js/**/*.js", gulp.series("jscopy", "refresh"));
});

gulp.task("refresh", function (done) {
  server.reload();
  done();
});

gulp.task("jscopy", function () {
  return gulp.src("source/js/**/*.js").pipe(gulp.dest("build/js"));
});

gulp.task("images", function () {
  return gulp
    .src(["source/img/**/*.{png,jpg,svg}", "!source/img/**/_*/**/*"])
    .pipe(
      imagemin([
        pngquant({
          speed: 1,
          quality: [0.8, 0.9],
        }),
        zopfli({
          more: true,
        }),
        imagemin.svgo({
          plugins: [
            {
              removeViewBox: false,
            },
          ],
        }),
        imagemin.jpegtran({
          progressive: true,
        }),
        mozjpeg({
          quality: 90,
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

gulp.task("favicon", function () {
  return gulp.src("flower.png")
  .pipe(
    favicons({
      appName: "Весна Всегда",
      appShortName: "Весна Всегда",
      appDescription: "Весна Всегда, флористика с душой",
      developerName: "Даниил Приходько",
      developerURL: "http://https://github.com/LightlyAnxious",
      background: "#020307",
      path: "",
      url: "http://https://github.com/LightlyAnxious",
      display: "standalone",
      orientation: "portrait",
      scope: "/",
      start_url: "/?homescreen=1",
      version: 1.0,
      logging: false,
      html: "index.html",
      pipeHTML: true,
      replace: true
    })
  )
  .pipe(gulp.dest("source/favicons"));
});

gulp.task("copy", function() {
  return gulp
    .src(
      [
        "source/fonts/**/*.{woff,woff2}",
        // "source/img/**",
        "source/img/**/*.svg",
        "source/js/**",
        "source//*.ico",
      ],
      {
        base: "source",
      }
    )
    .pipe(gulp.dest("build"));
});

gulp.task("clean", function() {
  return del("build");
});

gulp.task("build", gulp.series("clean", "sprite", "images", "webp", "views", "uglify", "copy", "css", "html"));
gulp.task("start", gulp.series("css", "server"));
