
const Observable = require("tns-core-modules/data/observable").Observable;
const { sendHTTP, sendHTTPFile } = require("~/controllers/HTTPControllers/sendHTTP");
const application = require('application');
let closeCallback;
let pageStateChanged;
let image;

exports.onShownModally = function (args) {
    const context = args.context;
    closeCallback = args.closeCallback;
    const page = args.object;
    page.bindingContext = source
}

exports.loaded = (args) => {
    const page = args.object.page
    image = null
    source = new Observable();
    source.set("firstName", "")
    source.set("firstNameValidation", [false, false])
    source.set("lastName", "")
    source.set("lastNameValidation", [false, false])
    source.set("email", "")
    source.set("emailValidation", [false, false])
    source.set("phoneNumber", "")
    source.set("phoneNumberValidation", [false, false])
    source.set("password", "")
    source.set("passwordValidation", [false, false])
    source.set("checkBox", "false")
    if (application.android) {
        application.android.on(application.AndroidApplication.activityBackPressedEvent, backEvent);
    }
    pageStateChanged = false;
}

exports.exit = (args) => { backEvent(args) }

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

exports.selectPhoto = (args) => {
    const mPicker = require("nativescript-mediafilepicker");
    const mediafilepicker = new mPicker.Mediafilepicker();
    const page = args.object.page

    let options = {
        android: {
            isCaptureMood: false, // if true then camera will open directly.
            isNeedCamera: true,
            maxNumberFiles: 1,
            isNeedFolderList: true
        }, ios: {
            isCaptureMood: false, // if true then camera will open directly.
            isNeedCamera: true,
            maxNumberFiles: 1
        }
    };

    mediafilepicker.openImagePicker(options);
    mediafilepicker.on("getFiles", function (res) {
        let results = res.object.get('results');
        image = results[0].file
        console.log(results)
        console.log(image)
        page.getViewById("clientImage").src = image
        page.getViewById("clientImage").visibility = "visible"
        page.getViewById("clientImageAvatar").visibility = "collapsed"
    })
}

exports.createClient = (args) => {
    if (!validation()) {
        return
    }
    createClientWithPicture(args)
}

function createClientWithPicture(args){
    const page = args.object.page
    const clientNotes = page.getViewById("clientNotes").text // get data
    const addressLineOne = page.getViewById("addressLineOne").text // get data
    const addressLineTwo = page.getViewById("addressLineTwo").text // get data
    const postCode = page.getViewById("postCode").text // get data
    const cityTown = page.getViewById("cityTown").text // get data
    let files = []
    if (image){
        files = [
            {
                name: "photo[]",
                filename: image,
                mimeType: "image/jpeg"
            }
        ]
    }
    const httpParametersPicture = {
        url: "createclientwithimage",
        method: 'POST',
        description: "Adding client",
        file: files,
        content: {
            firstName: source.get("firstName"),
            lastName: source.get("lastName"),
            emailAddress: source.get("email"),
            phoneNumber: source.get("phoneNumber"),
            clientNotes: clientNotes,
            addressLineOne: addressLineOne,
            addressLineTwo: addressLineTwo,
            postCode: postCode,
            cityTown: cityTown,
        }
    }
    sendHTTPFile(httpParametersPicture, { display: false }, { display: false }, { display: true }).then((result) => {
        console.log(result)
        let userID = result.JSON.userID
        console.log("User ID in add client: " + userID)
        closeCallback(userID)
    }, (error) => {

    })
}

exports.showAddressDetails = (args) => {
    const object = args.object
    const page = object.page
    try {
        if (page.getViewById("addressDetails").visibility == "collapse") {
            page.getViewById("addressDetails").visibility = "visible"
            object.getChildAt(0).color = "black"
            object.getChildAt(1).visibility = "collapsed"
            object.getChildAt(2).visibility = "visible"
        } else {
            page.getViewById("addressDetails").visibility = "collapsed"
            object.getChildAt(0).color = "gray"
            object.getChildAt(1).visibility = "visible"
            object.getChildAt(2).visibility = "collapsed"
        }
    } catch (error) {
        console.log(error)
    }
}

exports.firstNameInput = (args) => {
    setTimeout(() => {
        var regExCheck = /^[a-zA-Z_]*$/;
        if (source.get("firstName").length == 0) { source.set("firstNameValidation", [false, false]); return }
        if (!source.get("firstName").trim().match(regExCheck)) {
            source.set("firstNameValidation", [false, true])
        } else {
            source.set("firstNameValidation", [true, true])
        }
    }, 100)
}

exports.lastNameInput = (args) => {
    setTimeout(() => {
        var regExCheck = /^[a-zA-Z_]*$/;
        if (source.get("lastName").length == 0) { source.set("lastNameValidation", [false, false]); return }
        if (!source.get("lastName").trim().match(regExCheck)) {
            source.set("lastNameValidation", [false, true])
        } else {
            source.set("lastNameValidation", [true, true])
        }
    }, 100)
}

exports.emailInput = (args) => {
    setTimeout(() => {
        const httpParameters = {
            url: 'isemailavailable',
            method: 'POST',
            content: { email: source.get("email") },
        }
        var regExCheck = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;;
        if (source.get("email").length == 0) { source.set("emailValidation", [false, false]); return }
        if (!source.get("email").trim().match(regExCheck)) {
            source.set("emailValidation", [false, true])
        } else {
            sendHTTP(httpParameters)
                .then((response) => {
                    if (response.JSON.emailAvailable) {
                        source.set("emailValidation", [true, true])
                    } else {
                        source.set("emailValidation", [false, true])
                    }
                }, (e) => {
                    source.set("emailValidation", [false, true])
                })

        }
    }, 100)
}

exports.phoneNumberInput = (args) => {
    const httpParameters = {
        url: 'isphonenumberavailable',
        method: 'POST',
        content: { phoneNumber: source.get("phoneNumber") },
    }
    setTimeout(() => {
        if (source.get("phoneNumber").length == 0) { source.set("phoneNumberValidation", [false, false]); return }
        if (source.get("phoneNumber").length < 9) {
            source.set("phoneNumberValidation", [false, true])
        } else {
            sendHTTP(httpParameters)
                .then((response) => {
                    if (response.JSON.phoneNumberAvailable) {
                        source.set("phoneNumberValidation", [true, true])
                    } else {
                        source.set("phoneNumberValidation", [false, true])
                    }
                }, (e) => {
                    source.set("phoneNumberValidation", [false, true])
                })
        }
    }, 100)
}


function validation() {

    if (source.get("firstNameValidation")[0] &&
        source.get("lastNameValidation")[0] &&
        source.get("emailValidation")[0] &&
        source.get("firstName") &&
        source.get("lastName")) {
        return true
    } else {
        let validationError = {
            title: "Error",
            message: "Please correct the form",
            okButtonText: "OK"
        };
        alert(validationError)
    }
}