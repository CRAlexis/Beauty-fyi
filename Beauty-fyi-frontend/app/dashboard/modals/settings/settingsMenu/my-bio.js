const Observable = require("tns-core-modules/data/observable").Observable;
const animation = require("~/controllers/animationController").loadAnimation;
const { sendHTTP, sendHTTPFile, getHttpFile } = require("~/controllers/HTTPControllers/sendHTTP");
const { Builder } = require("@nativescript/core/ui/builder")
const application = require('application');
let closeCallback;
let pageStateChanged;

exports.onShownModally = function (args) {
    const context = args.context;
    closeCallback = args.closeCallback;
    const page = args.object;
    page.bindingContext;
    //var myComponentInstance = Builder.load({
    //    path: "~/dashboard/modals/settings/settingsMenu",
    //    name: "load-into-here"
    //});
    const httpParameters = {url: 'bioget',method: 'POST', content: {},}
    sendHTTP(httpParameters, { display: false }, { display: false }, { display: false })
        .then((response) => {
            if (response.JSON.status == "success") {
                page.getViewById("myBio").text = response.JSON.bio
            }else{
                console.log("This user does not have a bio")
            }
        }, (e) => {
            console.log(e)
        })
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
            setTimeout(()=>{
                object.text = "save"
            }, 3000)
        })
}

function sendTestRequest(args) {
    const mPicker = require("nativescript-mediafilepicker");
    const mediafilepicker = new mPicker.Mediafilepicker();
    const page = args.object.page


    let maxNumberFiles = 2
    let options = {
        android: {
            isCaptureMood: false, // if true then camera will open directly.
            isNeedCamera: true,
            maxNumberFiles: maxNumberFiles,
            isNeedFolderList: true
        }, ios: {
            isCaptureMood: false, // if true then camera will open directly.
            isNeedCamera: true,
            maxNumberFiles: maxNumberFiles
        }
    };
    mediafilepicker.openVideoPicker(options);
    mediafilepicker.on("getFiles", function (res) {
        let results = res.object.get('results');
        console.log(results)
        console.log("file:" + results[0].file)
        const httpParametersPicture = {
            url: "test",
            method: 'POST',
            description: "Creating new service",
            file: {
                name: "photo[]",
                filename: results[0].file,
                mimeType: "video/mp4"
            },
            file2: {
                name: "video[]",
                filename: results[1].file,
                mimeType: "video/mp4"
            },
            content: {
                myContent: "This is my content"
            }
        }
        sendHTTPFile(httpParametersPicture, { display: true }, { display: true }, { display: true }).then((result) => {
            console.log(result)
            resolve()
        }, (error) => {
            console.log(error)
            reject()
        })
    })

}