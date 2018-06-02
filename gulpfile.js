const gulp = require('gulp');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const minifyjson = require('gulp-json-minify');
const del = require('del');
const mocha = require('gulp-mocha');

gulp.task('clean', () => (
    del(['lib'])
));

gulp.task('js-dev', () => (
    gulp.src('src/*.js')
        .pipe(babel())
        .pipe(gulp.dest('lib'))
));

gulp.task('js', () => (
    gulp.src('src/*.js')
        .pipe(babel())
        .pipe(uglify())
        .pipe(gulp.dest('lib'))
));

gulp.task('json', () => (
    gulp.src('src/holidays/*')
        .pipe(minifyjson())
        .pipe(gulp.dest('lib/holidays/'))
));

gulp.task('build-dev', gulp.series('clean', 'js-dev', 'json'));
gulp.task('build', gulp.series('clean', 'js', 'json'));


const test = (dir) => ['test/setup.js', 'test/' + dir + '/*.js'];
gulp.task('test-json', () => (
    gulp.src(test('json'))
        .pipe(mocha({ require: 'babel-register' }))
));

gulp.task('test-unit', () => (
    gulp.src(test('unit'))
        .pipe(mocha({ require: 'babel-register' }))
));

gulp.task('test-integration', () => (
    gulp.src(test('integration'))
        .pipe(mocha({ require: 'babel-register' }))
));

gulp.task('test', gulp.series('test-json', 'test-unit', 'test-integration'));
