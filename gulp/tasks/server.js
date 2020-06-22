const gulp = require('gulp');

const images = require('./images');
const sprite = require('./sprite');
const styles = require('./styles');
const html = require('./html');
const script = require('./script');
const pug2html = require('./pug2html');
const server = require('browser-sync').create();

function refresh(cb) {
  server.reload();
  cb();
}

module.exports = function serve(cb) {
  server.init({
    server: 'build',
    notify: false,
    open: true,
    cors: true,
    middleware: [
      require('compression')(),
      {
        route: '/api', // per-route
        handle: function(req, res, next) {
          // handle any requests at /api
        }
      }
    ]
  });

  gulp.watch(
    'source/img/*.{gif,png,jpg,svg,webp}',
    gulp.series(images, refresh)
  );
  gulp.watch('source/img/**/*.svg', gulp.series(sprite, refresh));
  gulp.watch(
    'source/sass/**/*.scss',
    gulp.series(styles, cb =>
      gulp
        .src('build/css')
        .pipe(server.stream())
        .on('end', cb)
    )
  );
  gulp.watch('source/js/**/*.js', gulp.series(script, refresh));
  gulp.watch('source/pug/**/*.pug', gulp.series(pug2html, refresh));
  gulp.watch('source/*.html', gulp.series(html, refresh));

  return cb();
};
