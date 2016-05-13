var gulp = require('gulp');
var usemin = require('gulp-usemin');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-clean-css');
var clean = require('gulp-clean');

var paths = {
    dist: './dist/'
}

gulp.task('default', ['clean'], function() {
   gulp.src('index.html')
        .pipe(usemin({
            assetsDir: '',
            cssLibs: [ 'concat' ],
            css: [ minifyCss(), 'concat' ],
            jsLibs: [ 'concat' ],
            jsApp: [ uglify({ mangle: false }), 'concat']
        }))
        .pipe(gulp.dest(paths.dist));
   gulp.src(['bower_components/bootstrap/dist/fonts/**/*']).pipe(gulp.dest('css/fonts'));
   gulp.src(['bower_components/bootstrap/dist/fonts/**/*']).pipe(gulp.dest('fonts'));
   gulp.src(['bower_components/bootstrap/dist/fonts/**/*']).pipe(gulp.dest(paths.dist + 'css/fonts'));
   gulp.src(['bower_components/bootstrap/dist/fonts/**/*']).pipe(gulp.dest(paths.dist + 'fonts'));
   gulp.src(['tpl/**/*']).pipe(gulp.dest(paths.dist + 'tpl'));
   gulp.src(['img/**/*']).pipe(gulp.dest(paths.dist + 'img'));
});


gulp.task('clean', function() {
  return gulp.src(paths.dist + "*.*", {
      read: false
    }).pipe(clean());
});
