 

var gulp = require('gulp');
var targetLocation = './public_html/'
var appDependencies = require('./package.json').dependencies;
var SASS_FILES = [ './src/sass/*.scss','./src/sass/components/*.scss']; 
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var fs = require('fs');
var del = require('del');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
var concat = require('gulp-concat');

 
//https://browsersync.io/docs/gulp         

gulp.task('clean', function (  ) {

    del(['target','public_html/css/main.css']);

});



gulp.task('compile-sass', function() {
	return gulp.src('./src/sass/main.scss')
	  .pipe(sourcemaps.init())
	  .pipe(sass().on('error', sass.logError))
	  .pipe(sourcemaps.write())
		//.pipe(autoprefixer({
		//	browsers: ['last 2 versions', 'Explorer 9']
		//}))
		.pipe(sass())
		.pipe(concat('main.css'))
            // .pipe(uglifycss())
            .pipe(gulp.dest('./public_html/css/'))
		//.pipe(browserSync.reload({stream: true}))
           // .pipe(browserSync.stream());
});


gulp.task('serve', ['compile-sass'], function() {

    browserSync.init({
        server: "./public_html",
        port: 5600,
        ui: {port: 5601}
    });

    gulp.watch(SASS_FILES, ['compile-sass'] ) ;
    gulp.watch("public_html/css/main.css").on('change', browserSync.reload);
    gulp.watch("public_html/**/*.html").on('change', browserSync.reload);
    gulp.watch("public_html/js/**/*.js").on('change', browserSync.reload);
});

 

gulp.task('init-dev',[ 'compile-sass']);
gulp.task('dev', ['serve']);

/* end frontend task ---------------------------------------- */

