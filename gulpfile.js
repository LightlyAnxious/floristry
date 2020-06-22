const gulp = require('gulp');

const pug2html = require('./gulp/tasks/pug2html');
const styles = require('./gulp/tasks/styles');
const clean = require('./gulp/tasks/clean');
const fonts = require('./gulp/tasks/fonts');
const images = require('./gulp/tasks/images');
const webp = require('./gulp/tasks/webp');
const sprite = require('./gulp/tasks/sprite');
const script = require('./gulp/tasks/script');
const sync = require('./gulp/tasks/server');
const favicons = require('./gulp/tasks/favicons');
const lighthouse = require('./gulp/tasks/lighthouse');

module.exports.pug2html = gulp.series(pug2html);
module.exports.styles = gulp.series(styles);
module.exports.clean = gulp.series(clean);
module.exports.fonts = gulp.series(fonts);
module.exports.images = gulp.series(images);
module.exports.webp = gulp.series(webp);
module.exports.sprite = gulp.series(sprite);
module.exports.script = gulp.series(script);
module.exports.lighthouse = gulp.series(lighthouse);

const build = gulp.series(
  clean,
  pug2html,
  styles,
  script,
  fonts,
  images,
  webp,
  sprite,
  favicons
);

module.exports.start = gulp.series(script, sync);
module.exports.build = gulp.series(build);
