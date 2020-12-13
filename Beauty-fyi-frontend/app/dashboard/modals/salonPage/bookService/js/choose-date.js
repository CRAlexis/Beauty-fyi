const dateFormat = require('dateformat');
let lastSelectedTime = null
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

    const page = args.object.page
    let times = []
    times.push(// This will change, cause ill get the times from JJ when they choose a date  
        {
            time: '13:30'
        },
        {
            time: '14:30'
        },
        {
            time: '15:00'
        },
        {
            time: '16:30'
        },
        {
            time: '17:00'
        },
        {
            time: '18:30'
        },
    )
    //format photos when uploading
    var listview = page.getViewById("bookAppointmentAvaliableTimes");
    listview.items = times;
}

exports.dateSelected = (args) => {
    const page = args.object.page

    return new Promise(resolve => {
        const date = dateFormat(args.date, "dddd, mmmm dS, yyyy");
        const day = dateFormat(args.date, "d")
        const month = dateFormat(args.date, "mmmm")
        page.getViewById("bookAppointmentAvaliableTimes").visibility = "visible";
        page.getViewById("onTimeSelectedText").text = "Availability on the " + day + "th of " + month;
    })
}

exports.timeSelected = (args) => {
    const timeLabel = args.object.getChildAt(0)

    return new Promise(resolve => {
        if (timeLabel == lastSelectedTime) { // This deselects the current time if clicked twice
            timeLabel.color = "black"
            lastSelectedTime = null;
            timeLabel.id = ""
            return;
        } else if (lastSelectedTime != null) { // This changes previous time to black when new time is clicked
            lastSelectedTime.color = "black"
            lastSelectedTime.id = ""
        }
        timeLabel.id = "currentSelectedTimeLabel" // This sets new time clicked and sets it to preivousTime
        timeLabel.color = "purple"; // this will change
        lastSelectedTime = timeLabel;
    })
    // When time is clicked make button say whatever
    // Work on next slide
    
}