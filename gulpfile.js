var gulp = require('gulp')
	,imagemin = require('gulp-imagemin')
	,clean= require('gulp-clean')
	,concat = require('gulp-concat')
	,htmlReplace = require('gulp-html-replace')
	,uglify = require('gulp-uglify')
	,usemin = require('gulp-usemin')
	,cssmin = require('gulp-cssmin')
	,cssStripComment = require('gulp-strip-css-comments')
	,revAll = require('gulp-rev-all')
	,awspublish = require('gulp-awspublish')
	,cloudfront = require('gulp-cloudfront')
	,browserSync = require('browser-sync')
	,fs = require("fs")
	,stripComment = require('gulp-strip-comments');



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
gulp.task('strip-css',['usemin'],function(){
gulp.src('dist/**/*.css').pipe(cssStripComment())
		.pipe(gulp.dest('dist'))
});
gulp.task('strip-js',['usemin'],function(){
gulp.src('dist/**/*.js')
		.pipe(stripComment())
		.pipe(gulp.dest('dist'))
});
gulp.task('strip-html',['usemin'],function(){
gulp.src('dist/**/*.html')
		.pipe(stripComment())
		.pipe(gulp.dest('dist'))
});

gulp.task('usemin',function(){
	
	return gulp.src('dist/**/*.html')
		.pipe(usemin({
			'js' : [uglify],
			'css' :[cssmin]
		}))
		.pipe(gulp.dest('dist'))
		
})

gulp.task('deploy',['build-img'],function(){
	var headers = {'Cache-Control': 'max-age=315360000, no-transform, public'};
	var contents = fs.readFileSync("aws-credentials.json");
	var credentials = JSON.parse(contents);

	var aws = {
	    params: {
	      Bucket: credentials.bucket
	    },
	    region: credentials.region,
	    accessKeyId: credentials.accessKeyId,
  		secretAccessKey: credentials.secretAccessKey,
		signatureVersion: credentials.signatureVersion,
		distributionId: credentials.distributionId


	  };

	var publisher = awspublish.create(aws);
	var headers = {
    		'Cache-Control': 'max-age=315360000, no-transform, public'
  
  		};
  		gulp.src(['dist/**/*'])
  		.pipe(awspublish.gzip())
  		.pipe(publisher.publish(headers))
  		.pipe(publisher.cache())
  		.pipe(awspublish.reporter())
        .pipe(cloudfront(aws));

});
gulp.task('default',['copy'],function(){
	gulp.start('build-img','usemin','strip-html','strip-css','strip-js')
});

gulp.task('default-prod',['copy'],function(){
	gulp.start('build-img','usemin','strip-html','strip-css','strip-js','deploy')
});


