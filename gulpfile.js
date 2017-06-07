var gulp = require('gulp'),
	imagemin = require('gulp-imagemin'),
	clean= require('gulp-clean'),
	concat = require('gulp-concat'),
	htmlReplace = require('gulp-html-replace'),
	uglify = require('gulp-uglify'),
	usemin = require('gulp-usemin'),
	cssmin = require('gulp-cssmin'),
	cssStripComment = require('gulp-strip-css-comments'),
	revAll = require('gulp-rev-all'),
	awspublish = require('gulp-awspublish'),
	cloudfront = require('gulp-cloudfront'),
	browserSync = require('browser-sync');




var headers = {'Cache-Control': 'max-age=315360000, no-transform, public'};
gulp.task('serve',function(){
	browserSync.init({
		server: {
			baseDir: 'src'
		}
	});
	gulp.watch('src/**/*').on('change',browserSync.reload);
})

gulp.task('copy', ['clean'], function(){
	return gulp.src('src/**/*')
		.pipe(gulp.dest('dist'))
});

gulp.task('clean',function(){
	return gulp.src('dist')
		.pipe(clean())
});
gulp.task('build-img', function(){

return gulp.src('dist/images/**/*')
	.pipe(imagemin())
	.pipe(gulp.dest('dist/images'))
	
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

gulp.task('publish',function(){

	 var publisher = awspublish.create({
	    params: {
	      Bucket: 'codebeer2.com.br'
	    },
	    region: 'sa-east-1',
	    accessKeyId: "xxx",
  		secretAccessKey: "xxx",
		signatureVersion: 'v3',
		 distributionId: "xxx"


	  });
	 var aws = {
	    params: {
	      Bucket: 'codebeer2.com.br'
	    },
	    region: 'sa-east-1',
	    accessKeyId: "xxx",
  		secretAccessKey: "xxx",
		signatureVersion: 'v3',
		 distributionId: "xxx"


	  };


	   var headers = {
    		'Cache-Control': 'max-age=315360000, no-transform, public'
  
  		};
  		gulp.src(['dist/**/*'])
  		.pipe(awspublish.gzip())
  		.pipe(publisher.publish(headers))
  		//.pipe(publisher.cache())
  		.pipe(awspublish.reporter())
        .pipe(cloudfront(aws));


	 /*gulp.src('dist/**')
        .pipe(revAll.revision())
        .pipe(awspublish.gzip())
        .pipe(publisher.publish(headers))
        .pipe(publisher.cache())
        .pipe(awspublish.reporter())
        .pipe(cloudfront(aws));

        */

});
gulp.task('default',['copy'],function(){
	gulp.start('build-img','usemin','publish')
});