module.exports = function() {
    
    // Local variables
    var root = './';
    var src = './src/';
    var tsSrc = src + 'ts/';
    var jsSrc = src + 'js/';
    var jsSrcFiles = '**/*.js';
    var jsModuleFiles = '**/*.module.js';
    var jsMapFiles = '**/*.js.map';
    var jsSpecFiles = '**/*.spec.js';
    var tsSrcFiles = '**/*.ts';
    var tsDefFiles = '**/*.d.ts';
    var typings = './tools/typings/';
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

        // Node settings
        nodeServer: root + 'server.js',
        defaultPort: '7203',
        
        // Browser sync
        browserReloadPort: 3000,
        browserReloadDelay: 1000
    }
    
    // Karma settings
    config.karma = getKarmaOptions();
    
    return config;
    
    ////////////////
    
    function getKarmaOptions() {
        var options = {
            files: [].concat(
                jsSrc + '*.js'
            ),
            exclude: [],
            coverage: {
                dir: report + 'coverage',
                reporters: [
                    {type: 'html', subdir: 'report-html'},
                    {type: 'lcov', subdir: 'report-lcov'},
                    {type: 'text-summary'}
                ]
            },
            preprocessors: []
        };
        options.preprocessors[jsSrc + '**/!(*.spec)+(.js)'] = ['coverage'];
        return options;
    }
};
