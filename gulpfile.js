var gulp = require('gulp'),
	imagemin = require('image-min');

gulp.task('build-img', function(){

gulp.src('src/images/**/*')
	.pipe(imagemin())
	.pipe(gulp.dest('src/images'))
	
})

