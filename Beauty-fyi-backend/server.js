const { Ignitor } = require('@adonisjs/ignitor')
new Ignitor(require('@adonisjs/fold'))
  .appRoot(__dirname)
  .fireHttpServer()
  .catch(console.error)
const chatController = require('./App/Controllers/Ws/ChatController');
const chat = new chatController();
const encryptions = use('App/Models/Encryption');
const Hash = use('Hash')
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });
let webSockets = {}

wss.on('connection', connection = (ws, req) => {
  /*console.log(req.url)
  var userID = parseInt(req.url.substr(1), 10)
  
  console.log('connected: ' + userID + ' in ' + Object.getOwnPropertyNames(ws))
  webSockets[userID].send("testings") */
  // websocket on message
  // message type = auth
  // then add to webSockets array

  ws.on('message', incoming = (Message) => {
    const message = JSON.parse(Message)
    switch (message.type) {
      case "auth":
        authenticateUser(ws, message)
        break;
      case "directMessage":
        chat.onMessage(ws)
        break;
      default:
        break;
    }


  });


  //ws.send('something');
});

async function authenticateUser(ws, message) {
  try {
    const userID = message.userID
    const plainKey = message.plainKey
    const deviceID = message.deviceID
    console.log("userID:" + userID)

    
    const encription = await encryptions.query().where('user_id', userID).where('deviceID', deviceID).first()
    if (!encription) {//Check device key matches userID
      console.log("invalid Request")
      ws.close()
    }
    //Check If encrpytion key is the same
    const encryptedKey = encription.encryptionKey
    const isSame = await Hash.verify(plainKey, encryptedKey)
    if (!isSame) {//Invalid encryptedKey
      console.log("invalid Encryption key")
      ws.close()
    }

    console.log("Valid")
    webSockets[userID] = ws //This saves the users websocket connection to an object. They key is the userID
  } catch (error) {
    ws.close()
  }
}
