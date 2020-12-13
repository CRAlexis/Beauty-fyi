const navigation = require("~/controllers/navigationController")
exports.schedulePageLoaded = (args) =>{

    const page = args.object.page
    const scehduleListView = [];
    scehduleListView.push(
        {
            serviceName: "Wash and Go",
            clientName: 'Client Name',
            serviceLocation: "At the salon",
            serviceTime: "9:50 AM",
            serviceDuration: "60 minutes",
            servicePrice: "£50",
            serviceId: "1",
            backgroundColor: "rgb(211, 206, 255)"
        },
        {
            serviceName: "Braid Installation",
            clientName: 'Client Name',
            serviceLocation: "At the salon",
            serviceTime: "11:50 AM",
            serviceDuration: "60 minutes",
            servicePrice: "£90",
            serviceId: "1",
            backgroundColor: "rgb(255, 189, 189)"
        },
        {
            serviceName: "Lunch Break",
            clientName: 'Client Name',
            serviceLocation: "At the salon",
            serviceTime: "13:20 PM",
            serviceDuration: "60 minutes",
            servicePrice: "",
            serviceId: "1",
            backgroundColor: "rgb(211, 206, 255)"
        },
        {
            serviceName: "Dreadlocks Retwist",
            clientName: 'Client Name',
            serviceLocation: "137 St Johns Road, Wembley, London, HA9 7JP",
            serviceTime: "18:50 PM",
            serviceDuration: "60 minutes",
            servicePrice: "£150",
            serviceId: "1",
            backgroundColor: "rgb(255, 189, 189)"
        },
    )

    var listview = page.getViewById("serviceList");
    listview.items = scehduleListView;
}

source.set("onDateSelected", function(args){
    
})

exports.onViewModeChanged = function(args){
    const isAndroid  = require("tns-core-modules/platform");
    let telCalendar = args.object.nativeView;
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

source.set("setSchedulingLimits", function(args){
    const mainView = args.object;
    const context = ""

    navigation.navigateToModal(context, mainView, 9, true).then(function (result) {
        console.log(result)
    })
})

source.set("setScheduleAvailibility", function (args) {
    const mainView = args.object;
    const context = ";"
    navigation.navigateToModal(context, mainView, 10, true).then(function (result) {
        console.log(result)
    })
})

source.set("addService", function(args){
    const mainView = args.object;
    const context = ""
    navigation.navigateToModal(context, mainView, 11, true).then(function (result) {
        console.log(result)
    })
})