const Observable = require("tns-core-modules/data/observable").Observable;
const appSettings = require("tns-core-modules/application-settings");
const sendHTTP = require("~/controllers/HTTPControllers/sendHTTP").sendHTTP;
const navigation = require("~/controllers/navigationController")

const source = new Observable();

source.set("username", "")


//already have an account -> dont need to register again | sign up page will be slighty different - I guess just ask for username details etc
//add i already have an accoutnt - terms and conditions - same page just hide information if already have an account

exports.onNavigatingTo = function onNavigatingTo(args) {
    const page = args.object;
    page.bindingContext = source; 

    const checkbox = { checkBox: false }
    source.set("checkBox", checkbox)

    // 

}

source.set("clientRegisterAsPro", function (args) { // dont have an accuont
    const button = args.object;
    const page = button.page;
    navigation.navigateToSignInPage(page)
});

source.set("signUpTapped", async function (eventData) {
    // need to write my own form validation
    const content = JSON.stringify({
        username: source.get("username"),
        email: source.get("email"),
        password: source.get("password"),
        deviceID: appSettings.getString("deviceID"),
        plainKey: appSettings.getString("plainKey")
    })
    const httpParameters = {
        url: 'register',
        method: 'POST',
        content: content,
    }
    await sendHTTP(httpParameters)
    .then((response) => {
        appSettings.setString("username", source.get("username"));
        appSettings.setString("email", source.get("email"));
        appSettings.setString("password", source.get("password"));
        // We will confirm your email address and you will be able to login in soon - we will send you a notification
    }, (e) => {
        // unable to sign up
    })
});


//Create an account to run your beauty business with