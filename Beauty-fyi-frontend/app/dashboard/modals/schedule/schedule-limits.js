const Observable = require("tns-core-modules/data/observable").Observable;
const inAppNotifiationAlert = require("~/controllers/notifications/inApp/notification-alert.js")
const sendHTTP = require("~/controllers/HTTPControllers/sendHTTP").sendHTTP;
const navigation = require("~/controllers/navigationController")
const application = require('application');
let closeCallback;
const source = new Observable()
let pageStateChanged;
exports.onShownModally = function (args) {
    const context = args.context;
    closeCallback = args.closeCallback;
    const page = args.object;
    page.bindingContext = source
}

exports.loaded = function(args){
    const page = args.object.page
    source.set("hoursBeforeStartTime", 12)
    source.set("daysInAdvance", 60)
    source.set("rescheduleAppointments", true)
    source.set("cancelAppointments", true)
    source.set("rescheduledHours", 12)
    source.set("avoidGaps", true)
    source.set("allowGaps", false)
    source.set("gapHours", '3 hours')
    pageStateChanged = false;
    if (application.android) {
        application.android.on(application.AndroidApplication.activityBackPressedEvent, backEvent);
    }
}

source.set("dropDownClicked", function (args) {
    if (source.get("allowGaps")) {
        pageStateChanged = true
        const mainView = args.object;
        let context = mainView.optionContext.split(",")
        navigation.navigateToModal(context, mainView, 4, false).then(function (result) {
            args.object.text = result
        })
    }
    
})

exports.minimizeGaps = (args) => {
    setTimeout(function(){
        const object = args.object
        const page = args.object.page
        if (object.id == 'avoidGaps'){
            if (object.checked){
                source.set("allowGaps", false)
            }else{
                source.set("allowGaps", true)
            }
        }else{
            if (object.checked) {
                source.set("avoidGaps", false)
            } else {
                source.set("avoidGaps", true)
            }
        }
    }, 250)
    
}

exports.pageStateChanged = (args) => {
    console.log(args.object)
    pageStateChanged = true;
}

exports.goBack = function (args) {
    backEvent(args)
}

function backEvent(args) { // This event is a bit funny
    console.log(pageStateChanged)
    if (pageStateChanged){
        args.cancel = true;
        inAppNotifiationAlert.areYouSure("Are you sure?", "Some information may not be saved if you leave.").then(function (result) {
            if (result) { exitModal(args) }
        })
    }
    
}

function exitModal(args) {
    if (application.android) {
        application.android.off(application.AndroidApplication.activityBackPressedEvent, backEvent);
        closeCallback();
    }
}

exports.saveSettings = (args) => {
    console.log(1)
    const object = args.object
    object.text="Saving..."
    const content = JSON.stringify({
        minimumHoursBeforeAppointment: source.get("hoursBeforeStartTime"),
        maximumDaysInAdvance :source.get("daysInAdvance"),
        rescheduleAppointments :source.get("rescheduleAppointments"),
        cancelAppointments :source.get("cancelAppointments"),
        maximumHoursForReschedule :source.get("rescheduledHours"),
        avoidGaps :source.get("avoidGaps"),
        allowGaps :source.get("allowGaps"),
        gapHours : parseInt(source.get("gapHours")) // set to just int
    })
    const httpParameters = {
        url: 'http://192.168.1.12:3333/schedulelimit',
        method: 'POST',
        content: content,
    }
    sendHTTP(httpParameters)
        .then((response) => {
            object.text = "saved!"
            console.log(response)
        }, (e) => {
            console.log(e)
                object.text = "error, try again"
        })
}
