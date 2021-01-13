const { Ignitor } = require('@adonisjs/ignitor')

new Ignitor(require('@adonisjs/fold'))
   .appRoot(__dirname)
   .fireHttpServer()
   .catch(console.error)

var chatController = require('./App/Controllers/Ws/ChatController');
var chat = new chatController();

const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    chat.onMessage(ws, JSON.parse(message))
  });

  ws.send('something');
});

