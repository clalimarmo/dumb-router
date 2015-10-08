var gulp = require('gulp');
var babel = require('gulp-babel');

gulp.task('build', function() {
  gulp.src(['src/**/*.js', '!src/**/*spec.js'])
    .pipe(babel())
    .pipe(gulp.dest('./build/'));
});
