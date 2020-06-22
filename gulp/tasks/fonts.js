const gulp = require('gulp');

module.exports = function fonts() {
  return gulp.src('source/fonts/*').pipe(gulp.dest('build/fonts'));
};
