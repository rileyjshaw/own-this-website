var connect = require('connect');
var http = require('http');
var fs = require('fs');
var path = require('path');

var PROJECT_ROOT = __dirname;
var FILE_SERVE_ROOT = path.join(PROJECT_ROOT, 'dist');

connect.createServer(
    connect.static(FILE_SERVE_ROOT)
).listen(1234);
