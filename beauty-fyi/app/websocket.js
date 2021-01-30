const { newWebsocketConnection } = require("@klippa/nativescript-http/websocket");
const { SecureStorage } = require("nativescript-secure-storage");
const { newAppointment } = require("./controllers/notifications/outsideApp/localNotificationController");
const secureStorage = new SecureStorage()
let ws;
exports.openWebsocketConnection = (args) => {
    newWebsocketConnection({
        url: "ws://192.168.1.208:8080",
        method: "GET",
    }, {
        // It's important to wrap callbacks in ngZone for Angular when you do anything binding related.
        // If you don't do this, Angular won't update the views.
        onClosed: (code, reason) => {
            // Invoked when both peers have indicated that no more messages will be transmitted and the connection has been successfully released.
            // No further calls to this callback will be made.
            console.log("onClosed", code, reason);
            //onFailure Connection reset = Try reconnect every 30 seconds?
        },
        onFailure: (error) => {
            // Invoked when a web socket has been closed due to an error reading from or writing to the network.
            // Both outgoing and incoming messages may have been lost. No further calls to this callback will be made.
            console.log("onFailure", error);
            //onFailure Connection reset = Try reconnect every 30 seconds?
        },
        onOpen: () => {
            // Invoked when a web socket has been accepted by the remote peer and may begin transmitting messages.
            console.log("onOpen");
        },
        onClosing: (code, reason) => {
            // Invoked when the remote peer has indicated that no more incoming messages will be transmitted.
            // This method will not be called on iOS.
            console.log("onClosing", code, reason);
        },
        onMessage: (text) => {
            //const message = JSON.parse(text)
            console.log(text)
            //switch (message.action) {
            //    case "notification":
            //        this.notificationReply((message))
            //        break;
            //}
        },
        onBinaryMessage: (data) => {
            // Invoked when a binary (type 0x2) message has been received.
            console.log("onBinaryMessage", data);
        }
    }).then(async (webSocket) => {
        authenticate(webSocket)
        ws = webSocket

        // With the webSocket object you can send messages and close the connection.
        // Receiving a WebSocket here does not mean the connection worked, you have to check onFailure and onOpen for that.
    });
}

async function authenticate(webSocket){
    const messageObject = {
        deviceID: await secureStorage.get({ key: "deviceID" }),
        plainKey: await secureStorage.get({ key: "plainKey" }),
        userID: await secureStorage.get({ key: "userID" }),
        content: "This is our first message.",
        action: "auth"
    }
    webSocket.send(JSON.stringify(messageObject))
}

exports.sendMessage = async (text) => {
    console.log("message: ", text);
    const messageObject = {
        deviceID: await secureStorage.get({ key: "deviceID" }),
        plainKey: await secureStorage.get({ key: "plainKey" }),
        userID: await secureStorage.get({ key: "userID" }),
        content: "",
        action: ""
    }
    ws.send(JSON.stringify(messageObject))
}

exports.notificationReply = async (message) =>{
    console.log("received message:", message)
    switch (message.content.notification) {
        case "newAppointment":
            newAppointment(message.content.clientName, message.content.serviceName, message.content.date, message.content.time)
            break;
    }
    const messageObject = {
        deviceID: await secureStorage.get({ key: "deviceID" }),
        plainKey: await secureStorage.get({ key: "plainKey" }),
        userID: await secureStorage.get({ key: "userID" }),
        content: "Notification reply",
        action: "notificationReply"
    }
    ws.send(JSON.stringify(messageObject))
}


exports.sendBinary = (webSocket) => {

}
exports.closeWebsocket = (webSocket) => {

}
exports.cancelWebsocket = (webSocket) => {

}