/* global System */

// Configure systemjs to use the .js extension for imports from the src/js folder
System.config({
    packages: {
        'src/js': {defaultExtension: 'js'}
    }
});

Promise.all([
    /// inject:import
]);
