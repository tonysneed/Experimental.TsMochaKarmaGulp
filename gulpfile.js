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
 */
gulp.task('clean', ['ts-clean'], function() {
    var delconfig = [].concat(config.build, config.temp, config.report);
    return clean(delconfig);
});

/**
 * Remove all files from the build, temp, and reports folders
 */
gulp.task('ts-clean', function() {
    var delconfig = [].concat(config.ts.outFiles);
    return clean(delconfig);
});

/**
 * Run specs once and exit
 * To start servers and run midway specs as well:
 *    gulp test --startServers
 * @return {Stream}
 */
gulp.task('test', function() {
    startTests(true /*singleRun*/ );
});

/**
 * Run specs and wait.
 * Watch for file changes and re-run tests on each change
 * To start servers and run midway specs as well:
 *    gulp autotest --startServers
 */
gulp.task('test-watch', function() {
    startTests(false /*singleRun*/ );
});

/**
 * Inject all the spec files into the SpecRunner.html
 * @return {Stream}
 */
gulp.task('inject-specs', function() {
    log('building the spec runner');

    //var specs = config.specs;
    return gulp
        .src(config.specRunner)
        .pipe(inject(config.js.src, '', config.js.order))
        .pipe(inject(config.js.specs, 'specs', ['**/*']))
        .pipe(gulp.dest(config.root));
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
 */
function clean(path) {
    log('Cleaning: ' + $.util.colors.blue(path));
    return del(path);
}

/**
 * Start the tests using karma.
 * @param  {boolean} singleRun - True means run once and end (CI), or keep running (dev)
 * @return {undefined}
 */
function startTests(singleRun) {
    
    var Server = require('karma').Server;
    
    log('Karma started');

    var server = new Server({
        configFile: __dirname + '/karma.conf.js',
        exclude: config.karma.exclude,
        singleRun: !!singleRun
    });

    server.on('run_complete', function (browser, result) {
        log('Karma completed');
    });
    
    server.start();    
}

/**
 * Order a stream
 * @param   {Stream} src   The gulp.src stream
 * @param   {Array} order Glob array pattern
 * @returns {Stream} The ordered stream
 */
function orderSrc (src, order) {
    return gulp
        .src(src)
        .pipe($.if(order, $.order(order)));
}

/**
 * Inject files in a sorted sequence at a specified inject label
 * @param   {Array} src   glob pattern for source files
 * @param   {String} label   The label name
 * @param   {Array} order   glob pattern for sort order of the files
 * @returns {Stream}   The stream
 */
function inject(src, label, order) {
    var options = {read: false};
    if (label) {
        options.name = 'inject:' + label;
    }

    return $.inject(orderSrc(src, order), options);
}