const appSettings = require("tns-core-modules/application-settings");
const Observable = require("tns-core-modules/data/observable").Observable;
const navigation = require("~/navigation/navigation")
const sendHTTP = require("~/http/sendHTTP").sendHTTP;
const randomString = require('random-string');
const source = new Observable()
exports.onNavigatingTo = function onNavigatingTo(args) {
    const page = args.object;
    page.bindingContext = source;
    //Need to move this function before this page is shown
    if (!appSettings.hasKey("deviceID")) {
        getEnctrypedKey()
    } else {
        //autoSignIn();
    } 
}



source.set("signUpAsClient", function (args) {
    //navigate to client sign up page
})
source.set("signUpAsProfessional", function (args) {
    const button = args.object;
    const page = button.page;
    navigation.navigateToSignUpProfessionalLandingPage(page)//This page is funny
})
source.set("signInTapped", function (args) {
    const button = args.object;
    const page = button.page;
    navigation.navigateToSignInPage(null, page)
});

async function getEnctrypedKey() {
    const deviceID = randomString({ length: 25 })
    const content = JSON.stringify({ deviceID: deviceID })
    const httpParameters = {
        url: 'http://192.168.1.12:3333/landing',
        method: 'POST',
        content: content,
    }
    await sendHTTP(httpParameters)
        .then((response) => {
            appSettings.setString("plainKey", response.JSON.plainKey);
            appSettings.setString("deviceID", deviceID);
        }, (e) => {
            // unable to authenticate device
        })

}

async function autoSignIn(){
    if (validation()) {
        processingHTTPRequest(true)
        const button = args.object;
        const page = button.page;
        const content = JSON.stringify({
            email: appSettings.getString("email"),
            password: appSettings.getString("password"),
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
                navigation.navigateToDashboard(response, page)
            }, (e) => {
                processingHTTPRequest(false)
                // unable to login - please try again
            })
        }
}