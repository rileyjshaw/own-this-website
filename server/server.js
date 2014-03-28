var
io = require('socket.io').listen(8000),
redis = require('redis'),
redis_client = redis.createClient(),
king = {
  name: 'Nobody',
  score: 0
},
officialScoreKeeper = setInterval(function() {
  var name = king.name;
  if (name) {
    redis_client.zincrby('scores', 1, king.name);
  }
}, 1000);

// TODO: set up publish / subscribe
// https://github.com/mranney/node_redis

redis_client.on("error", function (err) {
  console.log("Redis error " + err);
});

function getHighScores() {
  return redis_client.zrange('scores', 0, 9, true) // WITHSCORES is true
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

io.sockets.on('connection', function (socket) {
  socket.emit('updateKing', king);
  socket.on('setKing', function (name) {
    setKing(name, socket);
  });
});
