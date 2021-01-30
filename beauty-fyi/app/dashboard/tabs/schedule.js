const { loadAnimation } = require("~/controllers/animationController");
const navigation = require("~/controllers/navigationController")
let calanderBasicObject;
exports.schedulePageLoaded = (args) =>{
    source.set("calanderActive", true)
    const page = args.object.page
    const scehduleListView = [];
    scehduleListView.push(
        {
            serviceName: "Wash and Go",
            serviceImage: '~/images/temp.png',
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
            serviceImage: '~/images/temp1.png',
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
            serviceImage: '~/images/temp2.png',
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
            serviceImage: '~/images/temp3.png',
            clientName: 'Client Name',
            serviceLocation: "137 St Johns Road, Wembley, London, HA9 7JP",
            serviceTime: "18:50 PM",
            serviceDuration: "60 minutes",
            servicePrice: "£150",
            serviceId: "1",
            backgroundColor: "rgb(255, 189, 189)"
        },
    )

    var listview = page.getViewById("scehduleListView");
    listview.items = scehduleListView;
}

source.set("onDateSelected", function(args){
    
})

exports.onViewModeChanged = function(args){
    const isAndroid  = require("tns-core-modules/platform");
    let telCalendar = args.object.nativeView;
    calanderBasicObject = args.object
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

exports.viewFullCalander = async (args) => {
    const object = args.object
    if (source.get("calanderActive")){
        loadAnimation(object, "nudge", { x:0, y: 25 })
        calanderBasicObject.viewMode = "Month";
        await loadAnimation(object, "fade out")
        source.set("calanderActive", false)
        setTimeout(()=>{
            loadAnimation(object, "fade in")
        }, 1000)
    }else{
        loadAnimation(object, "nudge", { x: 0, y: -25 })
        calanderBasicObject.viewMode = "Week";
        await loadAnimation(object, "fade out")
        source.set("calanderActive", true)
        setTimeout(() => {
            loadAnimation(object, "fade in")
        }, 1000)
    }
    
    //expand down calander
    //Reintroduce to object but now pointing up
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