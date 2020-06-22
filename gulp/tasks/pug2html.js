const gulp = require('gulp');
const plumber = require('gulp-plumber');
const pug = require('gulp-pug');
const pugLinter = require('gulp-pug-linter');
const htmlValidator = require('gulp-w3c-html-validator');
const bemValidator = require('gulp-html-bem-validator');

// * Функция для вывода логов ошибок

function onError(err) {
  console.log(err);
  this.emit('end');
}

module.exports = function pug2html() {
  return gulp
    .src('source/pug/page/*.+(jade|pug)')
    .pipe(plumber(onError))
    .pipe(pugLinter({ reporter: 'default' }))
    .pipe(
      pug({
        pretty: '\t'
      })
    )
    .pipe(htmlValidator())
    .pipe(bemValidator())
    .pipe(gulp.dest('source'));
};
