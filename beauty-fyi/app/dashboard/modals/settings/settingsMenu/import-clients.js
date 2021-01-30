const Observable = require("tns-core-modules/data/observable").Observable;
const animation = require("~/controllers/animationController").loadAnimation;
const { sendHTTP, sendHTTPFile, getHttpFile } = require("~/controllers/HTTPControllers/sendHTTP");
const Contacts = require("nativescript-contacts-lite");
const application = require('application');
const { httpRequestLoading, httpRequestFinished, dismissAlert } = require("~/controllers/notifications/inApp/notification-alert");
const navigation = require("~/controllers/navigationController")
let closeCallback;
let pageStateChanged;
let contacts
let contactArray = []
let clientsToImport = []

exports.onShownModally = function (args) {
    let desiredFields = ['display_name', 'phone', 'email', 'address'];
    const page = args.object.page
    Contacts.getContacts(desiredFields).then((result) => {
        contacts = result
        displayClientsOnPage(args, contacts)
    }, (e) => { console.log(e); });

    const context = args.context;
    closeCallback = args.closeCallback;


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

function displayClientsOnPage(args, contacts) {
    const page = args.object.page
    let index = 0
    contacts.forEach(element => {
        if (index) {
            let emailContext = ""
            let phoneNumberContext = ""
            let phoneNumber
            let email
            try {
                if (element.email) {
                    let checkArray = []
                    element.email.forEach(element => {
                        checkArray.push(element.address)
                    })
                    checkArray = checkArray.filter(checkEmail);
                    checkArray.forEach(element => {
                        emailContext += element + ","
                    })
                    email = checkArray[0]
                }
            } catch (error) {
                //console.log(error)
            }
            if (element.phone) {
                let i = 0
                let checkArray = []
                element.phone.forEach(element => {
                    if (element.phone) { checkArray.push(element.phone.replace(/\s/g, '')) }
                    if (element.number) { checkArray.push(element.number.replace(/\s/g, '')) }
                    if (i == 0) { phoneNumber = element.phone ? element.phone.replace(/\s/g, '') : element.number.replace(/\s/g, '') }
                    i++
                })

                checkArray = checkArray.filter(onlyUnique);
                checkArray.forEach(element => {
                    phoneNumberContext += element + ","
                })
            }

            contactArray.push({
                clientID: element.contact_id,
                //clientImage: element.thumbnail,
                clientName: element.display_name,
                emailContext: emailContext.slice(0, -1),
                phoneNumberContext: phoneNumberContext.slice(0, -1),
                email: email ? email : "no email found",
                phoneNumber: phoneNumber
            })
        }
        if (index == contacts.length - 1) {
            try {

                contactArray.sort((a, b) => a.clientName.localeCompare(b.clientName))
                index2 = 0
                contactArray.forEach(element => {
                    contactArray[index2].index = index2
                    index2++
                })
                page.getViewById("clientList").items = contactArray
            } catch (error) {
                console.log(eror)
            }
        }
        index++
    })
}


exports.checkBoxTapped = (args) => {
    const checkbox = args.object
    const page = args.object.page
    checkbox.isEnabled = false
    setTimeout(() => {
        const index = checkbox.index
        const clientID = checkbox.clientID
        console.log("checked: " + checkbox.checked, "index: " + index)
        if (!checkbox.checked) {
            let i = 0
            clientsToImport.forEach(element => {
                if (element.clientID == clientID) {
                    clientsToImport.splice(i, 1)
                }
                i++
            })
            clientsToImport.push(contactArray[index])
            checkbox.isEnabled = true
            checkbox.checked = true
            animation(checkbox.parent.parent.getChildAt(1), "expand section down", { height: 90 })
            animation(checkbox.parent.parent.getChildAt(1), "fade in")
        } else {
            let i = 0
            clientsToImport.forEach(element => {
                if (element.clientID == clientID) {
                    clientsToImport.splice(i, 1)
                    checkbox.isEnabled = true
                    checkbox.checked = false
                    animation(checkbox.parent.parent.getChildAt(1), "expand section down", { height: 1 })
                    animation(checkbox.parent.parent.getChildAt(1), "fade out")
                }
                i++
            })
        }
        page.getViewById("importButton").text = "Import clients (" + clientsToImport.length + ")"
    }, 125)
}

exports.importClients = (args) => {
    const object = args.object
    const page = args.object.page;
    let clients = []
    clientsToImport.forEach(element => {
        clients.push({
            clientID: element.clientID,
            clientName: element.clientName,
            email: element.email,
            phoneNumber: element.phoneNumber
        })
    })
    const httpParameters = {
        url: 'createbulkclientwithimage',
        method: 'POST',
        content: {
            clients: clients
        },
    }
    
    sendHTTP(httpParameters, {display: true}, {display: false}, {display: true, title: null, message: "Unable to import clients"})
        .then((response) => {
            if (response.JSON.clientsImported == 1){
                httpRequestFinished("Success", response.JSON.clientsImported + " client imported successfully!").then((alert) => { })
            }else{
                httpRequestFinished("Success", response.JSON.clientsImported + " clients imported successfully!").then((alert) => { })
            }
        }, (e) => {

        })
}

exports.dropDownClicked = (args) => {
    const mainView = args.object;
    const index = mainView.index
    let context = mainView.optionContext.split(",")
    navigation.navigateToModal({ context: context, meta: null }, mainView, 4, false).then((result) => {
        if (result.text) {
            args.object.text = result.text
            if (args.object.element == "email") {
                contactArray[index].email = mainView.text
            } else {
                contactArray[index].phoneNumber = mainView.text
            }
        }

    })
}

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

function checkEmail(value, index, self) {
    var regExCheck = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    return value.trim().match(regExCheck)
}


exports.onLoadMoreItemsRequested = (args) => {
    console.log("requested")
    const listView = args.object
    let start = listView.items.length
    let index = 0
    //let contactArray = []
    let target = start + 5
    console.log("start: " + start, "target: " + target, "max: " + contacts.length)
    contacts.forEach(element => {
        if (target >= contacts.length) {
            listView.notifyAppendItemsOnDemandFinished(0, true);
        } else {
            if (index > start && index < target) {
                //console.log(element)
                let emailContext = ""
                let phoneNumberContext = ""
                let phoneNumber
                let email
                try {
                    if (element.email) {
                        let checkArray = []
                        element.email.forEach(element => {
                            checkArray.push(element.address)
                        })
                        checkArray = checkArray.filter(checkEmail);
                        checkArray.forEach(element => {
                            emailContext += element + ","
                        })
                        email = checkArray[0]
                    }
                } catch (error) {
                    //console.log(error)
                }
                if (element.phone) {
                    let i = 0
                    let checkArray = []
                    element.phone.forEach(element => {
                        if (element.phone) { checkArray.push(element.phone.replace(/\s/g, '')) }
                        if (element.number) { checkArray.push(element.number.replace(/\s/g, '')) }
                        if (i == 0) { phoneNumber = element.phone ? element.phone.replace(/\s/g, '') : element.number.replace(/\s/g, '') }
                        i++
                    })
                    checkArray = checkArray.filter(onlyUnique);
                    checkArray.forEach(element => {
                        phoneNumberContext += element + ","
                    })
                }

                contactArray.push({
                    index: index,
                    clientID: element.contact_id,
                    clientImage: element.thumbnail,
                    clientName: element.display_name,
                    emailContext: emailContext.slice(0, -1),
                    phoneNumberContext: phoneNumberContext.slice(0, -1),
                    email: email,
                    phoneNumber: phoneNumber
                })
            }
            if (index == target + 1) {
                try {
                    listView.items.push(contactArray)
                    listView.refresh();
                } catch (error) {
                    console.log(error)
                }

                listView.notifyAppendItemsOnDemandFinished(0, false);
            }
            index++
        }
    })
}