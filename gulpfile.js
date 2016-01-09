var config = require('./gulp.config')();
var del = require('del');
var merge = require('merge2');
var stream = require('event-stream');
var args = require('yargs').argv;
var gulp = require('gulp');
var $ = require('gulp-load-plugins')({ lazy: true });

/**
 * yargs variables can be passed in to alter the behavior, when present.
 * Example: gulp serve-specs
 *
 * --verbose  : Various tasks will produce more output to the console.
 * --debug    : Launch debugger with node-inspector.
 * --debug-brk: Launch debugger and break on 1st line with node-inspector.
 */

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
    log('injecting scripts into the spec runner');

    return gulp
        .src(config.specRunner)
        .pipe(inject(config.js.src, '', config.js.order))
        .pipe(inject(config.js.specs, 'specs', ['**/*']))
        .pipe(gulp.dest(config.root));
});

/**
 * Run the spec runner
 * @return {Stream}
 */
gulp.task('serve-specs', ['inject-specs', 'ts-watch'], function() {
    log('run the spec runner');
    serve();
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
    var options = {read: false, addRootSlash: false};
    if (label) {
        options.name = 'inject:' + label;
    }
    return $.inject(orderSrc(src, order), options);
}

/**
 * start the express server
 * --debug-brk or --debug
 * --verbose  to log options
 */
function serve() {
    var debug = args.debug || args.debugBrk;
    var debugMode = args.debug ? '--debug' : args.debugBrk ? '--debug-brk' : '';
    var nodeOptions = getNodeOptions();

    if (debug) {
        runNodeInspector();
        nodeOptions.nodeArgs = [debugMode + '=5858'];
    }

    if (args.verbose) {
        nodeOptions.verbose = true;
        console.log(nodeOptions);
    }

    return $.nodemon(nodeOptions)
        .on('restart', function(ev) {
            log('*** nodemon restarted');
            if (ev) {
                log('files changed:\n' + ev);
            }
        })
        .on('start', function () {
            log('*** nodemon started');
        })
        .on('crash', function () {
            log('*** nodemon crashed: script crashed for some reason');
        })
        .on('exit', function () {
            log('*** nodemon exited cleanly');
        });
}

function getNodeOptions() {
    
    return {
        script: config.nodeServer,
        delay: 2000, // Setting too low causes multiple restarts on file changes
        env: {
            'PORT': config.defaultPort
        },
        watch: config.js.dir
    };
}

function runNodeInspector() {

    log('Running node-inspector.');
    log('Browse to http://localhost:8080/debug?port=5858');
    
    var exec = require('child_process').exec;
    exec('node-inspector');
}