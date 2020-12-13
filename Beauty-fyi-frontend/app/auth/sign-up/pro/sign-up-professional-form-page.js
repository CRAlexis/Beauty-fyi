const Observable = require("tns-core-modules/data/observable").Observable;
const appSettings = require("tns-core-modules/application-settings");
const sendHTTP = require("~/controllers/HTTPControllers/sendHTTP").sendHTTP;
const navigation = require("~/controllers/navigationController")

const source = new Observable();

source.set("username", "")
source.set("email", "")
source.set("password", "")

//already have an account -> dont need to register again | sign up page will be slighty different - I guess just ask for username details etc
//add i already have an accoutnt - terms and conditions - same page just hide information if already have an account

exports.onNavigatingTo = function onNavigatingTo(args) {
    const page = args.object;
    page.bindingContext = source; 

    const checkbox = { checkBox: false }
    source.set("checkBox", checkbox)
}

source.set("navigateBack", function (args) {
    const page = args.object.page
    page.frame.goBack();
});

source.set("clientRegisterAsPro", function (args) { //have an account
    const button = args.object;
    const page = button.page;
    navigation.navigateToSignInPageAsExsistingUser(page)
});

source.set("signUpTapped", async function (args) {
    // need to specifiy type of account to JJ
    if(validation()){
        processingHTTPRequest(true)
        const content = JSON.stringify({
            username: source.get("username"),
            email: source.get("email"),
            password: source.get("password"),
            deviceID: appSettings.getString("deviceID"),
            plainKey: appSettings.getString("plainKey"),
            accountType: "pro"
        })
        const httpParameters = {
            url: 'http://192.168.1.12:3333/register',
            method: 'POST',
            content: content,
        }
        await sendHTTP(httpParameters)
            .then((response) => {
                //Check if everything is cool with JJ
                if (response.JSON.status == "success"){
                    processingHTTPRequest(false)
                    // We sent a confirmation email
                    console.log("here1")
                    console.log(response)
                    let validationError = {
                        title: "Success",
                        message: "A verification email has been sent to your email account",
                        okButtonText: "OK"
                    };
                    alert(validationError).then(function () {
                        navigateToSignInPage(null, args.object.page)
                    })
                }else{

                }
                
            }, (e) => {
                processingHTTPRequest(false)
                console.log("here")
                console.log(e);
                // unable to sign up
        })
    }
});

function validation(){
    //check they are not blank
    console.log(source.get("checkBox"))
    if (source.get("username").length == 0 || source.get("email").length == 0 || source.get("password").length == 0 ) {
        let validationError = {
            title: "Error",
            message: "Please complete the entire form",
            okButtonText: "OK"
        };
        alert(validationError)
        source.set("printValidationError", "*" + validationError.message)
        return false;
    }
    if (source.get("username").length > 24) {
        let validationError = {
            title: "Error",
            message: "Username must have minimum 24 characters",
            okButtonText: "OK"
        };
        source.set("printValidationError", "*" + validationError.message)
        alert(validationError)
        return false;
    }
    if (source.get("username").length < 3) {
        let validationError = {
            title: "Error",
            message: "Username must have minimum 4 characters",
            okButtonText: "OK"
        };
        source.set("printValidationError", "*" + validationError.message)
        alert(validationError)
        return false;
    }
    var regExCheck = /^[a-zA-Z0-9_]*$/;
    if (!source.get("username").match(regExCheck)) {
        let validationError = {
            title: "Error",
            message: "Do not use special symbols in your username",
            okButtonText: "OK"
        };
        source.set("printValidationError", "*" + validationError.message)
        alert(validationError)
        return false;
    }
    if (!source.get("checkBox").checkBox){
        let validationError = {
            title: "Error",
            message: "You must accept the terms",
            okButtonText: "OK"
        };
        source.set("printValidationError", "*" + validationError.message)
        alert(validationError)
        return false;
    }
    return true
}

function processingHTTPRequest(state){
    source.set("processingHTTPRequest", state)
}
//Create an account to run your beauty business with