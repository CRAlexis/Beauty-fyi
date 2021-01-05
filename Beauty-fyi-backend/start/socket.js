const { setTimeout } = require('timers');

const server = require('http').createServer();

var controller = use('App/Controllers/ws/ChatController');
const io = require('socket.io')(server);

/*io.on('connection', client => {
  client.on('event', data => {  });
  client.on('disconnect', () => { });
});*/
var chat = io
  .of('/chat')
  .on('connection', function (socket) {
      controller.respond(chat,socket);
  });


server.listen(3333);

