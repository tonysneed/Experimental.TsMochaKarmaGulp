var gulp = require('gulp');
var ts = require('gulp-typescript');

gulp.task('ts-compile', function(){
gulp.src(['src/**/*.ts'])
    .pipe(ts())
    .pipe(gulp.dest('build/'))
});

gulp.task('ts-watch', function () {
gulp.watch('src/**/*.ts', ['ts-compile']);
});
