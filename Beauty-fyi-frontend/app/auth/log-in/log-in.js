const Observable = require("tns-core-modules/data/observable").Observable;
const appSettings = require("tns-core-modules/application-settings");
const sendHTTP = require("~/controllers/HTTPControllers/sendHTTP").sendHTTP;
const navigation = require("~/controllers/navigationController")
const source = new Observable();

source.set("email", "")
source.set("password", "")
source.set("signInButtonText", 'LOG IN')
source.set("forgotPasswordVisibility", true)


exports.onNavigatingTo = function onNavigatingTo(args) {
    const page = args.object;
    page.bindingContext = source;
}

source.set("forgotPasswordTapped", function (args){
    if (source.get("forgotPasswordVisibility")){
        source.set("forgotPasswordVisibility", false)
        source.set("signInButtonText", 'Reset')
    }else{
        source.set("signInButtonText", 'LOG IN')
        source.set("forgotPasswordVisibility", true)
    } 
})



source.set("navigateBack", function (args) {
    const page = args.object.page
    page.frame.goBack();
});

source.set("logInTapped", async function (args) {
    if (!source.get("forgotPasswordVisibility")){
        resetPassword(args)
    }else{
        if (true) {
            processingHTTPRequest(true)
            const page = args.button.page;
            const content = JSON.stringify({
                email: source.get("email"),
                password: source.get("password"),
            })
            const httpParameters = {
                url: 'http://192.168.1.12:3333/login',
                method: 'POST',
                content: content,
            }
            await sendHTTP(httpParameters)
                .then(async (response) => {
                    await secureStorage.set({ key: "email", value: source.get("password").trim() })
                    await secureStorage.set({ key: "password", value: source.get("password").trim() })
                    await secureStorage.set({ key: "userID", value: response.JSON.userID.toString() })
                    navigation.navigateToPage({}, args.object.page, 2, true)
                }, (e) => {
                })
        }
    } 
});


function processingHTTPRequest(state) {
    source.set("processingHTTPRequest", state)
}

async function resetPassword(args){
    //send reset password email
    if (source.get("email").length != 0){
        const button = args.object;
        const page = button.page;
        const content = JSON.stringify({
            email: source.get("email"),
        })
        const httpParameters = {
            url: 'http://192.168.1.12:3333/login',
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