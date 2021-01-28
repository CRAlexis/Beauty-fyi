const Observable = require("tns-core-modules/data/observable").Observable;
const navigation = require("~/controllers/navigationController")
const animation = require("~/controllers/animationController").loadAnimation;
const application = require('application');
let closeCallback;
let active = false;

exports.onShownModally = function(args) {
    const context = args.context;
    closeCallback = args.closeCallback;
    const page = args.object;
    page.bindingContext;
}

exports.loaded = (args) => {
    const page = args.object.page
    console.log("Page is loaded")
    if (application.android) {
        application.android.on(application.AndroidApplication.activityBackPressedEvent, backEvent);
    }
    page.on('goBack', () => {
        backEvent(args)
    })
}

function backEvent(args) { // This event is a bit funny
    console.log("back event in menu is firing")
    args.cancel = true;
    if (application.android) {
        application.android.off(application.AndroidApplication.activityBackPressedEvent, backEvent);
    }
    closeCallback();
}


exports.goToAccountDetails = (args) => {
    if (!active) {
        if (application.android) { application.android.off(application.AndroidApplication.activityBackPressedEvent, backEvent);}
        active = true
        const mainView = args.object;
        const context = ""
        animation(args.object.getChildAt(1), "arrow swipe").then(function () {
            navigation.navigateToModal(context, mainView, 15, true).then(function (result) {
                console.log("we are in menu")
                if (application.android) { application.android.on(application.AndroidApplication.activityBackPressedEvent, backEvent); }
                active = false
            })
        })
    } 
}

exports.goToMyBio = (args) => {
    if (!active) {
        if (application.android) { application.android.off(application.AndroidApplication.activityBackPressedEvent, backEvent); }
        active = true
        const mainView = args.object;
        const context = ""
        animation(args.object.getChildAt(1), "arrow swipe").then(function () {
            navigation.navigateToModal(context, mainView, 16, true).then(function (result) {
                if (application.android) { application.android.on(application.AndroidApplication.activityBackPressedEvent, backEvent); }
                active = false
            })
        })
    }
}

exports.goToCardDetails = (args) => {
    if (!active) {
        if (application.android) { application.android.off(application.AndroidApplication.activityBackPressedEvent, backEvent); }
        active = true
        const mainView = args.object;
        const context = ""
        animation(args.object.getChildAt(1), "arrow swipe").then(function () {
            navigation.navigateToModal(context, mainView, 25, true).then(function (result) {
                if (application.android) { application.android.on(application.AndroidApplication.activityBackPressedEvent, backEvent); }
                active = false
            })
        })
    }
}

exports.setSchedule = function(args){
    if (!active){
        if (application.android) { application.android.off(application.AndroidApplication.activityBackPressedEvent, backEvent); }
        active = true
        const mainView = args.object;
        const context = ""
        animation(args.object.getChildAt(1), "arrow swipe").then(function(){
            navigation.navigateToModal(context, mainView, 10, true).then(function (result) {
                if (application.android) { application.android.on(application.AndroidApplication.activityBackPressedEvent, backEvent); }
                active = false
            })
        })
    } 
}

exports.setSchedulingLimits = function (args) {
    if (!active) {
        if (application.android) { application.android.off(application.AndroidApplication.activityBackPressedEvent, backEvent); }
        active = true
        const mainView = args.object;
        const context = ""
        animation(args.object.getChildAt(1), "arrow swipe").then(function () {
            navigation.navigateToModal(context, mainView, 9, true).then(function (result) {
                if (application.android) { application.android.on(application.AndroidApplication.activityBackPressedEvent, backEvent); }
                active = false
            })
        })
    }
}

exports.addClient = function (args) {
    if (!active) {
        if (application.android) { application.android.off(application.AndroidApplication.activityBackPressedEvent, backEvent); }
        active = true
        const mainView = args.object;
        const context = ""
        animation(args.object.getChildAt(1), "arrow swipe").then(function () {
            navigation.navigateToModal(context, mainView, 26, true).then(function (result) {
                if (application.android) { application.android.on(application.AndroidApplication.activityBackPressedEvent, backEvent); }
                active = false
            })
        })
    }
}
exports.importClients = function (args) {
    if (!active) {
        if (application.android) { application.android.off(application.AndroidApplication.activityBackPressedEvent, backEvent); }
        active = true
        const mainView = args.object;
        const context = ""
        animation(args.object.getChildAt(1), "arrow swipe").then(function () {
            navigation.navigateToModal(context, mainView, 27, true).then(function (result) {
                if (application.android) { application.android.on(application.AndroidApplication.activityBackPressedEvent, backEvent); }
                active = false
            })
        })
    }
}



exports.addService = function (args) {
    if (!active) {
        if (application.android) { application.android.off(application.AndroidApplication.activityBackPressedEvent, backEvent); }
        active = true
        const mainView = args.object;
        const context = ""
        animation(args.object.getChildAt(1), "arrow swipe").then(function () {
            navigation.navigateToModal(context, mainView, 11, true).then(function (result) {
                if (application.android) { application.android.on(application.AndroidApplication.activityBackPressedEvent, backEvent); }
                active = false
            })
        })
    }
    
}

exports.viewNotificationDetails = function (args) {
    if (!active) {
        if (application.android) { application.android.off(application.AndroidApplication.activityBackPressedEvent, backEvent); }
        active = true
        const mainView = args.object;
        const context = ""
        animation(args.object.getChildAt(1), "arrow swipe").then(function () {
            navigation.navigateToModal(context, mainView, 18, true).then(function (result) {
                if (application.android) { application.android.on(application.AndroidApplication.activityBackPressedEvent, backEvent); }
                active = false
            })
        })
    }
}

exports.viewIntakeForm = function (args) {
    if (!active) {
        if (application.android) { application.android.off(application.AndroidApplication.activityBackPressedEvent, backEvent); }
        active = true
        const mainView = args.object;
        const context = ""
        animation(args.object.getChildAt(1), "arrow swipe").then(function () {
            navigation.navigateToModal(context, mainView, 21, true).then(function (result) {
                if (application.android) { application.android.on(application.AndroidApplication.activityBackPressedEvent, backEvent); }
                active = false
            })
        })
    }
}

exports.support = (args) => {
    if (!active) {
        if (application.android) { application.android.off(application.AndroidApplication.activityBackPressedEvent, backEvent); }
        active = true
        const mainView = args.object;
        const context = ""
        animation(args.object.getChildAt(1), "arrow swipe").then(function () {
            navigation.navigateToModal(context, mainView, 29, true).then(function (result) {
                if (application.android) { application.android.on(application.AndroidApplication.activityBackPressedEvent, backEvent); }
                active = false
            })
        })
    }
}