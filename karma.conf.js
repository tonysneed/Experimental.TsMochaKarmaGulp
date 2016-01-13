// Karma configuration
// Generated on Fri Jan 08 2016 10:17:15 GMT+0100 (CET)

module.exports = function (config) {
    
    // Require gulp.config
    var gulpConfig = require('./gulp.config')();

    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: './',

        plugins: [
            'karma-systemjs',
            'karma-phantomjs-launcher',
            'karma-typescript-preprocessor',
            'karma-jasmine',
            'karma-coverage',
        ],

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['systemjs', 'jasmine'],

        files: [
            'src/ts/*.spec.ts'
        ],

        // list of files to exclude
        exclude: gulpConfig.karma.exclude,

        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        // preprocessors: gulpConfig.karma.preprocessors,

        // typescriptPreprocessor: {
        //     options: {
        //         sourceMap: true,
        //         target: 'ES5',
        //         module: 'amd',
        //         noResolve: false
        //     },
        //     transformPath: function (path) {
        //         return path.replace(/\.ts$/, '.js');
        //     }
        // },

        //babelPreprocessor: gulpConfig.karma.babelPreprocessor,

        systemjs: {
            // configFile: 'system.config.js',
            config: {
                paths: {
                    'typescript': 'node_modules/typescript/lib/typescript.js',
                    'systemjs': 'node_modules/systemjs/dist/system.js',
                    'system-polyfills': 'node_modules/systemjs/dist/system-polyfills.js',
                    'es6-module-loader': 'node_modules/es6-module-loader/dist/es6-module-loader.js',
                    'phantomjs-polyfill': 'node_modules/phantomjs-polyfill/bind-polyfill.js'
                },
                packages: {
                    'src/ts': {
                        defaultExtension: 'ts'
                    }
                },
                transpiler: 'typescript'
            },
            serveFiles: [
                'src/ts/**/*.ts'
            ]
        },

        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        // reporters: ['progress', 'coverage'],
        
        // coverage reporter
        // coverageReporter: {
        //     dir: gulpConfig.karma.coverage.dir,
        //     reporters: gulpConfig.karma.coverage.reporters
        // },

        // web server port
        port: 9876,

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN 
        // || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['PhantomJS'],

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false,

        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity
    });
};
