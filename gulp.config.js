module.exports = function () {
    
    // Local variables
    var root = './';
    var src = './src/';
    var tsSrc = src + 'ts/';
    var jsSrc = src + 'js/';
    var jsRoot = root + '*.js';
    var jsSrcFiles = '**/*.js';
    var jsModuleFiles = '**/*.module.js';
    var jsMapFiles = '**/*.js.map';
    var jsSpecFiles = '**/*.spec.js';
    var tsSrcFiles = '**/*.ts';
    var tsDefFiles = '**/*.d.ts';
    var typings = './typings/local/';
    var report = './report/';
    var specRunnerFile = 'SpecRunner.html';

    var config = {

        // Root folder
        root: root,
        
        // Source folders
        src: src,
        
        // Build output
        build: './build/',
        
        // Temp folder
        temp: './.tmp/',
        
        // Report folder
        report: report,
        
        // Spec runner html file
        specRunner: root + specRunnerFile,
        specRunnerFile: specRunnerFile,
        
        // JavaScript settings
        js: {
            root: jsRoot,
            dir: jsSrc,
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
            maps: jsSrc + jsMapFiles,
            srcSpecs: [
                jsSrc + jsSrcFiles,
                '!' + jsSrc + jsMapFiles,
                jsSrc + jsSpecFiles
            ]
        },
        
        // TypeScript settings
        ts: {
            
            // Compiler options
            compilerOptions: {
                module: 'commonjs',
                target: 'es5',
                noImplicitAny: true,
                declaration: true,
                moduleResolution: 'node',
                removeComments: true
            },
            
            // Folders
            src: tsSrc,
            out: jsSrc,
            
            // Source files
            files: [
                tsSrc + tsSrcFiles
            ],
            
            // Type definitions
            typings: typings,
            
            // Compiled files
            outFiles: [
                jsSrc + jsSrcFiles,
                jsSrc + jsMapFiles,
                '!' + jsSrc + jsSpecFiles,
                typings + tsDefFiles
            ]
        },

        // Browser sync setings
        browserSync: {
            port: 3000,
            reloadDelay: 1000,
            logLevel: 'info',
            logPrefix: 'spec-runner',
        }
    };
    
    // Karma settings
    config.karma = getKarmaOptions();

    return config;
    
    ////////////////
    
    function getKarmaOptions() {
        var options = {
            files: [].concat(
                // jsSrc + '*.js',
                jsSrc + jsSrcFiles
                ),
            exclude: [],
            coverage: {
                dir: report + 'coverage',
                reporters: [
                    { type: 'html', subdir: 'report-html' },
                    { type: 'lcov', subdir: 'report-lcov' },
                    { type: 'text-summary' }
                ]
            },
            preprocessors: [],
            babelPreprocessor: {
                options: {
                    presets: ['es2015'],
                    sourceMap: 'inline'
                },
                filename: function (file) {
                    return file.originalPath.replace(/\.js$/, '.es5.js');
                },
                sourceFileName: function (file) {
                    return file.originalPath;
                }
            },
        };
        options.preprocessors[jsSrc + '**/!(*.spec)+(.js)'] = ['coverage'];
        //options.preprocessors[jsSrc + '**/*.js'] = ['babel'];
        return options;
    }
};
