var
connect = require('connect'),
http = require('http'),
fs = require('fs'),
path = require('path'),
redis = require('redis'),
PROJECT_ROOT = path.join('..', __dirname),
FILE_SERVE_ROOT = path.join(PROJECT_ROOT, 'dist'),
client = redis.createClient(),
king = {
  name: '',
  score: 0
},
officialScoreKeeper = setInterval(function() {
  var name = king.name;
  if (name) {
    client.zincrby('scores', 1, king.name);
  }
}, 1000);

client.on("error", function (err) {
  console.log("Redis error " + err);
});

connect.createServer(
    connect.static(FILE_SERVE_ROOT)
).listen(1234);

module.exports = {
  getHighScores: function() {
    return client.zrange('scores', 0, 9, true) // WITHSCORES is true
  },
  getKing: function() {
    return king;
  },
  setKing: function(name) {
    var score = client.zscore('scores', name);

    if (!score) {
      client.zadd('scores', 0, name);
    }
    return king = {
      name: name,
      score: score
    };
  }
};


/*
var request = new XMLHttpRequest();
request.open('POST', this.props.url, true);
request.setRequestHeader('Content-Type', 'json');
request.send(name);
*/

/*

loadScoresFromServer: function() {
  var component = this;

  request = new XMLHttpRequest();
  request.open('GET', this.props.url, true);

  request.onload = function() {
    if (request.status >= 200 && request.status < 400){
      // Success!
      component.setState({
        scores: JSON.parse(request.responseText)
      });
    } else {
      // We reached our target server, but it returned an error
      console.error(component.props.url, status, err.toString());
    }
  };

  request.onerror = function() {
    // There was a connection error of some sort
    console.error(component.props.url, status, err.toString());
  };

  request.send();
}

*/
