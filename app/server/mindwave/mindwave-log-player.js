var _ = require('underscore');
var mwData = require('./mindwave-data');
var mwMain = require('./mindwave-main');


var _position = 0;
var _playing = false;

function playLog(fileName) {
  mwData.load(fileName, function(data) {
    _playing = true;
    streamData(JSON.parse(data));
  });
}

function streamData(data) {
  if (!_playing) {
    return;
  }

  var delay = calcNextDelay(data, _position);

  if (delay === Infinity) {
    _playing = false;
    return;
  }

  mwMain.handleNewData(data[_position]);
  _position += 1;

  setTimeout(function() {
    streamData(data);
  }, delay);
}

function calcNextDelay(data, position) {
  var d1 = data[position];
  var d2 = data[position + 1];

  if (_.isUndefined(d1) || _.isUndefined(d2)) {
    return Infinity;
  }

  return d2.time - d1.time;
}

function playLast() {
  mwData.getLogFilesList(function(list) {
    var fileName = _.last(list);

    playLog(fileName);
  });
}

function stop() {
  _playing = false;
}

module.exports.playLog = playLog;
module.exports.playLast = playLast;
module.exports.stop = stop;