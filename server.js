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