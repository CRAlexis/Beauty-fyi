const Observable = require("tns-core-modules/data/observable").Observable;
const appSettings = require("tns-core-modules/application-settings");
const sendHTTP = require("~/controllers/HTTPControllers/sendHTTP").sendHTTP;
const navigation = require("~/controllers/navigationController")

const source = new Observable();


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

exports.signUpTapped = async (args) => {
    // need to specifiy type of account to JJ
    // need to validate form
    if(true){
        const content = {
            firstName: "charles",
            lastName: "Alexis",
            email: "chazalexix@hotmail.co.uk",
            password: "password",
            phoneNumber: "07968399386"
        }
        const httpParameters = {
            url: 'http://192.168.1.12:3333/register',
            method: 'POST',
            content: content,
        }
        await sendHTTP(httpParameters, {display: true}, {display: true}, {display: true})
            .then((response) => {
                console.log(response)
                // because they gona be login in here..
                // set the user id and email and password into secure storage
                // We have sent you a confirmation email - Can resend the email
                // Let people login but have limit funcionality
                // Dashboard says please confirm your email to use full features
            }, (e) => {
                console.log(e)
            })
    }
};

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


//Create an account to run your beauty business with