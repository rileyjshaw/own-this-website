var io = require('socket.io').listen(8000);
var redis = require('redis');
var redis_client = redis.createClient();

var newConnections = [];
var ipSpamChecker = {};
var socketSpamChecker = {};

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

  // Clear the spam checker
  ipSpamChecker = {};
  socketSpamChecker = {};
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
  var ipSpamCount = ipSpamChecker[socket.ipAddress];
  var socketSpamCount = socketSpamChecker[socket.id];

  // Check for spamming from a single socket (warning at > 5 / second)
  if(!socketSpamCount) {
    socketSpamChecker[socket.id] = 1;
  } else if(socketSpamCount > 5) {
    if(socket.socketWarningFlag) {
      socket.emit('news', 'There\'s too much traffic from your computer; refresh to reconnect!');
      socket.disconnect();
    } else {
      socket.socketWarningFlag = 1;
      socket.emit('news', 'It looks like you\'re sending a lot of requests... you aren\'t cheating, are you?');
    }
  } else ++socketSpamChecker[socket.id];

  // Check for spamming from a single IP address (warning at > 400 / second)
  if(!ipSpamCount) {
    ipSpamChecker[socket.ipAddress] = 1;
  } else if(++ipSpamCount > 400) {
    if(socket.ipWarningFlag) {
      socket.emit('news', 'There\'s too much traffic from your network; refresh to reconnect!');
      socket.disconnect();
    } else {
      socket.ipWarningFlag = 1;
      socket.emit('news', 'It looks like you\'re sending a lot of requests... you aren\'t cheating, are you?');
    }
  } else ++ipSpamChecker[socket.ipAddress];

  if(typeof name !== 'string') {
    socket.emit('news', 'Your name should be a string, sneakypants.');
    socket.superStrikes++;
  } else if(name.length > 12) {
    socket.emit('news', 'Your name can\'t be more than 12 characters, greedyguts.');
    socket.superStrikes++;
  } else if(name !== name.toUpperCase()) {
    socket.emit('news', 'How did those lowercases get in there? Something\'s fishy...');
    socket.superStrikes++;
  } else if(name === king.name) {
    socket.emit('news', 'You\'re already the king. Chill out!');
    socket.superStrikes += 0.2;
  } else {
    redis_client.zscore('scores', name, function(err, res) {
      if (res === null) {
        redis_client.zadd('scores', 0, name);
        res = 0;
      }
      changeStoredKing(name, res);
    });
  }

  if(socket.superStrikes >= 3) {
    socket.disconnect();
  }
}

io.sockets.on('connection', function(socket) {
  socket.superStrikes = 0;
  socket.ipAddress = socket.handshake.address.address;
  newConnections.push(socket);
  socket.on('setKing', function(name) {
    setKing(name, socket);
  });
  socket.on('getHighScores', function() {
    getHighScores(socket);
  });
});
