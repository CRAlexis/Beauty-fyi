const httpModule = require("tns-core-modules/http");
const Observable = require("tns-core-modules/data/observable").Observable;
const appSettings = require("tns-core-modules/application-settings");
const sendHTTP = require("~/http/sendHTTP").sendHTTP;
const randomString = require('random-string');
const source = new Observable();

source.set("username", "")
source.set("email", "")
source.set("password", "")

function onNavigatingTo(args) {
    if (!appSettings.hasKey("deviceID")){
        getEnctrypedKey()
    } else {
        // automaticcaly sign in 
        // if automatic sign in does not work
        // ask them to sign in or to create an account
        const page = args.object;
        page.bindingContext = source;  
    } 
}

source.set("navigateToSignInPage", function (args) {
    const button = args.object;
    const page = button.page;
    page.frame.navigate("~/auth/sign-in/sign-in");
});

async function getEnctrypedKey(){
    const deviceID = randomString({length: 25})
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
        // do something with error - probably send to database
    })
 
}

source.set("signUpTapped", async function (eventData) {
    const content = JSON.stringify({
        username: source.get("username"),
        email: source.get("email"),
        password: source.get("password"),
        deviceID: appSettings.getString("deviceID"),
        plainKey: appSettings.getString("plainKey")
    })
    const httpParameters = {
        url: 'http://192.168.1.12:3333/landing',
        method: 'POST',
        content: content,
    }
    await sendHTTP(httpParameters)
    .then((response) => {
        //do whatever
    }, (e) => {
        // do something with error - probably send to database
    })
});

exports.onNavigatingTo = onNavigatingTo