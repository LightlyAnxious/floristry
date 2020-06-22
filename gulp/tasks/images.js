const gulp = require("gulp");
const imagemin = require("gulp-imagemin");
const pngquant = require("imagemin-pngquant");
const zopfli = require("imagemin-zopfli");
const mozjpeg = require("imagemin-mozjpeg");

module.exports = function imageMinify() {
  return gulp
    .src(["source/img/**/*.{png,jpg,svg}", "!source/img/**/_*/**/*"])
    .pipe(
      imagemin([
        pngquant({
          speed: 1,
          quality: [0.8, 0.9]
        }),
        zopfli({
          more: true
        }),
        imagemin.svgo({
          plugins: [
            {
              removeViewBox: false,
              cleanupIDs: false
            }
          ]
        }),
        imagemin.jpegtran({
          progressive: true
        }),
        mozjpeg({
          quality: 90
        })
      ])
    )

    .pipe(gulp.dest("build/img"));
};
