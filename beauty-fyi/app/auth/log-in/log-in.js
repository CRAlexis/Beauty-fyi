const Observable = require("tns-core-modules/data/observable").Observable;
const appSettings = require("tns-core-modules/application-settings");
const sendHTTP = require("~/controllers/HTTPControllers/sendHTTP").sendHTTP;
const navigation = require("~/controllers/navigationController")
const source = new Observable();
const {errorMessage} = require("~/controllers/notifications/inApp/notification-alert.js")
const { SecureStorage } = require("nativescript-secure-storage");
var secureStorage = new SecureStorage();

source.set("email", "")
source.set("password", "")
source.set("signInButtonText", 'LOG IN')
source.set("forgotPasswordVisibility", true)


exports.onNavigatingTo = function onNavigatingTo(args) {
    const page = args.object;
    page.bindingContext = source;
}

source.set("forgotPasswordTapped", function (args) {
    if (source.get("forgotPasswordVisibility")) {
        source.set("forgotPasswordVisibility", false)
        source.set("signInButtonText", 'Reset')
    } else {
        source.set("signInButtonText", 'LOG IN')
        source.set("forgotPasswordVisibility", true)
    }
})



source.set("navigateBack", function (args) {
    const page = args.object.page
    page.frame.goBack();
});

source.set("logInTapped", async (args) => {
    if (!source.get("forgotPasswordVisibility")) {
        resetPassword(args)
    } else {
        try {
        const page = args.object.page;
        const content = {
            email: source.get("email"),
            password: source.get("password"),
        }
        const httpParameters = {
            url: 'login',
            method: 'POST',
            content: content,
        }
        await sendHTTP(httpParameters, { display: true })
            .then(async (response) => {
                console.log(response)
                if (response.JSON.status == "success"){
                    await secureStorage.set({ key: "email", value: source.get("email").trim() })
                    await secureStorage.set({ key: "password", value: source.get("password").trim() })
                    await secureStorage.set({ key: "userID", value: response.JSON.userID.toString() })
                    navigation.navigateToPage({}, page, 2, true)
                }else{
                    errorMessage(response.JSON.message)
                }
            }, (e) => {
            })
        } catch (error) {
            console.log(error)
        }
    }
});


function processingHTTPRequest(state) {
    source.set("processingHTTPRequest", state)
}

async function resetPassword(args) {
    //send reset password email
    if (source.get("email").length != 0) {
        const button = args.object;
        const page = button.page;
        const content = JSON.stringify({
            email: source.get("email"),
        })
        const httpParameters = {
            url: 'login',
            method: 'POST',
            content: content,
        }
        await sendHTTP(httpParameters)
            .then((response) => {
                // figure out what to do here
            }, (e) => {
                // unable to reset - please try again
            })
    }
}