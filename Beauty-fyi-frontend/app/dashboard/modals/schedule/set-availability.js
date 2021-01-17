const Observable = require("tns-core-modules/data/observable").Observable;
const navigation = require("~/controllers/navigationController")
const animation = require("~/controllers/animationController").loadAnimation;
const sendHTTP = require("~/controllers/HTTPControllers/sendHTTP").sendHTTP;
const application = require('application');
let pageStateChanged;
let source = new Observable();

let closeCallback;
let lastOpenedContainer;

exports.onShownModally = function (args) {
    const context = args.context;
    closeCallback = args.closeCallback;
    const page = args.object;
    page.bindingContext = source;
}

exports.loaded = (args) => {
    const page = args.object.page
    if (application.android) {
        application.android.on(application.AndroidApplication.activityBackPressedEvent, backEvent);
    } 
    page.on('goBack', () => {
        backEvent(args)
    })
    pageStateChanged = false
    // Call JJ to get the info
    source.set("mondayStartTime", '09:00')
    source.set("mondayEndTime", '15:00')
    source.set("tuesdayStartTime", '09:00')
    source.set("tuesdayEndTime", '15:00')
    source.set("wednesdayStartTime", '09:00')
    source.set("wednesdayEndTime", '15:00')
    source.set("thursdayStartTime", '09:00')
    source.set("thursdayEndTime", '15:00')
    source.set("fridayStartTime", '09:00')
    source.set("fridayEndTime", '15:00')
    source.set("saturdayStartTime", '09:00')
    source.set("saturdayEndTime", '15:00')
    source.set("sundayStartTime", '09:00')
    source.set("sundayEndTime", '15:00')
    source.set("mondayActive", true)
    source.set("tuesdayActive", true)
    source.set("wednesdayActive", true)
    source.set("thursdayActive", true)
    source.set("fridayActive", true)
    source.set("saturdayActive", false)
    source.set("sundayActive", false)

    console.log("running")
    const httpParameters = {
        url: 'scheduleavailabilityday',
        method: 'GET',
        content: {},
    }
    sendHTTP(httpParameters)
        .then((response) => {
            console.log(response)
        }, (e) => {
            console.log("error 1: " + e)
            //animation(object, "expand section width", { width: '40%', duration: 500 })
            //object.text = "error, try again"
        })
}



exports.goBack = (args) => {
    
    // Would send http request in here to update the information
    const httpParameters = {
        url: "url",
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        content: {}
    }
//    sendHTTP(httpParameters).then(function (result) {
//        //This page needs work
//
//    }, (error) => {
//
//    })
console.log("ran")
        backEvent(args)
}

function backEvent(args) {
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
    }else{
        closeCallback();
    }
}

exports.dayTapped = function(args){
    pageStateChanged = true;
    const object = args.object
    const parentContainer = object.parent.parent.parent;
    const visibilityContainer = parentContainer.getChildAt(2)
    const checkBox = parentContainer.getChildAt(0).getChildAt(0).getChildAt(1);
    // Check if checkbox is ticked

    setTimeout(function () {
        if (checkBox.checked) {
            if (visibilityContainer.height == 1){
                if (lastOpenedContainer) {
                    animation(lastOpenedContainer, "reduce section down", { height: 1 })
                }
                lastOpenedContainer = visibilityContainer
                animation(visibilityContainer, "expand section down", { height: 270 })
            }  else {
                lastOpenedContainer = null
                animation(visibilityContainer, "reduce section down", { height: 1 })
            }
        }
    }, 100)
}

let functionIsRunningcheckBoxTapped = false
exports.checkBoxTapped = function(args){
    const object = args.object
    const parentContainer = object.parent.parent.parent;
    const visibilityContainer = parentContainer.getChildAt(2)
    const adjacentText = parentContainer.getChildAt(0).getChildAt(0).getChildAt(0).getChildAt(1);
    //Close column if checkbox is no longer ticked
    //Show text if textbox is clicked
    if (!functionIsRunningcheckBoxTapped){
        console.log("tapped")
        functionIsRunningcheckBoxTapped = true
        setTimeout(function () {
            if (object.checked) {
                adjacentText.visibility = 'visible'

                
            } else {
                adjacentText.visibility = 'collapsed'
                if (visibilityContainer.visibility == 'visible') {
                    animation(visibilityContainer, "reduce section down", { height: 1 })
                }
            }
            let content = {
                monday: {
                    active: source.get("mondayActive"),
                },
                tuesday: {
                    active: source.get("tuesdayActive"),
                },
                wednesday: {
                    active: source.get("wednesdayActive"),
                },
                thursday: {
                    active: source.get("thursdayActive"),
                },
                friday: {
                    active: source.get("fridayActive"),
                },
                saturday: {
                    active: source.get("saturdayActive"),
                },
                sunday: {
                    active: source.get("sundayActive"),
                },
            }
            const httpParameters = {
                url: 'scheduleavailabilityday',
                method: 'POST',
                content: content,
            }
           // sendHTTP(httpParameters, { display: true }, { display: true }, { display: true })
           //     .then((response) => {
           //         console.log(response)
           //         object.text = "saved"
           //     }, (e) => {
           //         console.log(e)
           //         animation(object, "expand section width", { width: '40%', duration: 500 })
           //         object.text = "error, try again"
           //     })
            functionIsRunningcheckBoxTapped = false
        }, 1500)    
    }
}

exports.applyThisToDay = function(args){
    const object = args.object;
    if (object.active == 'false'){
        object.color = "#9900ff"
        object.active = 'true'
    }else{
        object.color = "black"
        object.active = 'false'
    }
}
// Apply these setting to other dates

exports.saveDayAvailabilitySettings = async (args) => {
    const object = args.object
    const container = object.parent
    if (object.text != "saving..."){}
    let days = {
        monday: {
            applyTo: false,
            active: source.get("mondayActive"),
        },
        tuesday: {
            applyTo: false,
            active: source.get("tuesdayActive"),
        },
        wednesday: {
            applyTo: false,
            active: source.get("wednesdayActive"),
        },
        thursday: {
            applyTo: false,
            active: source.get("thursdayActive"),
        },
        friday: {
            applyTo: false,
            active: source.get("fridayActive"),
        },
        saturday: {
            applyTo: false,
            active: source.get("saturdayActive"),
        },
        sunday: {
            applyTo: false,
            active: source.get("sundayActive"),
        },
    }
    let startTime, endTime;
    switch (args.object.id) {
        case 'monday':
            days.monday.applyTo = true
            startTime = source.get("mondayStartTime")
            endTime = source.get("mondayEndTime")
            break;
        case 'tuesday':
            days.tuesday.applyTo = true
            startTime = source.get("tuesdayStartTime")
            endTime = source.get("tuesdayEndTime")
            break;
        case 'wednesday':
            days.wednesday.applyTo = true
            startTime = source.get("wednesdayStartTime")
            endTime = source.get("wednesdayEndTime")
            break;
        case 'thursday':
            days.thursday.applyTo = true
            startTime = source.get("thursdayStartTime")
            endTime = source.get("thursdayEndTime")
            break;
        case 'friday':
            days.friday.applyTo = true
            startTime = source.get("fridayStartTime")
            endTime = source.get("fridayEndTime")
            break;
        case 'saturday':
            days.saturday.applyTo = true
            startTime = source.get("saturdayStartTime")
            endTime = source.get("saturdayEndTime")
            break;
        case 'sunday':
            days.sunday.applyTo = true
            startTime = source.get("sundayStartTime")
            endTime = source.get("sundayEndTime")
            break;
    }
    
    for (let index = 0; index < 7; index++) {
        if (container.getChildAt(index).active == "true"){
            console.log(index)
            switch (index) {
                case 0:
                    days.monday.applyTo = true
                    break;
                case 1:
                    days.tuesday.applyTo = true
                    break;
                case 2:
                    days.wednesday.applyTo = true
                    break;
                case 3:
                    days.thursday.applyTo = true
                    break;
                case 4:
                    days.friday.applyTo = true
                    break;
                case 5:
                    days.saturday.applyTo = true
                    break;
                case 6:
                    console.log("trued")
                    try {
                        days.sunday.applyTo = true
                    } catch (error) {
                        console.log(error)
                    }
                    
                    break;
            }
        }
    }
    animation(object, "expand section width", {width: '30%', duration: 500})
    object.text = "saving..."
    //send
    //button to saved
    const content = {
        startTime: startTime,
        endTime: endTime,
        location: '',
        days: {
            monday: days.monday,
            tuesday: days.tuesday,
            wednesday: days.wednesday,
            thursday: days.thursday,
            friday: days.friday,
            saturday: days.saturday,
            sunday: days.sunday,
    }
    }
    const httpParameters = {
        url: 'scheduleavailabilityday',
        method: 'POST',
        content: content,
    }


    //sendHTTP(httpParameters, { display: true }, { display: true }, { display: true })
    //    .then((response) => {
    //        console.log(response)
    //        object.text = "saved"
    //    }, (e) => {
    //        console.log(e)
    //            animation(object, "expand section width", { width: '40%', duration: 500 })
    //            object.text = "error, try again"
    //    })

    for (let index = 0; index < 7; index++) {
        if (container.getChildAt(index).active == "true") {
            switch (index) {
                case 0:
                    if (days.monday.applyTo) {
                        source.set("mondayStartTime", startTime)
                        source.set("mondayEndTime", endTime)
                    }
                    break;
                case 1:
                    if (days.tuesday.applyTo) {
                        source.set("tuesdayStartTime", startTime)
                        source.set("tuesdayEndTime", endTime)
     
                    }
                    break;
                case 2:
                    if (days.wednesday.applyTo) {
                        source.set("wednesdayStartTime", startTime)
                        source.set("wednesdayEndTime", endTime)
                    }
                    break;
                case 3:
                    if (days.thursday.applyTo) {
                        source.set("wednesdayEndTime", endTime)
                        source.set("thursdayStartTime", startTime)
                        source.set("thursdayEndTime", endTime)
                    }
                    break;
                case 4:
                    if (days.friday.applyTo) {
                        source.set("fridayStartTime", startTime)
                        source.set("fridayEndTime", endTime)
                    }
                    break;
                case 5:
                    if (days.saturday.applyTo) {
                        source.set("saturdayStartTime", startTime)
                        source.set("saturdayEndTime", endTime)
                    }
                    break;
                case 6:
                    if (days.sunday.applyTo) {
                        source.set("sundayStartTime", startTime)
                        source.set("sundayEndTime", endTime)
                    }
                    break;
            }
        }
    }
}