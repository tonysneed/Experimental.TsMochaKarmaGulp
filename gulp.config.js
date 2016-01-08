module.exports = function() {
    
    // Local variables
    var src = './src/';
    var tsSrc = src + 'ts/';
    var jsSrc = src + 'js/';
    var typings = './tools/typings/';
    var report = './report/';
    var specRunnerFile = 'SpecRunner.html';
    
    var config = {

        // Root folder
        root: './',

        // Source folders
        src: src,
        
        // Build output
        build: './build/',
        
        // Temp folder
        temp: './.tmp/',
        
        // Report folder
        report: report,
        
        // Spec runner html file
        specRunner: specRunnerFile,
        
        // JavaScript settings
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
        
        // TypeScript settings
        ts: {
            
            // Folders
            src: tsSrc,
            out: jsSrc,
            
            // Source files
            files: [
                tsSrc + '**/*.ts'
            ],
            
            // Type definitions
            typings: typings,
            
            // Compiled files
            outFiles: [
                jsSrc + '**/*.js',
                jsSrc + '**/*.js.map',
                '!' + jsSrc + '**/*.spec.js',
                typings + '**/*.d.ts'
            ]
        }
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
