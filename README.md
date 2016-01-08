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

10. Add a `greeter.spec.js` filt to the `src/js` folder.

  - Place the following test there:
  
  ```js`
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
  
11. Install `typings` globally.

  - Allows installation of type definition files to enable intellisense in vscode.
  - `typings` offers more features than `tsd`, including `uninstall`

    ```shell
    npm install typings -g
    ```

12. Install the type definitions to provide intellisense.

  - Execute the following command from the terminal:
  
    ```shell
    typings install node --ambient --save-dev
    typings install jasmine --save-dev
    ```

  - If a typing is not installed, you can also highlight an unknown function, then press Cmd+. to install it.     
  - You can also install `tds` globally and use it.
  
13. Download the latest standalone zip file for Jasmine.

  - https://github.com/jasmine/jasmine/releases/latest
  - Unzip contents and copy the `lib` folder and `SpecRunner.html` file to project.
  - Update the script links to the source and spec files.
  
14. Reveal `SpecRunner.html` in the Finder, then double-click to open in a browser.

  - You should see the test results displayed.
  
15. Install `karma-cli` globally.

    ```shell
    npm install karma-cli -g
    ```

16. Install `karma` with plugins locally.

    ```shell
    npm install --save-dev karma phantomjs karma-jasmine karma-phantomjs-launcher
    ```
    
17. Configure `karma`

    ```shell
    karma init
    ```

  - Specify configuration parameters:
        + `jasmine` for the testing framework
        + `PhantomJS` for the browser
        + `src/js/*.js` for input files
        + `yes` for watch files for changes    
 
18. Start `karma` from the terminal.

    ```shell
    karma start
    ```

  - Test results will be displayed in the terminal.
  - If you update the test to make it fail, `karma` will re-execute them.
  - Press Ctrl+C to stop `karma`.
  - Change the test back so that it passes.
  - To conduct a single test run with `karma`, append `--singleRun` to `karma start`.
  
19. Update `gulp.config.js` to include karma settings.

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
        
20. Add tasks to `gulpfile.js` to run `karma` tests.

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
    
21. Add options to `gulp.config` for `karma` code coverage and reporting.

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
    
22. Use `gulp` to automate inclusion of tests in `SpecRunner.html`.

  - Add `specRunner` and `specRunnerFile` to `gulp.config`.
  
    ```js
    var specRunnerFile = 'specs.html';
    specRunner: specRunnerFile
    ```
    
  - Add `root` and `js` settings to `gulp.config`.
        + `src` property returns only `.js` source files
        + `specs` property returns only `.spec.js` files
  
    ```js
    root: './',
    js: {
        src: [
            jsSrc + '**/*.js',
            '!' + jsSrc + '**/*.js.map',
            '!' + jsSrc + '**/*.spec.js',
        ],
        order: [
            '**/*.module.js',
            '**/*.js'
        ],
        specs: [
            jsSrc + '**/*.spec.js'
        ]
    },

    ```
    
  - Create a `inject-specs` gulp task for injecting specs into runner.

        + Install `gulp-if`, `gulp-inject`, `gulp-order` packages.
        + Add an `orderSrc`, `inject` functions to `gulpfile.js`.
  
    ```shell
    npm install gulp-if gulp-inject gulp-order --save-dev
    ```
        
    ```js
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
    
