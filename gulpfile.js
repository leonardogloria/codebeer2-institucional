var gulp = require('gulp'),
	imagemin = require('gulp-imagemin'),
	clean= require('gulp-clean'),
	concat = require('gulp-concat'),
	htmlReplace = require('gulp-html-replace'),
	uglify = require('gulp-uglify'),
	usemin = require('gulp-usemin'),
	cssmin = require('gulp-cssmin'),
	cssStripComment = require('gulp-strip-css-comments');



gulp.task('copy', ['clean'], function(){
	return gulp.src('src/**/*')
		.pipe(gulp.dest('dist'))
});

gulp.task('clean',function(){
	return gulp.src('dist')
		.pipe(clean())
});
gulp.task('build-img', function(){

gulp.src('dist/images/**/*')
	.pipe(imagemin())
	.pipe(gulp.dest('dist/images'))
	
});

gulp.task('build-js',function(){
	gulp.src(['dist/js/jquery.js','dist/js/bootstrap.min.js','dist/js/jquery.isotope.min.js',
		'dist/js/lightbox.min.js','dist/js/wow.min.js','dist/js/jquery.countTo.js','dist/js/main.js'])
	.pipe(concat('all.js'))
	.pipe(uglify())
	.pipe(gulp.dest('dist/js'))
});

gulp.task('build-html',function(){
	gulp.src('dist/**/*.html')
	.pipe(htmlReplace({
		js: 'js/all.js'
	}))
	.pipe(gulp.dest('dist'))
});
gulp.task('usemin',function(){
	
	gulp.src('dist/**/*.html')
		.pipe(usemin({
			'js' : [uglify],
			'css' :[cssmin]
		}))
		.pipe(gulp.dest('dist'))
		gulp.src('dist/css/*.css').pipe(cssStripComment()).pipe(gulp.dest('dist'))
})


gulp.task('default',['copy'],function(){
	gulp.start('build-img','usemin')
});