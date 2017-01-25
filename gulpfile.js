const fs = require('fs');
const gulp = require('gulp');
const stylus = require('gulp-stylus');
const concat = require('gulp-concat');
const nodemon = require('gulp-nodemon');
const uglify = require('gulp-uglify');
const csso = require('gulp-csso');
const htmlmin = require('gulp-html-minifier');
const imagemin = require('gulp-imagemin');
const swig = require('gulp-swig');
const rename = require('gulp-rename');

const stylesPath = 'app/assets/styles/*.{styl,css}';
const devStylesPath = 'app/assets/dev/*.styl';
const scriptsPath = 'app/assets/scripts/*.js';
const imagePath = 'app/assets/images/*';
const templatesPath = './views/*.html';

const getJson = () => new Promise((resolve, reject) =>
    fs.readFile('app/json/data.json', 'utf8', (err, data) => err ? reject(err) : resolve(JSON.parse(data))));

gulp.task('styles', function() {
    return new Promise((resolve, reject) => {
        getJson().then(json => {
            gulp
                .src(stylesPath)
                .pipe(stylus({
                    url: {
                        name: 'url',
                        limit: false
                    },
                    rawDefine: { data: json }
                }))
                .pipe(csso())
                .pipe(rename({suffix: '.bundle.min'}))
                .pipe(gulp.dest('./public/styles'))
                .on('end', resolve)
                .on('error', reject);
        })
    });
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
    return new Promise((resolve, reject) => {
        getJson().then(json => {
            gulp
                .src(templatesPath)
                .pipe(swig({defaults: { cache: false }, data: json}))
                .pipe(htmlmin({collapseWhitespace: true}))
                .pipe(gulp.dest('./dist/'))
                .on('end', resolve)
                .on('error', reject);
        })
    });
});

gulp.task('watch', function () {
    gulp.watch([templatesPath, './views/slides/*.html', 'app/assets/**/*.{styl,css}', scriptsPath, 'app/json/data.json'], ['styles', 'templates']);
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
