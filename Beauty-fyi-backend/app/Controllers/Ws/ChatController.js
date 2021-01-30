'use strict'
const UserMessage = use('App/Models/UserMessage')

class ChatController {

  async onMessage(ws, message){


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
  }
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

module.exports = ChatController
