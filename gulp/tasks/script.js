const gulp = require('gulp');
const path = require('path');
const plumber = require('gulp-plumber');
const webpack = require('webpack-stream');
const eslint = require('gulp-eslint');
const config = require('../../webpack.config.js');

module.exports = function script() {
  return gulp
    .src('source/js/main.js')
    .pipe(plumber())
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(webpack(config))
    .pipe(gulp.dest('build/js'));
};

console.log(path.resolve(__dirname, '*.html'));
