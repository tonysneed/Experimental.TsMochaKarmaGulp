module.exports = function() {
    
    // Local variables
    var src = './src/';
    var tsSrc = src + 'ts/';
    var jsSrc = src + 'js/';
    var typings = './tools/typings/';
    
    var config = {

        // Source folders
        src: src,
        
        // Build output
        build: './build/',
        
        // Temp folder
        temp: './.tmp/',
        
        // Report folder
        report: './report/',
        
        // TypeScript Settings
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
    
    return config;
};
