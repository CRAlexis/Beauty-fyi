const Observable = require("tns-core-modules/data/observable").Observable;
const animation = require("~/controllers/animationController").loadAnimation;
const sendHTTP = require("~/controllers/HTTPControllers/sendHTTP").sendHTTP;
const application = require('application');
let closeCallback;
let pageStateChanged;
let source = new Observable()

exports.onShownModally = function (args) {
    const context = args.context;
    closeCallback = args.closeCallback;
    const page = args.object;
    page.bindingContext = source
}

exports.loaded = (args) => {
    const page = args.object.page
    const httpParameters = { url: 'accountdetailsget', method: 'POST', content: {}, }
    sendHTTP(httpParameters, { display: false }, { display: false }, { display: false })
        .then((response) => {
            if (response.JSON.status == "success") {
                const accountDetails = response.JSON.accountDetails
                console.log(accountDetails)
                source.set("firstName", accountDetails.firstName ? accountDetails.firstName : "")
                source.set("firstNameValidation", [false, false])
                source.set("lastName", accountDetails.lastName ? accountDetails.lastName : "")
                source.set("lastNameValidation", [false, false])
                source.set("salonName", accountDetails.salon_name ? accountDetails.salon_name : "")
                source.set("salonNameValidation", [false, false])
                source.set("email", accountDetails.email ? accountDetails.email : "")
                source.set("emailValidation", [false, false])
                source.set("phoneNumber", accountDetails.phoneNumber ? accountDetails.phoneNumber : "")
                source.set("phoneNumberValidation", [false, false])
                page.getViewById("instagramTextField").text = accountDetails.instagram
            } else {
                console.log("This user does have an account")
            }
        }, (e) => {
            console.log(e)
        })


    if (application.android) { application.android.on(application.AndroidApplication.activityBackPressedEvent, backEvent); }
    page.on('goBack', () => { backEvent(args) })
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


exports.showSocials = (args) => {
    const object = args.object
    const page = object.page
    try {
        if (page.getViewById("socialDetails").visibility == "collapse") {
            page.getViewById("socialDetails").visibility = "visible"
            object.getChildAt(0).color = "black"
            object.getChildAt(1).visibility = "collapsed"
            object.getChildAt(2).visibility = "visible"
        } else {
            page.getViewById("socialDetails").visibility = "collapsed"
            object.getChildAt(0).color = "gray"
            object.getChildAt(1).visibility = "visible"
            object.getChildAt(2).visibility = "collapsed"
        }
    } catch (error) {
        console.log(error)
    }
}

exports.save = (args) => {
    const object = args.object
    const page = object.page;
    object.text = "saving..."
    if (validation()) {


        const content = JSON.stringify({
            firstName: source.get("firstName"),
            lastName: source.get("lastName"),
            salonName: source.get("salonName"),
            email: source.get("email"),
            phoneNumber: source.get("phoneNumber"),
            instagram: page.getViewById("instagramTextField").text
        })
        const httpParameters = {
            url: 'addaccountdetails',
            method: 'POST',
            content: content,
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
}

exports.firstNameInput = (args) => {
    pageStateChanged = true
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
    pageStateChanged = true
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

exports.salonNameInput = (args) => {
    pageStateChanged = true
    setTimeout(() => {
        var regExCheck = /^[a-zA-Z0-9-,. ]+$/;
        if (source.get("salonName").length == 0) { source.set("salonNameValidation", [false, false]); return }
        if (!source.get("salonName").trim().match(regExCheck)) {
            source.set("salonNameValidation", [false, true])
        } else {
            source.set("salonNameValidation", [true, true])
        }
    }, 100)
}

exports.emailInput = (args) => {
    pageStateChanged = true
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
    pageStateChanged = true
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
    if (!source.get("firstNameValidation")[0] && source.get("firstNameValidation")[1]) {
        return false
    }
    if (!source.get("lastNameValidation")[0] && source.get("lastNameValidation")[1]) {
        return false
    }
    if (!source.get("salonNameValidation")[0] && source.get("salonNameValidation")[1]) {
        return false
    }
    if (!source.get("emailValidation")[0] && source.get("emailValidation")[1]) {
        return false
    }
    if (!source.get("phoneNumberValidation")[0] && source.get("phoneNumberValidation")[1]) {
        return false
    }
    return true
}