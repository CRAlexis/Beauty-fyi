const { newWebsocketConnection } = require("@klippa/nativescript-http/websocket");
exports.openWebsocketConnection = (args) => {
    //newWebsocketConnection({
    //    url: "ws://192.168.1.12:3333",
    //    method: "GET",
    //}, {
    //    // It's important to wrap callbacks in ngZone for Angular when you do anything binding related.
    //    // If you don't do this, Angular won't update the views.
    //    onClosed: (code, reason) => {
    //        // Invoked when both peers have indicated that no more messages will be transmitted and the connection has been successfully released.
    //        // No further calls to this callback will be made.
    //        console.log("onClosed", code, reason);
    //    },
    //    onFailure: (error) => {
    //        // Invoked when a web socket has been closed due to an error reading from or writing to the network.
    //        // Both outgoing and incoming messages may have been lost. No further calls to this callback will be made.
    //        console.log("onFailure", error);
    //    },
    //    onOpen: () => {
    //        // Invoked when a web socket has been accepted by the remote peer and may begin transmitting messages.
    //        console.log("onOpen");
    //    },
    //    onClosing: (code, reason) => {
    //        // Invoked when the remote peer has indicated that no more incoming messages will be transmitted.
    //        // This method will not be called on iOS.
    //        console.log("onClosing", code, reason);
    //    },
    //    onMessage: (text) => {
    //        // Invoked when a text (type 0x1) message has been received.
    //        console.log("onMessage", text);
    //    },
    //    onBinaryMessage: (data) => {
    //        // Invoked when a binary (type 0x2) message has been received.
    //        console.log("onBinaryMessage", data);
    //    }
    //}).then((webSocket) => {
    //    console.log(webSocket)
    //   
    //    exports.sendMessage = (webSocket) => {
//
    //    }
    //    exports.sendBinary = (webSocket) => {
//
    //    }
    //    exports.closeWebsocket = (webSocket) => {
//
    //    }
    //    exports.cancelWebsocket = (webSocket) => {
//
    //    }
    //    // With the webSocket object you can send messages and close the connection.
    //    // Receiving a WebSocket here does not mean the connection worked, you have to check onFailure and onOpen for that.
    //});
}