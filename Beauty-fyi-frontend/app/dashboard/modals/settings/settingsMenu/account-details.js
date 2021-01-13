const Observable = require("tns-core-modules/data/observable").Observable;
const animation = require("~/controllers/animationController").loadAnimation;
const sendHTTP = require("~/controllers/HTTPControllers/sendHTTP").sendHTTP;
const application = require('application');
let closeCallback;
let pageStateChanged;

exports.onShownModally = function (args) {
    const context = args.context;
    closeCallback = args.closeCallback;
    const page = args.object;
    page.bindingContext;
}

exports.loaded = (args) => {
    const page = args.object.page
    if (application.android) {
        application.android.on(application.AndroidApplication.activityBackPressedEvent, backEvent);
    }
    page.on('goBack', () => {
        backEvent(args)
    })
    pageStateChanged = false;
}

exports.goBack = (args) => {
    backEvent(args)
}

function backEvent(args) { // This event is a bit funny
    const inAppNotifiationAlert = require("~/controllers/notifications/inApp/notification-alert.js")
    args.cancel = true;
    if (pageStateChanged) {
        inAppNotifiationAlert.areYouSure("Are you sure?", "Some information may not be saved if you leave.").then(function (result) {
            console.log(result)
            if (result) {
                if (application.android) {
                    application.android.off(application.AndroidApplication.activityBackPressedEvent, backEvent);
                }
                closeCallback();
            }
        })
    } else {
        if (application.android) {
            application.android.off(application.AndroidApplication.activityBackPressedEvent, backEvent);
        }
        closeCallback();
    }
}

exports.changePageState = (args) => {
    pageStateChanged = true
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
            pageStateChanged = false
            console.log(response)
        }, (e) => {
            console.log(e)
            object.text = "error, try again"
        })
}