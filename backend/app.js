var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var multipart = require('connect-multiparty');

var app = express();

var Joiner = require('./joiner');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(multipart());
app.use(express.static(__dirname + './../frontend/'));

var resumable = require('./resumable')('./trunk/');

// Handle uploads through Resumable.js
app.post('/upload', function(req, res){

  // console.log(req);

    resumable.post(req, function(status, filename, original_filename, identifier){
        // console.log('POST', status, original_filename, identifier);
        if (status == 'done') {
            Joiner(filename, identifier);
        }

        res.send(status, {
            // NOTE: Uncomment this funciton to enable cross-domain request.
            //'Access-Control-Allow-Origin': '*'
        });
    });
});

// Handle status checks on chunks through Resumable.js
app.get('/upload', function(req, res){
    resumable.get(req, function(status, filename, original_filename, identifier){
        console.log('GET', status);
        res.send((status == 'found' ? 200 : 404), status);
    });
});

app.get('/download/:identifier', function(req, res){
    resumable.write(req.params.identifier, res);
});

app.get('/', function (req, res) {
    console.log('index');
    res.render('index');
});

module.exports = app;
