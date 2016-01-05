var config = require('./gulp.config')();
var gulp = require('gulp');
var $ = require('gulp-load-plugins')({ lazy: true });
var del = require('del');

/**
 * List the available gulp tasks
 */
gulp.task('help', $.taskListing);
gulp.task('default', ['help']);

/**
 * Compile TypeScript
 */
gulp.task('ts-compile', function(){
    log('Compiling TypeScript')
    return gulp.src(config.ts)
        .pipe($.typescript())
        .pipe(gulp.dest(config.build));
});

/**
 * Watch and compile TypeScript
 */
gulp.task('ts-watch', function () {
    return gulp.watch(config.ts, ['ts-compile']);
});

/**
 * Remove all files from the build, temp, and reports folders
 * @param  {Function} done - callback when complete
 */
gulp.task('clean', function(done) {
    var delconfig = [].concat(config.build, config.temp, config.report);
    log('Cleaning: ' + $.util.colors.blue(delconfig));
    del(delconfig, done);
});

////////////////

/**
 * Log a message or series of messages using chalk's blue color.
 * Can pass in a string, object or array.
 */
function log(msg) {
    if (typeof(msg) === 'object') {
        for (var item in msg) {
            if (msg.hasOwnProperty(item)) {
                $.util.log($.util.colors.blue(msg[item]));
            }
        }
    } else {
        $.util.log($.util.colors.blue(msg));
    }
}

/**
 * Delete all files in a given path
 * @param  {Array}   path - array of paths to delete
 * @param  {Function} done - callback when complete
 */
function clean(path, done) {
    log('Cleaning: ' + $.util.colors.blue(path));
    del(path, done);
}