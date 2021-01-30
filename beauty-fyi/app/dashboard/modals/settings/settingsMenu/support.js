const Observable = require("tns-core-modules/data/observable").Observable;
const animation = require("~/controllers/animationController").loadAnimation;
const { sendHTTP } = require("~/controllers/HTTPControllers/sendHTTP");
const application = require('application');
let closeCallback;
let pageStateChanged;

exports.onShownModally = function (args) {
    closeCallback = args.closeCallback;
    const page = args.object.page
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

function backEvent(args) { // This event is a bit funny
    const inAppNotifiationAlert = require("~/controllers/notifications/inApp/notification-alert.js")
    args.cancel = true;
    if (pageStateChanged) {
        inAppNotifiationAlert.areYouSure("Are you sure?", "Some information may not be saved if you leave.").then(function (result) {
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


exports.save = (args) => {
    const object = args.object
    const page = args.object.page;
    object.text = "Saving..."

    const content = {
        bio: page.getViewById("myBio").text
    }
    const httpParameters = {
        url: 'bio',
        method: 'POST',
        content: content,
    }
    sendHTTP(httpParameters)
        .then((response) => {
            console.log(response)
            object.text = "Saved"
            pageStateChanged = false
        }, (e) => {
            console.log(e)
            object.text = "Error, try again"
            setTimeout(() => {
                object.text = "save"
            }, 3000)
        })
}

