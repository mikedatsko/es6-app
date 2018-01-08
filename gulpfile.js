const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const del = require('del');
const uglify = require('gulp-uglify');
const minify = require('gulp-minify');
const cleanCSS = require('gulp-clean-css');
const uglifycss = require('gulp-uglifycss');
const copy = require('gulp-copy');
const sequence = require('run-sequence');

const srcCSS = [
  './assets/css/reset.css',
  './vendors/bootstrap/css/bootstrap.css',
  './vendors/bootstrap/css/bootstrap-theme.min.css',
  './assets/css/style.css'
];
const srcJS = [
  './src/services/**/*.js',
  './src/app/**/*.js',
  './src/main.js'
];
const dist = './dist';

gulp.task('clean', () => {
  del(['./dist/**/*']).then(paths => {});
});

gulp.task('build:css:prod', function() {
  return gulp.src(srcCSS)
    .pipe(concat('app.css'))
    .pipe(uglifycss({
      'maxLineLen': 80,
      'uglyComments': true
    }))
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest(dist));
});

gulp.task('build:css:dev', function() {
  return gulp.src(srcCSS)
    .pipe(concat('app.css'))
    .pipe(gulp.dest(dist));
});

gulp.task('build:js:prod', () => {
  return gulp.src(srcJS)
    .pipe(concat('app.js'))
    .pipe(sourcemaps.init())
    .pipe(babel({
        presets: ['es2015']
    }))
    .pipe(uglify())
    .pipe(minify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(dist));
});

gulp.task('build:js:dev', () => {
  return gulp.src(srcJS)
    .pipe(concat('app.js'))
    .pipe(gulp.dest(dist));
});

gulp.task('fonts', () => {
  return gulp.src('./vendors/bootstrap/fonts/**/*')
    .pipe(gulp.dest(dist + '/fonts'))
});

gulp.task('build:prod', callback => {
  sequence('clean', 'build:js:prod', 'build:css:prod', 'fonts', callback);
});

gulp.task('build:dev', callback => {
  sequence('clean', 'build:js:dev', 'build:css:dev', 'fonts', callback);
});

gulp.task('watch', ['build:dev'], () => {
  gulp.watch('./src/**/*.js', ['build:dev']);
});