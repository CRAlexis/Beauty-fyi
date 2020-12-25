const Observable = require("tns-core-modules/data/observable").Observable;
const animation = require("~/controllers/animationController").loadAnimation;
const sendHTTP = require("~/controllers/HTTPControllers/sendHTTP").sendHTTP;
let closeCallback;


exports.onShownModally = function (args) {
    const context = args.context;
    closeCallback = args.closeCallback;
    const page = args.object;
    page.bindingContext;
}

exports.goBack = (args) =>{
    closeCallback()
}

exports.save = (args) => {
    const object = args.object
    const page = object.page;
    object.text = "saving..."
    const content = JSON.stringify({
        //name: page.getViewById("nameTextField").text
    })
    const httpParameters = {
        url: 'http://192.168.1.12:3333/scheduleavailabilityday',
        method: 'GET',
        //content: content,
    }
    sendHTTP(httpParameters)
        .then((response) => {
            object.text = "saved"
            console.log(response)
        }, (e) => {
            console.log(e)
            object.text = "error, try again"
        })
}