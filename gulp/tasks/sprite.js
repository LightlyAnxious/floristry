const gulp = require('gulp');
const svgstore = require('gulp-svgstore');
const rename = require('gulp-rename');

module.exports = function sprite() {
    return gulp
        .src('source/img/**/{icon-*,logo-*}.svg')
        .pipe(svgstore({ inlineSvg: true }))
        .pipe(rename('sprite_auto.svg'))
        .pipe(gulp.dest('build/img/'));
};
