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

function setDataOnPage(args, response){
    response.forEach(element =>{
        const day = element.day
        switch (day) {
            case "monday":
                source.set("mondayStartTime", element.start_time.slice(0, -3))
                source.set("mondayEndTime", element.end_time.slice(0, -3))
                source.set("mondayStartTimeDatePicker", element.start_time.slice(0, -3))
                source.set("mondayEndTimeDatePicker", element.end_time.slice(0, -3))
                source.set("mondayActive", !!parseInt(element.active))
                break;
            case "tuesday":
                source.set("tuesdayStartTime", element.start_time.slice(0, -3))
                source.set("tuesdayEndTime", element.end_time.slice(0, -3))
                source.set("tuesdayStartTimeDatePicker", element.start_time.slice(0, -3))
                source.set("tuesdayEndTimeDatePicker", element.end_time.slice(0, -3))
                source.set("tuesdayActive", !!parseInt(element.active))
                break;
            case "wednesday":
                source.set("wednesdayStartTime", element.start_time.slice(0, -3))
                source.set("wednesdayEndTime", element.end_time.slice(0, -3))
                source.set("wednesdayStartTimeDatePicker", element.start_time.slice(0, -3))
                source.set("wednesdayEndTimeDatePicker", element.end_time.slice(0, -3))
                source.set("wednesdayActive", !!parseInt(element.active))
                break;
            case "thursday":
                source.set("thursdayStartTime", element.start_time.slice(0, -3))
                source.set("thursdayEndTime", element.end_time.slice(0, -3))
                source.set("thursdayStartTimeDatePicker", element.start_time.slice(0, -3))
                source.set("thursdayEndTimeDatePicker", element.end_time.slice(0, -3))
                source.set("thursdayActive", !!parseInt(element.active))
                break;
            case "friday":
                source.set("fridayStartTime", element.start_time.slice(0, -3))
                source.set("fridayEndTime", element.end_time.slice(0, -3))
                source.set("fridayStartTimeDatePicker", element.start_time.slice(0, -3))
                source.set("fridayEndTimeDatePicker", element.end_time.slice(0, -3))
                source.set("fridayActive", !!parseInt(element.active))
                break;
            case "saturday":
                source.set("saturdayStartTime", element.start_time.slice(0, -3))
                source.set("saturdayEndTime", element.end_time.slice(0, -3))
                source.set("saturdayStartTimeDatePicker", element.start_time.slice(0, -3))
                source.set("saturdayEndTimeDatePicker", element.end_time.slice(0, -3))
                source.set("saturdayActive", !!parseInt(element.active))
                break;
            case "sunday":
                source.set("sundayStartTime", element.start_time.slice(0, -3))
                source.set("sundayEndTime", element.end_time.slice(0, -3))
                source.set("sundayStartTimeDatePicker", element.start_time.slice(0, -3))
                source.set("sundayEndTimeDatePicker", element.end_time.slice(0, -3))
                source.set("sundayActive", !!parseInt(element.active))
                break;
        }
    })
}

exports.loaded = (args) => {
    const page = args.object.page
    const httpParameters = { url: 'setavailabilityget', method: 'POST', content: {}, }
    sendHTTP(httpParameters, { display: false }, { display: false }, { display: false })
        .then((response) => {
            if (response.JSON.status == "success") {
                setDataOnPage(args, response.JSON.schedule)
            } else {
                console.log("Unable to get schedule for this user")
            }
        }, (e) => {
            console.log(e)
        })


    if (application.android) {application.android.on(application.AndroidApplication.activityBackPressedEvent, backEvent);}
    page.on('goBack', () => {backEvent(args)})
    pageStateChanged = false
}



exports.goBack = (args) => {

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
    } else {
        closeCallback();
    }
}

exports.dayTapped = function (args) {
    pageStateChanged = true;
    const object = args.object
    const parentContainer = object.parent.parent.parent;
    const visibilityContainer = parentContainer.getChildAt(2)
    const checkBox = parentContainer.getChildAt(0).getChildAt(0).getChildAt(1);
    // Check if checkbox is ticked

    setTimeout(function () {
        if (checkBox.checked) {
            if (visibilityContainer.height == 1) {
                if (lastOpenedContainer) {
                    animation(lastOpenedContainer, "reduce section down", { height: 1 })
                }
                lastOpenedContainer = visibilityContainer
                animation(visibilityContainer, "expand section down", { height: 270 })
            } else {
                lastOpenedContainer = null
                animation(visibilityContainer, "reduce section down", { height: 1 })
            }
        }
    }, 100)
}

let functionIsRunningcheckBoxTapped = false
exports.checkBoxTapped = function (args) {
    const object = args.object
    const parentContainer = object.parent.parent.parent;
    const visibilityContainer = parentContainer.getChildAt(2)
    const adjacentText = parentContainer.getChildAt(0).getChildAt(0).getChildAt(0).getChildAt(1);
    //Close column if checkbox is no longer ticked
    //Show text if textbox is clicked
    if (!functionIsRunningcheckBoxTapped) {

        functionIsRunningcheckBoxTapped = true
        setTimeout(function () {
            args.object.isEnabled = false
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
                url: 'setavailabilityactive',
                method: 'POST',
                content: content,
            }
            sendHTTP(httpParameters, { display: false }, { display: false }, { display: false })
                .then((response) => {
                    console.log(response)
                    args.object.isEnabled = true
                }, (e) => {
                    args.object.isEnabled = true
                    args.object.checked = !args.object.checked
                })

            functionIsRunningcheckBoxTapped = false
        }, 125)
    }
}

exports.applyThisToDay = function (args) {
    const object = args.object;
    if (object.active == 'false') {
        object.color = "#A6E6CE"
        object.active = 'true'
    } else {
        object.color = "black"
        object.active = 'false'
    }
}
// Apply these setting to other dates

exports.saveDayAvailabilitySettings = async (args) => {
    const object = args.object
    const container = object.parent
    if (object.text != "saving...") { }
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
    switch (object.parent.parent.parent.getChildAt(0).day) {
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
        if (container.getChildAt(index).active == "true") {
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
                    days.sunday.applyTo = true

                    break;
            }
        }
    }
    animation(object, "expand section width", { width: '30%', duration: 500 })
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
        url: 'setavailability',
        method: 'POST',
        content: content,
    }


    sendHTTP(httpParameters, { display: true }, { display: true }, { display: true })
        .then((response) => {
            object.text = "saved"
            pageStateChanged = false
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
        }, (e) => {
            console.log(e)
            animation(object, "expand section width", { width: '40%', duration: 500 })
            object.text = "error, try again"
        })    
}
