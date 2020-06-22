const gulp = require('gulp');
const favicons = require('gulp-favicons');

module.exports = function renderFavicons() {
  return gulp
    .src('source/img/favicon/*.png')
    .pipe(
      favicons({
        appName: '',
        appShortName: '',
        appDescription: '',
        developerName: 'Даниил Приходько',
        developerURL: 'http://https://github.com/LightlyAnxious',
        background: '#020307',
        path: '',
        url: 'http://https://github.com/LightlyAnxious',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/?homescreen=1',
        version: 1.0,
        logging: false,
        html: 'index.html',
        pipeHTML: true,
        replace: true
      })
    )
    .pipe(gulp.dest('build/favicons'));
};
