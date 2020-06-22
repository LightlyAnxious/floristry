const gulp = require('gulp');
const posthtml = require('gulp-posthtml');
const include = require('posthtml-include');

module.exports = function html(cb) {
  return gulp
    .src('source/*.html')
    .pipe(posthtml([include()]))
    .pipe(gulp.dest('build'));
};
