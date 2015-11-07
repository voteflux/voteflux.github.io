var gulp = require("gulp");
var browserSync = require("browser-sync");

gulp.task('browser-sync', function(){
	browserSync.init(null, {
		server: {
  		baseDir: '.'
  	},
		port: 9000,
		notify: false
	})
})

gulp.task('html',function(){
	return browserSync.reload();
});

gulp.task('css',function(){
	return browserSync.reload({stream:true});
});

gulp.task('js',function(){
	return browserSync.reload();
});

gulp.task("default", ['browser-sync'], function(){
	gulp.watch("**/*.html", ['html']);
	gulp.watch("**/*.css", ['css']);
	gulp.watch("**/*.js", ['js']);
});
