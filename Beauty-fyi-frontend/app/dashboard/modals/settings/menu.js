const Observable = require("tns-core-modules/data/observable").Observable;
const navigation = require("~/controllers/navigationController")
const animation = require("~/controllers/animationController").loadAnimation;
let closeCallback;
let active = false;

exports.onShownModally = function(args) {
    const context = args.context;
    closeCallback = args.closeCallback;
    const page = args.object;
    page.bindingContext;
}

exports.goBack = (args) => {
    closeCallback()
}

exports.goToAccountDetails = (args) => {
    if (!active) {
        active = true
        const mainView = args.object;
        const context = ""
        animation(args.object.getChildAt(1), "arrow swipe").then(function () {
            navigation.navigateToModal(context, mainView, 15, true).then(function (result) {
                active = false
            })
        })
    } 
}

exports.goToMyBio = (args) => {
    if (!active) {
        active = true
        const mainView = args.object;
        const context = ""
        animation(args.object.getChildAt(1), "arrow swipe").then(function () {
            navigation.navigateToModal(context, mainView, 16, true).then(function (result) {
                active = false
            })
        })
    }
}

exports.setSchedule = function(args){
    if (!active){
        active = true
        const mainView = args.object;
        const context = ""
        animation(args.object.getChildAt(1), "arrow swipe").then(function(){
            navigation.navigateToModal(context, mainView, 10, true).then(function (result) {
                active = false
            })
        })
    } 
}

exports.setSchedulingLimits = function (args) {
    if (!active) {
        active = true
        const mainView = args.object;
        const context = ""
        animation(args.object.getChildAt(1), "arrow swipe").then(function () {
            navigation.navigateToModal(context, mainView, 9, true).then(function (result) {
                active = false
            })
        })
    }
}

exports.addClient = function (args) {
    if (!active) {
        active = true
        const mainView = args.object;
        const context = ""
        animation(args.object.getChildAt(1), "arrow swipe").then(function () {
            navigation.navigateToModal(context, mainView, 9, true).then(function (result) {
                active = false
            })
        })
    }
    
}

exports.addService = function (args) {
    if (!active) {
        active = true
        const mainView = args.object;
        const context = ""
        animation(args.object.getChildAt(1), "arrow swipe").then(function () {
            navigation.navigateToModal(context, mainView, 11, true).then(function (result) {
                active = false
            })
        })
    }
    
}

exports.viewNotificationDetails = function (args) {
    if (!active) {
        active = true
        const mainView = args.object;
        const context = ""
        animation(args.object.getChildAt(1), "arrow swipe").then(function () {
            navigation.navigateToModal(context, mainView, 17, true).then(function (result) {
                active = false
            })
        })
    }

}