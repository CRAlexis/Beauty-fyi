const Observable = require("tns-core-modules/data/observable").Observable;
const appSettings = require("tns-core-modules/application-settings");
const sendHTTP = require("~/controllers/HTTPControllers/sendHTTP").sendHTTP;
const navigation = require("~/controllers/navigationController")
const { SecureStorage } = require("nativescript-secure-storage");
var secureStorage = new SecureStorage();

const source = new Observable();


//already have an account -> dont need to register again | sign up page will be slighty different - I guess just ask for username details etc
//add i already have an accoutnt - terms and conditions - same page just hide information if already have an account

exports.onNavigatingTo = function onNavigatingTo(args) {
    const page = args.object;
    page.bindingContext = source; 

    const checkbox = { checkBox: false }
    source.set("firstName", "")
    source.set("firstNameValidation", [false, false])
    source.set("lastName", "")
    source.set("lastNameValidation", [false, false])
    source.set("email", "")
    source.set("emailValidation", [false, false])
    source.set("phoneNumber", "")
    source.set("phoneNumberValidation", [false, false])
    source.set("password", "")
    source.set("passwordValidation", [false, false])
    source.set("checkBox", "false")
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
    //console.log(source)
    if (validation()){
        const content = {
            firstName: source.get("firstName".trim()),
            lastName: source.get("lastName").trim(),
            email: source.get("email").trim(),
            password: source.get("password"),
            phoneNumber: source.get("phoneNumber"),
        }
        const httpParameters = {
            url: 'register',
            method: 'POST',
            content: content,
        }
        await sendHTTP(httpParameters, {display: false}, {display: true}, {display: true})
            .then(async (response) => {
                console.log(response.JSON.userID)
                await secureStorage.set({ key: "email", value: source.get("password").trim() })
                await secureStorage.set({ key: "password", value: source.get("password").trim() })
                await secureStorage.set({ key: "userID", value: response.JSON.userID.toString() })
                navigation.navigateToPage({}, args.object.page, 2, true)
            }, (e) => {
                console.log(e)
            })
    }
};

exports.firstNameInput = (args) => {
    setTimeout(()=>{
        var regExCheck = /^[a-zA-Z_]*$/;
        if (source.get("firstName").length == 0) { source.set("firstNameValidation", [false, false]); return }
        if (!source.get("firstName").trim().match(regExCheck)) {
            source.set("firstNameValidation", [false, true])
        }else{
            source.set("firstNameValidation", [true, true])
        }
    }, 100)
}

exports.lastNameInput = (args) => {
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

exports.emailInput = (args) => {
    setTimeout(() => {
        const httpParameters = {
            url: 'isemailavailable',
            method: 'POST',
            content: { email: source.get("email") },
        }
        var regExCheck = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
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

exports.passwordInput = (args) => {
    setTimeout(() => {
        if (source.get("password").length == 0) { source.set("passwordValidation", [false, false]); return }
        if (source.get("password").length < 5) {
            source.set("passwordValidation", [false, true])
        } else {
            source.set("passwordValidation", [true, true])
        }
    }, 100)
}

function validation(){
    //check they are not blank
    if (source.get("firstNameValidation")[0] &&
        source.get("lastNameValidation")[0] &&
        source.get("emailValidation")[0] &&
        source.get("passwordValidation")[0] && 
        source.get("checkBox") == true){
            return true
        }else{
            let validationError = {
                title: "Error",
                message: "Please correct the form",
                okButtonText: "OK"
            };
            alert(validationError)
        }
    /*console.log("running...")
    console.log(source.get("checkBox"))
    if (source.get("firstName").trim().length == 0 || source.get("lastName").trim().length == 0 || source.get("email").trim().length == 0 || source.get("password").length == 0 ) {
        let validationError = {
            title: "Error",
            message: "Please complete the entire form",
            okButtonText: "OK"
        };
        alert(validationError)
        source.set("printValidationError", "*" + validationError.message)
        return false;
    }
    if (source.get("firstName").trim().length < 3) {
        let validationError = {
            title: "Error",
            message: "First name must have minimum 4 characters",
            okButtonText: "OK"
        };
        source.set("printValidationError", "*" + validationError.message)
        alert(validationError)
        return false;
    }
    var regExCheck = /^[a-zA-Z_]*$/;
    if (!source.get("firstName").trim().match(regExCheck)) {
        let validationError = {
            title: "Error",
            message: "Do not use special symbols in your first name",
            okButtonText: "OK"
        };
        source.set("printValidationError", "*" + validationError.message)
        alert(validationError)
        return false;
    }
    if (!source.get("lastName").trim().match(regExCheck)) {
        let validationError = {
            title: "Error",
            message: "Do not use special symbols in your last name",
            okButtonText: "OK"
        };
        source.set("printValidationError", "*" + validationError.message)
        alert(validationError)
        return false;
    }

    if (source.get("checkBox") == "false"){
        let validationError = {
            title: "Error",
            message: "You must accept the terms",
            okButtonText: "OK"
        };
        source.set("printValidationError", "*" + validationError.message)
        alert(validationError)
        return false;
    }
    return true*/
}


//Create an account to run your beauty business with