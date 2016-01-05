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
	npm install --save-dev gulp gulp-typescript
	```
	- Creates package folders inside a `node_modules` folder.
	- Writes dev dependencies to the packages.json file.

5. Create a `gulpfile.js` file at the project root.
	- Copy the following code into the file:
	```js
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
				"showOutput": "silent"
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
	- Press **Cmd-Shft_B** to execute the 'ts-compile' task.
	- An `greeter.js` file should appear in a `build` folder.
	- Run the `ts-watch` task, then change typescript class in some way.
	- Saving the file will then result in `greeter.js` being updated.
	
