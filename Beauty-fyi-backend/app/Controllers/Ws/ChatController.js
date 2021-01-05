'use strict'

module.exports.respond = function(socket_io){
  console.log("true")
  // this function expects a socket_io connection as argument

  // now we can do whatever we want:
  socket_io.on('news',function(newsreel){

      // as is proper, protocol logic like
      // this belongs in a controller:

      socket.broadcast.emit(newsreel);
  });
}

class ChatController {
  constructor ({ socket, request }) {
    this.socket = socket
    this.request = request

  }
  onMessage (message) {
    console.log(message)
    this.socket.broadcastToAll('message', "Hello User")
    // same as: socket.on('message')
  }

  onNewUser(){
    console.log('Websocket User: ')
  }
  onOpen(){
    console.log('Hello User')
  }

  onClose () {
    // same as: socket.on('close')
  }

  onError (error) {
    console.log('Websocket Error: ' + error)
    // same as: socket.on('error')
  }
}

module.exports = ChatController
