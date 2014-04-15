var should = require('should');
var io = require('socket.io-client');

var socketURL = 'http://localhost:8000';

var options = {
  transports: ['websocket'],
  'force new connection': true
};

describe("Direct valid input",function(){
  it('should allow connections to setKing and update accordingly', function(done){
    var numChanges = 0;

    var client1 = io.connect(socketURL, options);

    client1.on('connect', function(data){
      client1.emit('setKing', 'CLIENT1');

      var client2 = io.connect(socketURL, options);
      client2.on('connect', function(data){
        client2.on('updateKingInitial', function(king) {
          king.name.should.equal('CLIENT1');
          client2.emit('setKing', 'CLIENT2');
          client2.disconnect();
        });
      });

      client1.on('updateKing', function(king){
        if(++numChanges === 2) {
          king.name.should.equal('CLIENT2');
          client1.disconnect();
          done();
        }
      });
    });

  });
});
