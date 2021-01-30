const { Ignitor } = require('@adonisjs/ignitor')
new Ignitor(require('@adonisjs/fold'))
  .appRoot(__dirname)
  .fireHttpServer()
  .catch(console.error)
const Helpers = use('Helpers')
const WebSocket = require('ws');
const webSocketController = require(Helpers.appRoot() + '/App/Controllers/Ws/WebSocketController');

const wss = new WebSocket.Server({ port: 8080 });
let webSockets = {}

wss.on('connection', connection = (ws, req) => {
  ws.on('message', incoming = (Message) => {
    const message = JSON.parse(Message)
    switch (message.action) {
      case "auth":
        
        webSocketController.authenticateUser(ws, message).then((userID) => {
          console.log("userid 2: " + userID)
          webSockets[userID] = ws
        })
        break;
      case "directMessage":
        if (message.userID in webSockets) {
          webSocketController.onMessage(ws, message)
        }
        break;
      case "notificationReply":
        if (message.userID in webSockets) {
          webSocketController.onNotoficationReply(ws, message)
        }
        break;
    }
  });
})

wss.on('close', function close() {
 
});

exports.test = (args) => {
  
}

