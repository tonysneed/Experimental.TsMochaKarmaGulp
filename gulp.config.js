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
