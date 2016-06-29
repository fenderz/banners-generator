var gulp = require('gulp');
var stylus = require('gulp-stylus');
var concat = require('gulp-concat');
var nodemon = require('gulp-nodemon');
var uglify = require('gulp-uglify');
var cssmin = require('gulp-cssmin');
var cssnano = require('gulp-cssnano');
var rename = require('gulp-rename');
var fs = require('fs');

var stylesPath = 'app/assets/styles/*.{styl,css}';
var scriptsPath = 'app/assets/scripts/*.js';
var json = JSON.parse(fs.readFileSync('./app/json/data.json'));

gulp.task('styles', function () {
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
        .pipe(cssmin())
        //.pipe(cssnano())
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

gulp.task('watch', function () {
    gulp.watch('app/assets/**/*.{styl,css}', ['styles']);
    gulp.watch(scriptsPath, ['scripts']);
});

gulp.task('startServer', function () {
    nodemon({
        script: 'server.js',
        ext: 'html js'
    })
    .on('restart', function () {
        console.log('restarted!')
    })
});

gulp.task('default', ['styles', 'scripts', 'startServer', 'watch']);
