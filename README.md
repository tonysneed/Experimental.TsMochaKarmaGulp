# Setting Up a TypeScript Project with Jamsine, Karma and Gulp

## Prerequisites

1. Install [Node.js](https://nodejs.org/en)
	
2. Install *global* node packages.

    ```
    npm install gulp typescript karma-cli phantomjs -g
    ```

## Part A: Set up TypeScript with Gulp build and watch tasks

1. Create a project folder with the following subdirectories:

	```shell
    src
      - js
      - ts
	```
    
2. Open the project folder with VS Code
	- `cd` into the folder from Terminal and execute:
    
	```shell
	code .
	```
	
3. Initialize the `package.json` file.

	```shell
	npm init -y
	```
	- The `-y` flag will create `package.json` with defaults

4. Install *local* node packages.

	```shell
	npm install --save-dev del merge2 event-stream gulp gulp-typescript gulp-sourcemaps gulp-util gulp-load-plugins gulp-task-listing
	```
	- Creates package folders inside a `node_modules` folder.
	- Writes dev dependencies to the packages.json file.
    
5. Create a `gulp.config.js` file to encapsulate strings as settings.

6. Create a `gulpfile.js` file to define gulp tasks.
  - Include a `ts-compile` task for transpiling TypeScript to JavaScript.
  - Optionally generate source maps and type definitions.

7. Configure the Task Runner in VS Code.
	- Press **Cmd-Shft-P**, then type *'Config'* and click *'Configure Task Runner'*
	- Once the `tasks.json` file is created, replace the content with the following:
	
	```json
	{
		"version": "0.1.0",
		"command": "gulp",
		"isShellCommand": true,
		"args": [
			"--no-color"
		],
		"tasks": [
			{
				"taskName": "ts-compile",
				"isBuildCommand": true,
				"showOutput": "silent",
                "problemMatcher": "$gulp-tsc"
			}
		]
	}
	```	
    
8. Add an `greeter.ts` file to the `src` folder.
	- Add the following content to the file:
    
	```typescript
    class Greeter {
        greeting: string;
        constructor(message: string) {
            this.greeting = message;
        }
        greet() {
            return "Hello, " + this.greeting;
        }
    }
	```
	- Press **Cmd-Shft_B** to execute the `ts-compile` task.
	- An `greeter.js` file should appear in a `build` folder.
	- Run the `ts-watch` task, then change typescript class in some way.
	- Saving the file will then result in `greeter.js` being updated.
	
9. Install jasmine locally.

    ```shell
    npm install --save-dev jasmine-core
    ```
    
## Part B: Add Gulp tasks for running tests with Karma and Jasmine

1. Add a `greeter.spec.js` filt to the `src/js` folder.

  - Place the following test there:
  
  ```js
    describe('App.Greeter', function() {
        
        describe('greet', function(){   
                
            it('returns hello world', function(){
                
                // Arrange
                var greeter = new App.Greeter('World');
                
                // Act
                var result = greeter.greet();
                
                // Assert
                expect(result).toEqual('Hello World');
            });
        });    
    });

  ```
  
2. Install `tsd` and `typings` globally.

  - Allows installation of type definition files to enable intellisense in vscode.
  - `typings` offers more features than `tsd`, including `uninstall`.

    ```shell
    npm install tsd -g
    npm install typings -g
        ```

3. Install the type definitions to provide intellisense.

  - Execute the following command from the terminal:
  
    ```shell
    tsd install node jasmine
    typings install node --ambient --save-dev
    typings install jasmine --save-dev
    ```

  - If a typing is not installed, you can highlight an unknown function, then press Cmd+. to install it.     
  - You can also install `tds` globally and use it.
  
4. Download the latest standalone zip file for Jasmine.

  - https://github.com/jasmine/jasmine/releases/latest
  - Unzip contents and copy the `lib` folder and `SpecRunner.html` file to project.
  - Place the `lib` folder in a `tools/testing` folder, and place
    `SpecRunner.html` in the project root.
  - Update the script links in `SpecRunner.html` and test by opening it from the Finder.
  
5. Install `karma-cli` globally.

    ```shell
    npm install karma-cli -g
    ```

6. Install `karma` with plugins locally.

    ```shell
    npm install --save-dev karma phantomjs karma-jasmine karma-phantomjs-launcher
    ```
    
7. Configure `karma`

    ```shell
    karma init
    ```

  - Specify configuration parameters:
        + `jasmine` for the testing framework
        + `PhantomJS` for the browser
        + `src/js/*.js` for input files
        + `yes` for watch files for changes    
 
8. Start `karma` from the terminal.

    ```shell
    karma start
    ```

  - Test results will be displayed in the terminal.
  - If you update the test to make it fail, `karma` will re-execute them.
  - Press Ctrl+C to stop `karma`.
  - Change the test back so that it passes.
  - To conduct a single test run with `karma`, append `--singleRun` to `karma start`.
  
9. Update `gulp.config.js` to include karma settings.

    ```js
    // Karma settings
    config.karma = getKarmaOptions();
    
    return config;
    
    ////////////////
    
    function getKarmaOptions() {
        var options = {
            files: [].concat(
                jsSrc + '*.js'
            ),
            exclude: []
        };
        return options;
    }

    ```
    
    - Update `karma.conf.js` to use `gulpfile.config.js`.
      + First add a require to bring in gulp.config:
      + Then update `files` to get values from `gulp.config`
      
    ```js
    var gulpConfig = require('./gulp.config')();
    ```

    ```js
    files: gulpConfig.karma.files,
    exclude: gulpConfig.karma.exclude,
        ```
        
10. Add tasks to `gulpfile.js` to run `karma` tests.

    ```js
    gulp.task('test', function() {
        startTests(true /*singleRun*/ );
    });

    gulp.task('test-watch', function() {
        startTests(false /*singleRun*/ );
    });
    
    ```
    
  - Add the `startTests` method.
  
  ```js
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
  ```
  
    - Run the gulp `test` task to verify that `karma` tests are running.
    - Run the gulp `test-watch` task to verify that `karma` watcher is running.
    
11. Add options to `gulp.config` for `karma` code coverage and reporting.

  - Add `report` variable for report directory, then set config property.
  
    ```js
    var report = './report/';
    report: report, 
    ```
    
  - Add `coverage` property to `getKarmaOptions`
  - Setting `preprocessors` on `coverage` to exclude `.spec.js` files from coverage.

  ```js
    coverage: {
        dir: report + 'coverage',
        reporters: [
            {type: 'html', subdir: 'report-html'},
            {type: 'lcov', subdir: 'report-lcov'},
            {type: 'text-summary'}
        ],
        preprocessors: []
    }
    options.preprocessors[jsSrc + '**/!(*.spec)+(.js)'] = ['coverage'];
  ```
  
  - Update `karma.conf.js` to obtain additional values from `gulp.config`.

    ```js
    preprocessors: gulpConfig.karma.preprocessors,
    reporters: ['progress', 'coverage'],
    coverageReporter: {
            dir: gulpConfig.karma.coverage.dir,
            reporters: gulpConfig.karma.coverage.reporters
        },
    ```
    
  - Add a dev dependency for `karma-coverage`.
  
  ```shell
  npm install karma-coverage --save-dev
  ```
  
  - Then run `gulp test` from the terminal.
    You should see a nice `Coverage summary` output to the terminal.
    
12. Use `gulp` to automate inclusion of tests in `SpecRunner.html`.

  - Add `root`, `js`, `specRunner`, `specRunnerFile` to `gulp.config`.
  
    ```js
    var root = './';
    var src = './src/';
    var jsSrc = src + 'js/';
    var jsSrcFiles = '**/*.js';
    var jsModuleFiles = '**/*.module.js';
    var jsMapFiles = '**/*.js.map';
    var jsSpecFiles = '**/*.spec.js';
    var specRunnerFile = 'SpecRunner.html';
    ```
    
  - Add `js` settings to `gulp.config`.
        + `src` property returns only `.js` source files
        + `specs` property returns only `.spec.js` files
  
    ```js
    root: root,
    specRunner: root + specRunnerFile,
    specRunnerFile: specRunnerFile,
    js: {
        js: {
            src: [
                jsSrc + jsSrcFiles,
                '!' + jsSrc + jsMapFiles,
                '!' + jsSrc + jsSpecFiles
            ],
            order: [
                jsModuleFiles,
                jsSrcFiles
            ],
            specs: [
                jsSrc + jsSpecFiles
            ],
        },
    },

    ```
    
  - Create a `inject-specs` gulp task for injecting specs into runner.

        + Install `gulp-if`, `gulp-inject`, `gulp-order` packages.
        + Add an `orderSrc`, `inject` functions to `gulpfile.js`.
  
    ```shell
    npm install gulp-if gulp-inject gulp-order --save-dev
    ```
        
    ```js
    gulp.task('inject-specs', function() {
        log('injecting scripts into the spec runner');

        return gulp
            .src(config.specRunner)
            .pipe(inject(config.js.src, '', config.js.order))
            .pipe(inject(config.js.specs, 'specs', ['**/*']))
            .pipe(gulp.dest(config.root));
    });

    function orderSrc (src, order) {
        return gulp
            .src(src)
            .pipe($.if(order, $.order(order)));
    }

    function inject(src, label, order) {
        var options = {read: false};
        if (label) {
            options.name = 'inject:' + label;
        }

        return $.inject(orderSrc(src, order), options);
    }
    ```
  
  - Replace source and spec script sections in `SpecRunner.html`
    with inject labeled comments.
    
        + Run `gulp inject-specs` from terminal then inspect
          `SpecRunner.html` to verify source and specs where injected.
    
    ```html
    <!-- inject:js -->
    <!-- endinject -->

    <!-- inject:specs:js -->
    <!-- endinject -->
    ```
    
13. Use `express` to serve the spec runner.

  - Add `express` as a dev devependency.
  
    ```shell
    npm install express --save-dev
    ```
    
  - Add type defs for `express` and `serve-static`.
  
    ```shell
    tsd install express
    typings install express --ambient --savedev
    typings install serve-static --ambient --savedev
    ```

  - Add node settings to `gulp/config`.
  
    ```js
    nodeServer: root + 'server.js',
    defaultPort: '7203'
    ```
    
    - Add a `server.js` file to the root folder with code to start an express server.
        + Specify `config.specRunnerFile` for the `index` option.
        + Test the server by entering `node server.js` in the terminal.
        + Then open a browser to: `http://localhost:7203/` to see the spec runner.
  
    ```js
    'use strict';

    var express = require('express');
    var app = express();
    var config = require('./gulp.config')();
    var port = process.env.PORT || config.defaultPort;

    console.log('Starting express server ...');

    app.use('/', express.static(config.root, { index: config.specRunnerFile }));

    var server = app.listen(port, function() {
        console.log('Express server listening on port %s', port);
    });
    ```

  - Add dependencies for `yargs`, `gulp-nodemon`.
        + Add require at the top of `guplfile`.
  
    ```shell
    npm install yargs --save-dev
    npm install gulp-nodemon --save-dev
    
    tsd install yargs gulp-nodemon
    typings install yargs gulp-nodemon --save-dev
    ```

    ```js
    var args = require('yargs').argv;
    ```
    
  - Add config for js source directory that nodemon will watch.
  
    ```js
    js: {
        dir: jsSrc,
    ```
    
  - Add a `serve` function which uses `gulp-nodemon` to start the node server.
        + Configure `nodemon` to restart when changes in `src/js` have occurred.
        + Set a minimum delay of 2000 ms to avoid redundant restarts.
        + Include options to attach a debugger to the node server.
        
    ```js
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
    }```

  - Add a `serve-specs` task which depends on `ts-watch` and `inject-specs`.
        + Run the `serve-specs` task, then change some watched files. 
          The node server should restart as excpected.
  
    ```js
    gulp.task('serve-specs', ['inject-specs', 'ts-watch'], function() {
        log('run the spec runner');
        serve();
    });
    ```
    
14. Use `browser-sync` to refresh tests in browser on file changes.

  - Add `browser-sync` package and typings.
  
    ```shell
    npm install browser-sync --save-dev
    tsd install browser-sync
    typings install browser-sync --ambient --save-dev
    typings install browser-sync --ambient --save-dev
    ```
    
  - Add config properties for `browser-sync`.
  
    ```js
    js: {
        srcSpecs: [
            jsSrc + jsSrcFiles,
            '!' + jsSrc + jsMapFiles,
            jsSrc + jsSpecFiles
        ]
    browserReloadPort: 3000,
    browserReloadDelay: 1000
    ```  
    
  - Add a require for `browser-sync` to `gulpfile`.
        + Initialize a `port` variable defaulting to config.defaultPort
        + Add `startBrowserSync` method.
        
    ```js
    var browserSync = require('browser-sync');
    var port = process.env.PORT || config.defaultPort;
    ```
    
    ```js
    function startBrowserSync() {
        if (args.nosync || browserSync.active) {
            return;
        }

        log('Starting BrowserSync on port ' + port);

        var options = {
            proxy: 'localhost:' + port,
            port: config.browserReloadPort,
            files: config.js.srcSpecs,
            ghostMode: {
                clicks: true,
                location: false,
                forms: true,
                scroll: true
            },
            injectChanges: true,
            logFileChanges: true,
            logLevel: 'debug',
            logPrefix: 'ts-gulp-karma',
            notify: true,
            reloadDelay: config.browserReloadDelay,
            startPath: config.specRunnerFile
        } ;

        browserSync(options);
    }
    ```
    
  - Update `serve` method to call `startBrowserSync` on start.
        + Call `browserSync.notify` and `browserSync.reload` on restart
          using a `setTimeout` method.
        + Test by running `gulp serve-specs` and changing files: `.ts`, `.js`, `.spec.js`.
        + The browser will launch with tests, then reload on changes.
        + You can connect more than once browser at the same time, 
          which stay in sync and repond to user input.
        + Add `--nosync` to task command to not use `browser-sync`.
          
    ```js
    return $.nodemon(nodeOptions)
        .on('restart', function(ev) {
            log('*** nodemon restarted');
            if (ev) {
                log('files changed:\n' + ev);
            }
            setTimeout(function() {
                browserSync.notify('reloading now ...');
                browserSync.reload({stream: false});
            }, config.browserReloadDelay);
        })
        .on('start', function () {
            log('*** nodemon started');
            startBrowserSync();
        })
    ```

