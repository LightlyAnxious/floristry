const gulp = require("gulp");
const webp = require("gulp-webp");

module.exports = function webponize() {
  return gulp
    .src(["source/img/**/*.{png,jpg}", "!source/img/**/_*/**/*"])
    .pipe(
      webp({
        quality: 90
      })
    )
    .pipe(gulp.dest("build/img"));
};
