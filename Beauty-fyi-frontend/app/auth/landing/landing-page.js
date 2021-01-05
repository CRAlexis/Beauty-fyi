const SecureStorage = require("nativescript-secure-storage").SecureStorage;
const Observable = require("tns-core-modules/data/observable").Observable;
const navigation = require("~/controllers/navigationController")
const sendHTTP = require("~/controllers/HTTPControllers/sendHTTP").sendHTTP;
const randomString = require('random-string');
const source = new Observable()
const secureStorage = new SecureStorage();
var success = secureStorage.clearAllOnFirstRunSync();

exports.onNavigatingTo = (args) =>{
    const page = args.object;
    page.bindingContext = source;
    //Need to move this function before this page is shown
    secureStorage.get({ key: "deviceID" }).then((result) => {
        // Already has key
    }, (e) => {
        getEnctrypedKey()
    })
}

source.set("signUpAsClient", function (args) {
    //navigate to client sign up page
})
/*exports.signInAsProfessional = (args) => {
    const page = args.object.page
    navigation.navigateToPage({}, page, 7, false)
}*/

exports.signUp = (args) => {
    const page = args.object.page
    navigation.navigateToPage({}, page, 5, false)
};

exports.logIn = (args) => {
    const page = args.object.page
    navigation.navigateToPage({}, page, 4, false)
};



async function getEnctrypedKey() {
    const deviceID = randomString({ length: 25 })
    const content = { deviceID: deviceID }
    const httpParameters = {
        url: 'http://192.168.1.12:3333/landing',
        method: 'POST',
        content: content,
    }
    await sendHTTP(httpParameters)
        .then((response) => {
            secureStorage.set({
                key: "plainKey",
                value: response.JSON.plainKey
            }).then(({}),(e) =>{
                //unable to authenticate device
            })
            secureStorage.set({
                key: "deviceID",
                value: deviceID
            }).then(({}), (e) => {
                //unable to authenticate device
            })
        }, (e) => {
            // unable to authenticate device
        })

}

async function autoSignIn(){
    if (validation()) {
        processingHTTPRequest(true)
        const button = args.object;
        const page = button.page;
        const content = {
            deviceID: await secureStorage.get({ key: "email" }),
            plainKey: await secureStorage.get({ key: "password" }),
        }
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