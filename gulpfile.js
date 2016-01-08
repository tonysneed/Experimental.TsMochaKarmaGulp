var config = require('./gulp.config')();
var del = require('del');
var merge = require('merge2');
var stream = require('event-stream');
var gulp = require('gulp');
var $ = require('gulp-load-plugins')({ lazy: true });

/**
 * List the available gulp tasks
 */
gulp.task('help', $.taskListing);
gulp.task('default', ['help']);

/**
 * Compile TypeScript
 */
gulp.task('ts-compile', ['ts-clean'], function() {
    
    log('Compiling TypeScript')
    
    var tsResult = gulp.src(config.ts.files)
        .pipe($.sourcemaps.init())
        .pipe($.typescript({
			noImplicitAny: true,
            declaration: true
		}));

    return stream.merge(
        tsResult.dts.pipe(gulp.dest(config.ts.typings)),
        tsResult.js
            .pipe($.sourcemaps.write('.'))
            .pipe(gulp.dest(config.ts.out)));
});

/**
 * Watch and compile TypeScript
 */
gulp.task('ts-watch', function () {
    return gulp.watch(config.ts.files, ['ts-compile']);
});

/**
 * Remove all files from the build, temp, and reports folders
 * @param  {Function} done - callback when complete
 */
gulp.task('clean', ['ts-clean'], function() {
    var delconfig = [].concat(config.build, config.temp, config.report);
    return clean(delconfig);
});

/**
 * Remove all files from the build, temp, and reports folders
 * @param  {Function} done - callback when complete
 */
gulp.task('ts-clean', function() {
    var delconfig = [].concat(config.ts.outFiles);
    return clean(delconfig);
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
function clean(path) {
    log('Cleaning: ' + $.util.colors.blue(path));
    return del(path);
}