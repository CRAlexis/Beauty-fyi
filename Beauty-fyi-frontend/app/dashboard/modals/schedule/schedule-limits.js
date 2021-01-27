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

exports.loaded = function (args) {
    const page = args.object.page
    const httpParameters = {
        url: 'schedulelimitget',
        method: 'POST',
        content: {},
    }
    sendHTTP(httpParameters, { display: false }, { display: false }, { display: false }).then((response) => {
        if (response.JSON.status == "success") {
            setDataOnPage(args, response.JSON.scheduleLimits)
        } else { console.log("Unable to get schedule for this user") }
    }, (e) => { console.log(e) })


    pageStateChanged = false;
    if (application.android) { application.android.on(application.AndroidApplication.activityBackPressedEvent, backEvent) }
    page.on('goBack', () => { backEvent(args) })
}

function setDataOnPage(args, response) {
    source.set("hoursBeforeStartTime", response.minimumHoursBeforeAppointment)
    source.set("daysInAdvance", response.maximumDaysInAdvance)
    source.set("rescheduleAppointments", !!parseInt(response.rescheduleAppointments))
    source.set("cancelAppointments", !!parseInt(response.cancelAppointments))
    source.set("rescheduledHours", response.maximumHoursForReschedule)
    source.set("avoidGaps", !!parseInt(response.avoidGaps))
    source.set("allowGaps", !!parseInt(response.allowGaps))
    source.set("gapHours", response.gapHours)
}

source.set("dropDownClicked", function (args) {
    if (source.get("allowGaps")) {
        pageStateChanged = true
        const mainView = args.object;
        let context = mainView.optionContext.split(",")
        navigation.navigateToModal({ context: context, meta: null }, mainView, 4, false).then(function (result) {
            if (result.text) {
                args.object.text = result.text
            }
        })
    }

})

exports.minimizeGaps = (args) => {
    setTimeout(function () {
        const object = args.object
        const page = args.object.page
        if (object.id == 'avoidGaps') {
            if (object.checked) {
                source.set("allowGaps", false)
            } else {
                source.set("allowGaps", true)
            }
        } else {
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
    console.log("here")
    const inAppNotifiationAlert = require("~/controllers/notifications/inApp/notification-alert.js")
    args.cancel = true;
    if (pageStateChanged) {
        inAppNotifiationAlert.areYouSure("Are you sure?", "Some information may not be saved if you leave.").then(function (result) {
            console.log(result)
            if (result) {
                if (application.android) {
                    application.android.off(application.AndroidApplication.activityBackPressedEvent, backEvent);
                }
                closeCallback();
            }
        })
    } else {
        if (application.android) {
            application.android.off(application.AndroidApplication.activityBackPressedEvent, backEvent);
        }
        closeCallback();
    }
}

exports.saveSettings = (args) => {
    console.log(1)
    const object = args.object
    object.text = "Saving..."
    const content = {
        minimumHoursBeforeAppointment: source.get("hoursBeforeStartTime"),
        maximumDaysInAdvance: source.get("daysInAdvance"),
        rescheduleAppointments: source.get("rescheduleAppointments"),
        cancelAppointments: source.get("cancelAppointments"),
        maximumHoursForReschedule: source.get("rescheduledHours"),
        avoidGaps: source.get("avoidGaps"),
        allowGaps: source.get("allowGaps"),
        gapHours: parseInt(source.get("gapHours")) // set to just int
    }
    const httpParameters = {
        url: 'schedulelimit',
        method: 'POST',
        content: content,
    }
    sendHTTP(httpParameters, { display: false }, { display: false }, { display: false })
        .then((response) => {
            object.text = "saved!"
            console.log(response)
            pageStateChanged = false
        }, (e) => {
            console.log(e)
            object.text = "error, try again"
        })
}
