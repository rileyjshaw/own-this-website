var io = require('socket.io').listen(8000);
var redis = require('redis');
var redis_client = redis.createClient();

var newConnections = [];
var king = {
  name: 'NOBODY',
  score: 0
};

var officialScoreKeeper = setInterval(function() {
  var name = king.name;
  var i = newConnections.length;

  // Start a synchronized timer for all the new connections
  while(i--) {
    newConnections.pop().emit('updateKingInitial', king);
  }

  // Update the king's score in redis
  if (name) {
    redis_client.zincrby('scores', 1, name);
  }

  // Update the king's score locally
  king.score++;

}, 1000);

// TODO: set up publish / subscribe
// https://github.com/mranney/node_redis

redis_client.on("error", function (err) {
  console.log("Redis error: " + err);
});

function getHighScores(socket) {
  redis_client.zrevrange(['scores', 0, 9, 'WITHSCORES'], function(err, res) {
    socket.emit('updateHighScores', res);
  });
}

function changeStoredKing(name, score) {
  king = {
    name: name,
    score: score
  };
  io.sockets.emit('updateKing', king);
}

function setKing(name, socket) {
  var score;

  if(typeof name === 'string') {
    name = name.toUpperCase();

    redis_client.zscore('scores', name, function(err, res) {
      if (res === null) {
        redis_client.zadd('scores', 0, name);
        res = 0;
      }
      changeStoredKing(name, res);
    });

  } else {
    socket.emit('news', 'Your name should be a string, sneakypants.');
  }
}

io.sockets.on('connection', function(socket) {
  newConnections.push(socket);
  socket.on('setKing', function(name) {
    setKing(name, socket);
  });
  socket.on('getHighScores', function() {
    getHighScores(socket);
  });
});
