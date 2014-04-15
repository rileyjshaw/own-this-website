// NOTE: We'll have to make new socket connections to avoid disconnecting

var should = require('should');
var io = require('socket.io-client');

var socketURL = 'http://localhost:8000';

var namesBadType = [4, undefined, null, {}, [], new Error];
var namesBadLength = ['13 CHARACTERS', 'BROKENWHEELBARROW', 'F3EDF440E76CA97E78D7BAF527D9ADA4C25AAAEC1A0262C4273461AAD0C85905F3EDF440E76CA97E78D7BAF527D9ADA4C25AAAEC1A0262C4273461AAD0C85905F3EDF440E76CA97E78D7BAF527D9ADA4C25AAAEC1A0262C4273461AAD0C85905F3EDF440E76CA97E78D7BAF527D9ADA4C25AAAEC1A0262C4273461AAD0C85905F3EDF440E76CA97E78D7BAF527D9ADA4C25AAAEC1A0262C4273461AAD0C85905F3EDF440E76CA97E78D7BAF527D9ADA4C25AAAEC1A0262C4273461AAD0C85905F3EDF440E76CA97E78D7BAF527D9ADA4C25AAAEC1A0262C4273461AAD0C85905F3EDF440E76CA97E78D7BAF527D9ADA4C25AAAEC1A0262C4273461AAD0C85905F3EDF440E76CA97E78D7BAF527D9ADA4C25AAAEC1A0262C4273461AAD0C85905F3EDF440E76CA97E78D7BAF527D9ADA4C25AAAEC1A0262C4273461AAD0C85905F3EDF440E76CA97E78D7BAF527D9ADA4C25AAAEC1A0262C4273461AAD0C85905F3EDF440E76CA97E78D7BAF527D9ADA4C25AAAEC1A0262C4273461AAD0C85905F3EDF440E76CA97E78D7BAF527D9ADA4C25AAAEC1A0262C4273461AAD0C85905F3EDF440E76CA97E78D7BAF527D9ADA4C25AAAEC1A0262C4273461AAD0C85905F3EDF440E76CA97E78D7BAF527D9ADA4C25AAAEC1A0262C4273461AAD0C85905F3EDF440E76CA97E78D7BAF527D9ADA4C25AAAEC1A0262C4273461AAD0C85905F3EDF440E76CA97E78D7BAF527D9ADA4C25AAAEC1A0262C4273461AAD0C85905F3EDF440E76CA97E78D7BAF527D9ADA4C25AAAEC1A0262C4273461AAD0C85905F3EDF440E76CA97E78D7BAF527D9ADA4C25AAAEC1A0262C4273461AAD0C85905F3EDF440E76CA97E78D7BAF527D9ADA4C25AAAEC1A0262C4273461AAD0C85905'];
var nameBadCaps = ['aLt CaPs'];

var options = {
  transports: ['websocket'],
  'force new connection': true
};

function testArray(done, array, errorMsg) {
  var client;
  if(array == false) {
    done();
  } else {
    client = io.connect(socketURL, options);
    client.on('connect', function(data){
      client.on('news', function(message){
        message.should.equal(errorMsg);
        client.disconnect();
        testArray(done, array, errorMsg);
      });
      client.emit('setKing', array.pop());
    });
  }
}

describe("Direct invalid input",function(){
  it('should log a message when non-string names are passed', function(done){
    testArray(done, namesBadType, 'Your name should be a string, sneakypants.');
  });

  it('should log a message when long names (> 12 char) are passed', function(done){
    testArray(done, namesBadLength, 'Your name can\'t be more than 12 characters, greedyguts.');
  });

  it('should log a message when lowercase names are passed', function(done){
    testArray(done, nameBadCaps, 'How did those lowercases get in there? Something\'s fishy...');
  });

  it('should log a message when current king is passed', function(done){
    var client = io.connect(socketURL, options);
    client.on('connect', function(data){
      client.on('news', function(message){
        message.should.equal('You\'re already the king. Chill out!');
        client.disconnect();
        done();
      });
      client.on('updateKingInitial', function(king) {
        var name = 'DUPLICATE';
        if(name === king.name) {
          name = 'DUPLICATED';
        }
        client.emit('setKing', name);
        setTimeout(function(){client.emit('setKing', name)}, 1000);
      });
    });
  });

  it('should log a message when user is spamming', function(done){
    var newsCount = 0;
    var client = io.connect(socketURL, options);
    client.on('connect', function(data){
      client.on('news', function(message){
        newsCount++;
        if (newsCount === 1) {
          message.should.equal('It looks like you\'re sending a lot of requests... you aren\'t cheating, are you?');
        } else {
          message.should.equal('There\'s too much traffic from your computer; refresh to reconnect!');
          client.disconnect();
          done();
        }
      });
    });
    for(var i = 0; i < 8; i++) {
      client.emit('setKing', 'SPAMMY' + i);
    }
  });
});

// TODO: Test disconnects