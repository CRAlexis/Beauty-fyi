const Observable = require("tns-core-modules/data/observable").Observable;
const appSettings = require("tns-core-modules/application-settings");
const sendHTTP = require("~/http/sendHTTP").sendHTTP;
const navigation = require("~/navigation/navigation")
const source = new Observable();

source.set("email", "")
source.set("password", "")
source.set("signInButtonText", 'Sign in')
source.set("forgotPasswordVisibility", true)


exports.onNavigatingTo = function onNavigatingTo(args) {
    const page = args.object;
    page.bindingContext = source;
}

source.set("forgotPasswordTapped", function (args){
    source.set("forgotPasswordVisibility", false)
    source.set("signInButtonText", 'Reset')
})

source.set("signUpTapped", function (args) {
    const button = args.object;
    const page = button.page;
    navigation.navigateToLandingPage(page)
});

source.set("navigateBack", function (args) {
    const page = args.object.page
    page.frame.goBack();
});

source.set("signInTapped", async function (args) {
    if (!source.get("forgotPasswordVisibility")){
        resetPassword(args)
    }else{
        //form validation
        if (validation()) {
            processingHTTPRequest(true)
            const button = args.object;
            const page = button.page;
            const content = JSON.stringify({
                email: source.get("email"),
                password: source.get("password"),
                deviceID: appSettings.getString("deviceID"),
                plainKey: appSettings.getString("plainKey")
            })
            const httpParameters = {
                url: 'http://192.168.1.12:3333/login',
                method: 'POST',
                content: content,
            }
            await sendHTTP(httpParameters)
                .then((response) => {
                    console.log(response);
                    processingHTTPRequest(false)
                    appSettings.setString("email", source.get("email"));
                    appSettings.setString("password", source.get("password"));
                    navigation.navigateToDashboard(response, page)
                }, (e) => {
                    processingHTTPRequest(false)
                    // unable to login - please try again
                })
        }
    } 
});

function validation() {
    if (source.get("email").length == 0 || source.get("password").length == 0) {
        let validationError = {
            title: "Error",
            message: "Please complete the entire form",
            okButtonText: "OK"
        };
        alert(validationError)
        return false;
    }
    return true
}

function processingHTTPRequest(state) {
    source.set("processingHTTPRequest", state)
}

async function resetPassword(args){
    //send reset password email
    if (source.get("email").length != 0){
        processingHTTPRequest(true)
        const button = args.object;
        const page = button.page;
        const content = JSON.stringify({
            email: source.get("email"),
            deviceID: appSettings.getString("deviceID"),
            plainKey: appSettings.getString("plainKey")
        })
        const httpParameters = {
            url: 'http://192.168.1.12:3333/login',
            method: 'POST',
            content: content,
        }
        await sendHTTP(httpParameters)
            .then((response) => {
                processingHTTPRequest(false)
                // figure out what to do here
            }, (e) => {
                processingHTTPRequest(false)
                // unable to reset - please try again
            })
    }
}