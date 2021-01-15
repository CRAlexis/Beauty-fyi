const dateFormat = require('dateformat');
const { loadAnimation } = require('~/controllers/animationController');
let lastSelectedTime = null
let date;
let time;
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

exports.dateSelected = (args) => {
    const page = args.object.page
    return new Promise((resolve) => {
        date = dateFormat(args.date, "fullDate");
        console.log(date.replace(/,/g, ''))
        const day = dateFormat(args.date, "d")
        const month = dateFormat(args.date, "mmmm")
        page.getViewById("bookAppointmentAvaliableTimes").visibility = "visible";
        page.getViewById("onTimeSelectedText").text = "Availability on the " + day + "th of " + month;
        createNewTimes(args)
        resolve()
    })
}

function createNewTimes(args){
    const page = args.object.page
    let times = []
    for (let index = 0; index < 6; index++) {
        a = Math.floor(Math.random() * 23) + 1;
        b = Math.floor((Math.random() * 11) + 1) * 5;
        times.push({ time: a + ":" + b})
    }

    //format photos when uploading
    var listview = page.getViewById("bookAppointmentAvaliableTimes");
    listview.items = []
    listview.items = times;
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
        loadAnimation(timeLabel.parent, "change background color", { color: '#A6E6CE'})
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