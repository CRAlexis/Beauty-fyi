const dateFormat = require('dateformat');
const { loadAnimation } = require('~/controllers/animationController');
let lastSelectedTime = null
let date;
let time;
let rawDate;
exports.initialise = (args) => {
    const isAndroid = require("tns-core-modules/platform");
    let telCalendar = args.object.getChildAt(0).nativeView;
    if (isAndroid) {
        let gestureManager = telCalendar.getGestureManager();
        gestureManager.setDoubleTapToChangeDisplayMode(false);
        gestureManager.setPinchCloseToChangeDisplayMode(false)
        gestureManager.setPinchOpenToChangeDisplayMode(false)
        gestureManager.setSwipeDownToChangeDisplayMode(false)
        gestureManager.setSwipeUpToChangeDisplayMode(false)
        gestureManager.setTapToChangeDisplayMode(false)
        //gestureManager.SetSwipeDownToChangeDisplayMode(false);
    } else {
        telCalendar.allowPinchZoom = false;
        telCalendar.setDoubleTapToChangeDisplayMode = false; // Will need test this
        telCalendar.SetSwipeDownToChangeDisplayMode = false; // Will need test this
        //Will need print out all of gesutre managers methods for apple
    }



}

exports.dateSelected = (args, sendHTTP, serviceID, clientID, addonsArray, sourceForm) => {
    const page = args.object.page
    return new Promise((resolve) => {
        rawDate = args.date
        date = dateFormat(args.date, "fullDate");
        console.log(date.replace(/,/g, ''))
        const day = dateFormat(args.date, "d")
        const month = dateFormat(args.date, "mmmm")
        page.getViewById("bookAppointmentAvaliableTimes").visibility = "visible";
        let suffix;
        switch (parseInt(day)) {
            case 1:
                suffix = "st"
                break;
            case 2:
                suffix = "nd"
                break;
            case 3:
                suffix = "rd"
                break;
            case 21:
                suffix = "st"
                break
            case 22:
                suffix = "nd"
                break;
            case 23:
                suffix = "rd"
                break;
            case 31:
                suffix = "st"
                break;
            default:
                suffix = "th"
                break;
        }
        page.getViewById("onTimeSelectedText").text = "Availability on the " + day + suffix + " of " + month;
        getAvailableTimes(args, sendHTTP, date, serviceID, clientID, addonsArray, sourceForm)
        resolve()
    })
}

function getAvailableTimes(args, sendHTTP, date, serviceID, clientID, addonsArray, sourceForm) {
    try {
        const page = args.object.page
        const httpParameters = { url: 'availabletimesget', method: 'POST', content: { date: rawDate, serviceID: serviceID, clientID: clientID, addonIDs: addonsArray } }
        sendHTTP(httpParameters, { display: false }, { display: false }, { display: false })
            .then((response) => {
                if (response.JSON.status == "success") {
                    createNewTimes(args, response.JSON.times)
                    sourceForm.set("duration", response.JSON.duration)
                } else {
                    page.getViewById("bookAppointmentAvaliableTimes").items = []
                }
            }, (e) => {
                console.log(e)
            })
    } catch (error) {
        console.log(error)
    }

}

function createNewTimes(args, times) {
    const page = args.object.page
    let timeArray = []
    times.forEach(element => {
        timeArray.push({
            time: element.hour + ":" + element.minute,
            hour: element.hour,
            minute: element.minute,
        })
    })
    //format photos when uploading
    var listview = page.getViewById("bookAppointmentAvaliableTimes");
    listview.items = []
    listview.items = timeArray;
}
exports.timeSelected = (args) => {
    const timeLabel = args.object.getChildAt(0)
    return new Promise((resolve, reject) => {
        if (timeLabel == lastSelectedTime) { // This deselects the current time if clicked twice
            timeLabel.color = "black"
            lastSelectedTime = null;
            timeLabel.id = ""
            time = ""
            loadAnimation(timeLabel.parent, "change background color", { color: 'white' })
            reject()
            return;
        } else if (lastSelectedTime != null) { // This changes previous time to black when new time is clicked
            lastSelectedTime.color = "black"
            lastSelectedTime.id = ""
            loadAnimation(lastSelectedTime.parent, "change background color", { color: 'white' })
        }
        time = timeLabel.text
        timeLabel.id = "currentSelectedTimeLabel" // This sets new time clicked and sets it to preivousTime
        timeLabel.color = "white"; // this will change
        loadAnimation(timeLabel.parent, "change background color", { color: '#A6E6CE' })
        lastSelectedTime = timeLabel;
        resolve()
    })
    // When time is clicked make button say whatever
    // Work on next slide    
}

exports.getData = (args, sourceForm) => {
    sourceForm.set("date", date.replace(/,/g, ''))
    sourceForm.set("time", time)
}

//when date and time are selected
// If time is selected but date changes