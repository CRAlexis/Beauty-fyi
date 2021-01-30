
const Observable = require("tns-core-modules/data/observable").Observable;
const navigation = require("~/controllers/navigationController")
const slideTransition = require("~/controllers/slide-transitionController");
const { sendHTTP, getHttpFile } = require("~/controllers/HTTPControllers/sendHTTP");
const inAppNotifiationAlert = require("~/controllers/notifications/inApp/notification-alert.js")
const application = require('application');
const { loadAnimation } = require("~/controllers/animationController")
source = new Observable();
let closeCallback;
let image;
var clients = [];
let row = 1;
let sendRequests = true
let serviceID;
let modalactive = false

exports.onShownModally = (args) => {
    const context = args.context;
    serviceID = context.serviceID
    closeCallback = args.closeCallback;
    const page = args.object;
    page.bindingContext = source
    if (application.android) {
        application.android.on(application.AndroidApplication.activityBackPressedEvent, backEvent);
    }
    page.on('goBack', () => {
        backEvent(args)
    })
    source.set("email", "")
    source.set("emailValidation", [false, false])


}

exports.loaded = (args) => {
    sendRequests = true
    clients = [];
    row = 1;
    modalactive = false
    this.loadClients(args)
}


function backEvent(args) { // This event is a bit funny
    args.cancel = true;
    if (application.android) {
        application.android.off(application.AndroidApplication.activityBackPressedEvent, backEvent);
    }
    closeCallback();
}

exports.selectClient = (args) => {
    if (!modalactive) {
        const page = args.object.page
        const httpParameters = { url: 'clientemailgetbool', method: 'POST', content: { serviceID: serviceID, clientID: args.object.clientID }, }
        sendHTTP(httpParameters, { display: false }, { display: false }, { display: false })
            .then((response) => {
                if (response.JSON.status == "success") {
                    application.android.off(application.AndroidApplication.activityBackPressedEvent, backEvent);
                    closeCallback(args.object.clientID)
                } else if (response.JSON.status == "enter email") {
                    displayEmailModal(args, args.object.clientID)
                } else {
                    inAppNotifiationAlert.errorMessage("An error occurred while processing your information. Please try again later.")
                    application.android.off(application.AndroidApplication.activityBackPressedEvent, backEvent);
                    //closeCallback()
                }
                console.log(response)
            }, (e) => {
                console.log(e)
            })
    }
}

async function displayEmailModal(args, clientID) {
    modalactive = true
    const page = args.object.page
    const modal = page.getViewById("emailModal")
    modal.visibility = "visible"
    modal.clientID = clientID
    loadAnimation(modal, "fade in")
    loadAnimation(page.getViewById("chooseClientSlide"), "fade out", { opacity: 0.2 })
    if (application.android) {
        application.android.off(application.AndroidApplication.activityBackPressedEvent, backEvent);
        application.android.on(application.AndroidApplication.activityBackPressedEvent, closeModal);
    }
}

exports.closeModal = (args) => {
    closeModal(args)
}

function closeModal(args) {
    args.cancel = true;
    if (modalactive) {
        const page = args.object.page
        const modal = page.getViewById("emailModal")
        loadAnimation(modal, "fade out")
        modal.visibility = "collapsed"
        modal.clientID = ""
        loadAnimation(page.getViewById("chooseClientSlide"), "fade in")
        if (application.android) {
            application.android.off(application.AndroidApplication.activityBackPressedEvent, closeModal);
            application.android.on(application.AndroidApplication.activityBackPressedEvent, backEvent);
        }
        modalactive = false
        console.log("Close modal")
    }
}

exports.appendClientAndSelect = (args) => {
    if (!source.get("emailValidation")[0]) {
        return false
    }
    console.log("validation is " + source.get("emailValidation")[0])
    const page = args.object.page
    let clientID = page.getViewById("emailModal").clientID
    const httpParameters = { url: 'clientemailappend', method: 'POST', content: { clientID: clientID, email: source.get("email") }, }
    sendHTTP(httpParameters, { display: true }, { display: false }, { display: false })
        .then((response) => {
            console.log(response.JSON)
            if (response.JSON.status == "success") {
                closeCallback(response.JSON.clientID)
            } else {
                inAppNotifiationAlert.errorMessage("Email address was saved, but was unable to create billing information. Please try again.")
                closeCallback()
            }
        }, (e) => {
            inAppNotifiationAlert.errorMessage("An error occurred while processing your information. Please try again.")
            console.log(e)
        })
}

exports.addNewClient = async (args) => {
    const mainView = args.object;
    const context = ""
    navigation.navigateToModal(context, mainView, 26, true).then(function (result) {
        if (application.android) {
            application.android.off(application.AndroidApplication.activityBackPressedEvent, backEvent);
        }
        closeCallback(result)
    })
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

exports.loadClients = (args) => {
    const page = args.object.page
    let processesedRequests = 0;
    const listView = page.getViewById("clientList");
    const httpParameters = { url: 'clientsget', method: 'POST', content: { row: row }, }
    if (sendRequests) {
        sendHTTP(httpParameters, { display: false }, { display: false }, { display: false }).then((response) => {
            if (response.JSON.status == "success") {
                const clientsArray = response.JSON.clients
                sendRequests = response.JSON.continueRequests
                console.log("continue?: " + sendRequests)
                clientsArray.forEach(element => {
                    getClientImages(element).then((result) => {

                        if (element.lastName.includes("unknown_")) {
                            clients.push(
                                {
                                    clientImage: result,
                                    clientName: element.firstName,
                                    clientID: element.clientID
                                },
                            )
                        } else {
                            clients.push(
                                {
                                    clientImage: result,
                                    clientName: element.firstName + " " + element.lastName,
                                    clientID: element.clientID
                                },
                            )
                        }
                        listView.items = [];
                        listView.items = clients;
                        processesedRequests++
                        if (processesedRequests == clientsArray.length) {
                            if (sendRequests) {
                                row++
                                try {
                                    listView.notifyAppendItemsOnDemandFinished(0, false);
                                } catch (error) {

                                }

                                /*console.log("sending next request")
                                try {
                                    this.loadClients(args, row)
                                } catch (error) {
                                    console.log(error)
                                }*/

                            } else {
                                try {
                                    listView.notifyAppendItemsOnDemandFinished(0, true);
                                } catch (error) {

                                }
                            }
                        }
                    })
                })
            } else {
            }
        }, (e) => {
            console.log(e)
        })
    } else {
        listView.notifyAppendItemsOnDemandFinished(0, true);
    }

}

function getClientImages(client) {
    return new Promise((resolve, reject) => {
        const httpParametersImages = {
            url: 'clientgetimage',
            method: 'POST',
            content: { clientID: client.clientID },
        }
        getHttpFile(httpParametersImages, { display: false }, { display: false }, { display: false }).then((result) => {
            resolve(result ? result._path : false)
        }, (e) => {
            resolve(false)
        })
    })
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