const gulp = require('gulp');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const babel = require('gulp-babel');
const autoprefixer = require('gulp-autoprefixer');

// a task to compile our sass

gulp.task('styles', () => {
  return gulp.src('./dev/styles/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer('last 2 versions', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1'))
    .pipe(concat('style.css'))
    .pipe(gulp.dest('./public/styles/'));
});

// a task to compile our js
gulp.task('scripts', () => {
	return gulp.src('./dev/scripts/**/*.js')
		.pipe(babel({
			presets: ['es2015']
		}))
<<<<<<< HEAD
		.pipe(gulp.dest('./public/scripts'));
=======
		.pipe(gulp.dest('./public/scripts/'));
>>>>>>> ccbbece79af11bc57ec204a09db8fb2daffa7612
});


// a task to watch all of our other tasks
gulp.task('watch', function() {
  gulp.watch('./dev/styles/**/*.scss', ['styles']);
  gulp.watch('./dev/scripts/main.js', ['scripts']);
});

gulp.task('default', ['styles', 'scripts', 'watch'])