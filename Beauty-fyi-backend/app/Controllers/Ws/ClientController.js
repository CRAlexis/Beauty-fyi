'use strict'

// Controller agrees to implement the function called "respond"
module.exports.respond = function(endpoint,socket){
  // this function now expects an endpoint as argument

  socket.on('news',function(newsreel){

      // as is proper, protocol logic like
      // this belongs in a controller:

      endpoint.emit(newsreel); // broadcast news to everyone subscribing
                                   // to our endpoint/namespace
  });
}

class ClientController {
  constructor ({ socket, request }) {
    this.socket = socket
    this.request = request
  }
}

module.exports = ClientController
