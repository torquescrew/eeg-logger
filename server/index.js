var path = require('path');

//var player = require('./mindwave/mindwave-log-player');
//var data = require('./mindwave/mindwave-data');
//var mindwave = require('./mindwave/mindwave-main');

var express = require('express');
var app = express();
var server = require('http').Server(app);
//var io = require('socket.io')(server);


app.get('/', function(req, res) {
  res.redirect('/main.html');
});

//app.get('/playLog', function(req, res) {
//  var name = req.query.name;
//  //player.playLog(name);
//  player.playLast();
//
//  res.send('done');
//});
//
//app.get('/stopPlaying', function(req, res) {
//  player.stop();
//
//  res.send('done');
//});
//
//app.get('/logFileList', function(req, res) {
//  data.getLogFilesList(function(list) {
//    res.send(list);
//  });
//});
//
//app.get('/loadLog', function(req, res) {
//  var name = req.query.name;
//  data.load(name, function(data) {
//    res.send(data);
//  });
//});
//
//app.get('/deleteLog', function(req, res) {
//  var name = req.query.name;
//  data.remove(name);
//  res.send('OK');
//});


app.use(express.static(path.join(__dirname, '../public')));

server.listen(3081, function() {
  console.log("Listening on port 3081");
});

//io.on('connection', function(s) {
//  console.log('connection!');
//  mindwave.setSocket(s);
//});
