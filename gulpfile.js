var fs = require('fs');
var gulp = require('gulp');
var stylus = require('gulp-stylus');
var concat = require('gulp-concat');
var nodemon = require('gulp-nodemon');
var uglify = require('gulp-uglify');
var csso = require('gulp-csso');
var htmlmin = require('gulp-html-minifier');
var imagemin = require('gulp-imagemin');
var swig = require('gulp-swig');
var rename = require('gulp-rename');
var json = require('./app/json/data.json');

var stylesPath = 'app/assets/styles/*.{styl,css}';
var devStylesPath = 'app/assets/dev/*.styl';
var scriptsPath = 'app/assets/scripts/*.js';
var imagePath = 'app/assets/images/*';
var templatesPath = './views/*.html';

gulp.task('styles', function() {
    return gulp
        .src(stylesPath)
        .pipe(stylus({
            url: {
                name: 'url',
                limit: false
            },
            rawDefine: { data: json }
        }))
        .pipe(concat('bundle.css'))
        .pipe(csso())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('./public/styles'));
});

gulp.task('scripts', function() {
    return gulp
        .src(scriptsPath)
        .pipe(concat('bundle.js'))
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('./public/scripts'));
});

gulp.task('imageMin', function() {
    return gulp.src(imagePath)
        .pipe(imagemin())
        .pipe(gulp.dest('./public/img'))
});

gulp.task('devStyles', function() {
    return gulp
        .src(devStylesPath)
        .pipe(stylus())
        .pipe(csso())
        .pipe(gulp.dest('./public/styles'));
});

gulp.task('templates', ['styles', 'scripts'],  function() {
    return gulp.src(templatesPath)
        .pipe(swig({defaults: { cache: false }, data:json}))
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('./dist/'))
});

gulp.task('watch', function() {
    gulp.watch('app/assets/**/*.{styl,css}', ['styles']);
    gulp.watch(devStylesPath, ['devStyles']);
    gulp.watch(templatesPath, ['templates']);
    gulp.watch(scriptsPath, ['scripts']);
});

gulp.task('startServer', function() {
    nodemon({
        script: 'server.js',
        ext: 'html js'
    })
    .on('restart', function() {
        console.log('restarted!')
    })
});

gulp.task('build', ['imageMin', 'devStyles', 'styles', 'scripts', 'templates']);

gulp.task('default', ['build', 'startServer', 'watch']);
