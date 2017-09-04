const gulp = require('gulp');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const babel = require('gulp-babel');
const autoprefixer = require('gulp-autoprefixer');
const plumber = require('gulp-plumber');
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;

gulp.task('assets', () => {
  return gulp.src('./dev/assets/**/*')
    .pipe(gulp.dest('./public/assets/'))
    .pipe(reload({stream: true}));
});

// a task to compile our sass

gulp.task('styles', () => {
  return gulp.src('./dev/styles/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer('last 2 versions', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1'))
    .pipe(concat('style.css'))
    .pipe(gulp.dest('./public/styles/'))
    .pipe(reload({stream: true}));
});

// a task to compile our js
gulp.task('scripts', () => {
	return gulp.src('./dev/scripts/**/*.js')
    .pipe(plumber())
		.pipe(babel({
			presets: ['es2015']
		}))
		.pipe(gulp.dest('./public/scripts/'))
    .pipe(reload({stream: true}));
});

gulp.task('browser-sync', () => {
  browserSync.init({
    server: '.'  
  });
});


// a task to watch all of our other tasks
gulp.task('watch', function() {
  gulp.watch('./dev/scripts/**/*.js', ['scripts']);
  gulp.watch('./dev/styles/**/*.scss', ['styles']);
  gulp.watch('./dev/assets/**/*', ['assets']);
  gulp.watch('*.html', reload);
});

gulp.task('default', ['browser-sync', 'assets', 'styles', 'scripts', 'watch'])