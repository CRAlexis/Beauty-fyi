const SecureStorage = require("nativescript-secure-storage").SecureStorage;
const Observable = require("tns-core-modules/data/observable").Observable;
const navigation = require("~/controllers/navigationController")
const sendHTTP = require("~/controllers/HTTPControllers/sendHTTP").sendHTTP;
const source = new Observable()
const secureStorage = new SecureStorage();
var success = secureStorage.clearAllOnFirstRunSync();
const randomString = require('random-string');

exports.onNavigatingTo = (args) =>{
    const page = args.object;
    page.bindingContext = source;

    secureStorage.get({
        key: "plainKey"
    }).then((value) => {
        if(value){
            autoSignIn(args)
        }else{
            getEnctrypedKey()
        }
    })
    
}

async function getEnctrypedKey() {
    const deviceID = randomString({ length: 25 })
    const content = { deviceID: deviceID }

    const httpParameters = {
        url: 'landing',
        method: 'POST',
        content: content,
    }
    await sendHTTP(httpParameters, { display: false }, { display: true }, { display: true })
        .then(async (response) => {
            console.log(response.JSON)
            await secureStorage.set({ key: "plainKey", value: response.JSON.plainKey })
            await secureStorage.set({ key: "deviceID", value: deviceID })
        }, (e) => {
            console.log(e)
            console.log(e.content)
        })
}

exports.signUp = (args) => {
    const page = args.object.page
    navigation.navigateToPage({}, page, 5, false)
};

exports.logIn = (args) => {
    const page = args.object.page
    navigation.navigateToPage({}, page, 4, false)
};


async function autoSignIn(args){
    const content = {
        
    }
    const httpParameters = {
        url: 'login',
        method: 'POST',
        content: content,
    }
    await sendHTTP(httpParameters)
        .then((response) => {
            navigation.navigateToPage({}, args.object.page, 2, true)
        }, (e) => {
            // unable to login - please try again
        })
    
}