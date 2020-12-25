const Observable = require("tns-core-modules/data/observable").Observable;
const navigation = require("~/controllers/navigationController")
const animation = require("~/controllers/animationController").loadAnimation;
const sendHTTP = require("~/controllers/HTTPControllers/sendHTTP").sendHTTP;
let source = new Observable();

let closeCallback;
let lastOpenedContainer;

exports.onShownModally = function (args) {
    const context = args.context;
    closeCallback = args.closeCallback;
    const page = args.object;
    page.bindingContext = source
}

exports.loaded = (args) => {
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
}



exports.goBack = (args) => {
    // Would send http request in here to update the information
    const httpParameters = {
        url: "url",
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        content: {}
    }
    sendHTTP(httpParameters).then(function (result) {
        //This page needs work

    }, (error) => {

    })
}

exports.dayTapped = function(args){
    const object = args.object
    const parentContainer = object.parent.parent.parent;
    const visibilityContainer = parentContainer.getChildAt(2)
    const checkBox = parentContainer.getChildAt(0).getChildAt(0).getChildAt(1);
    // Check if checkbox is ticked

    console.log("checked: " + checkBox.checked)
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
            functionIsRunningcheckBoxTapped = false
        }, 500)    
    }
}

// Time modal
exports.openTimeModal = function (args) {
    const day = args.object.parent.parent.getChildAt(0).day
    const mainView = args.object;

    switch (day) {
        case 'monday':
            const context =  { mondayTimeOne: source.get("mondayStartTime"), mondayTimeTwo: source.get("mondayEndTime") }
            navigation.navigateToModal(context, mainView, 5, false).then(function (result) {
                if (timeOne) { source.set("mondayStartTime", timeOne) }
                if (timeTwo) { source.set("mondayEndTime", timeTwo) }
            })  
            break;
        default:
            break;
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
    
    for (let index = 0; index < 6; index++) {
        if (container.getChildAt(index).active == "true"){
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
    console.log(source.get("mondayActive"))
    animation(object, "expand section width", {width: '30%', duration: 500})
    object.text = "saving..."
    //send
    //button to saved
    const content = JSON.stringify({
        startTime: startTime,
        endTime: endTime,
        location: '',
        monday: days.monday,
        tuesday: days.tuesday,
        wednesday: days.wednesday,
        thursday: days.thursday,
        friday: days.friday,
        saturday: days.saturday,
        sunday: days.sunday,
    })
    const httpParameters = {
        url: 'http://192.168.1.12:3333/scheduleavailabilityday',
        method: 'POST',
        content: content,
    }
    sendHTTP(httpParameters)
        .then((response) => {
            object.text = "saved"
        }, (e) => {
            console.log(e)
                animation(object, "expand section width", { width: '40%', duration: 500 })
                object.text = "error, try again"
        })
}