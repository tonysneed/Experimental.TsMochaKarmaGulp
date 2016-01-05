# Setting Up a TypeScript Project with Karma, Mocha, and Gulp

## Prerequisites

1. Install [Node.js](https://nodejs.org/en)
	
2. Install *global* node packages.
	```
	npm install gulp typescript karma-cli phantomjs -g
	```

## Steps Part A: Set up TypeScript with Gulp build and watch tasks

1. Create a project folder with the following subdirectories:
	```shell
    src
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
	npm install --save-dev del gulp gulp-typescript gulp-util gulp-load-plugins gulp-task-listing
	```
	- Creates package folders inside a `node_modules` folder.
	- Writes dev dependencies to the packages.json file.
    
5. Create a `gulp.config.js` file and paste the following content:
    ```js
    module.exports = function() {
        var src = './src/';
        
        var config = {

            /**
            * File paths
            */
            
            // Src root
            src: src,
            
            // Build output
            build: './build/',
            
            // Temp folder
            temp: './.tmp/',
            
            // Report folder
            report: './report/',
            
            // TypeScript files
            ts: [
                './*.ts',
                src + '**/*.ts'
            ],
            
            // JavaScript files
            js: [
                './*.js',
                src + '**/*.js'
            ]
        }
        
        return config;
    };
    ```

6. Create a `gulpfile.js` file at the project root.
	- Copy the following code into the file:
    
	```js
    var config = require('./gulp.config')();
    var gulp = require('gulp');
    var $ = require('gulp-load-plugins')({ lazy: true });
    var del = require('del');

    gulp.task('help', $.taskListing);
    gulp.task('default', ['help']);

    // Compile TypeScript
    gulp.task('ts-compile', function(){
        log('Compiling TypeScript')
        return gulp.src(config.ts)
            .pipe($.typescript())
            .pipe(gulp.dest(config.build));
    });

    // Watch and compile TypeScript
    gulp.task('ts-watch', function () {
        return gulp.watch(config.ts, ['ts-compile']);
    });

    // Remove all files from the build, temp, and reports folders
    // done: callback when complete
    gulp.task('clean', function(done) {
        var delconfig = [].concat(config.build, config.temp, config.report);
        log('Cleaning: ' + $.util.colors.blue(delconfig));
        del(delconfig, done);
    });

    ////////////////

    // Log a message or series of messages using chalk's blue color.
    // Can pass in a string, object or array.
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

    // Delete all files in a given path
    function clean(path, done) {
        log('Cleaning: ' + $.util.colors.blue(path));
        del(path, done);
    }
	```

	- The `ts-compile` task transpiles .ts files into .js files
	- The `ts-watch` task monitors .ts files and executes `ts-compile` task when a change is detected.

5. Configure the Task Runner in VS Code.
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
    
6. Add an `greeter.ts` file to the `src` folder.
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
	
