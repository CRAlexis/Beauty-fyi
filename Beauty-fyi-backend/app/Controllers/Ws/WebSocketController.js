'use strict'
const UserMessage = use('App/Models/UserMessage')
const encryptions = use('App/Models/Encryption');
const Hash = use('Hash')
class WebSocketController {

  constructor() {
    this.webSockets = {};
  }

  authenticateUser(ws, message) {
    return new Promise(async (resolve, reject) => {
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
        this.webSockets[userID] = ws //This saves the users websocket connection to an object. They key is the userID
        this.webSockets[userID].send("You are authenticated")
        resolve(userID)
      } catch (error) {
        console.log(error)
        reject()
        //ws.close()
      }
    })
  };

  async onMessage(ws, message) {


    let id = message.id ? message.id : null
    let fromUserId = message.fromUserID
    let toUserId = message.toUserID
    let type = message.type
    let plainKey = message.plainKey
    let deviceID = message.deviceID
    let content = message.content
    let action = message.action
    let randomCode = message.randomCode ? message.randomCode : null
    //Check plainKey and deviceID

    //Checking what type of message it is and altering the correct database
    /*if(type==="plain"){
      if(action==="add"){
        this.addToUserMessages(ws, fromUserId, toUserId, content)
      }
      if(action==="delete"){
        this.deleteFromUserMessages(ws, id, fromUserId, toUserId, content)
      }
    }
    if(type==="binary"){
      if(action==="add"){
        this.addToMedia(ws, fromUserId, toUserId, content)
      }
      if(action==="delete"){
        this.deleteFromMedia(ws, id, fromUserId, toUserId, content)
      }
    }*/

    /*
    async addToUserMessages(ws, fromUserId, toUserId, content){
      UserMessage
      // Add User Message
      const userMessage =  await UserMessage.create({
        firstName: FirstName,
        lastName: LastName,
        email: Email,
        password: Password,
        phoneNumber: PhoneNumber
        //accountType: request.input('accountType'),
        //confirmation_token: randomString({ length: 40 })
      })
  
      var obj = {"id":1, "fromUserID":30, "toUserId":42 }
      ws.send(JSON.stringify(obj));
    }
    async deleteFromUserMessages(ws, id, fromUserId, toUserId, content){
  
    }
    async addToMedia(ws, fromUserId, toUserId, content){
  
    }
    async deleteFromMedia(ws, id, fromUserId, toUserId, content){
  
    }
  */
  }

  async sendMessage(message, userID) {
    /*const messageObject = {
      content: message.content,
      action: message.action,
    }*/

    this.webSockets[userID].send(JSON.stringify(message))
    // Update in database that we are waiting for a reply on the notification that we just sent
  }

  async onNotoficationReply(ws, message) {
    const userID = message.userID
    console.log("recieved notificated reply: " + message)
  }

}



//var websocketController = new WebSocketController(); // this is crucial, one instance is created and cached by Node
module.exports =  new WebSocketController();
