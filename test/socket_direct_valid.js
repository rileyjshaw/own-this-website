// make new socket
// - should connect
// click h2 on client 1
// type on client 1
// hit enter on client 1
// - socket should send
// - socket should return on client 1
// - name should update on client 1
// make new socket
// - should recieve correct name on client 2
// click h2 on client 2
// type on client 2
// click button on client 2
// - socket should send
// - socket should return on client 1
// - name should update on client 1
// - socket should return on client 2
// - name should update on client 2

var should = require('should');
var io = require('socket.io-client');

var socketURL = 'http://localhost:8000';

var options = {
  transports: ['websocket'],
  'force new connection': true
};

describe("Direct emission with valid input",function(){
  it('should connect when a new client joins', function(done){
    var numChanges = 0;

    var client1 = io.connect(socketURL, options);

    client1.on('connect', function(data){
      client1.emit('setKing', 'client1');

      /* Since first client is connected, we connect
      the second client. */
      var client2 = io.connect(socketURL, options);

      client2.on('connect', function(data){
        client2.emit('connection name', chatUser2);
      });

      client2.on('new user', function(usersName){
        usersName.should.equal(chatUser2.name + " has joined.");
        client2.disconnect();
      });

    });


    client1.on('updateKing', function(usersName){
      numUsers += 1;

      if(numUsers === 2){
        usersName.should.equal(chatUser2.name + " has joined.");
        client1.disconnect();
        done();
      }
    });
  });
});
