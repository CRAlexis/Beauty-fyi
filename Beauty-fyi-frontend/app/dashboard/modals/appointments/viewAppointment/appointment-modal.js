const Observable = require("tns-core-modules/data/observable").Observable;
const source = new Observable();
const animation = require("~/controllers/animationController").loadAnimation
const slideTransition = require("~/controllers/slide-transitionController");
const navigation = require("~/controllers/navigationController")
let appointmentModalActive = false
let pageObject;
let selectedIndex;
exports.openAppointment = async (args) => {
    return new Promise((resolve, reject) => {
        pageObject = args.object.page
        if (!appointmentModalActive) {
            setTimeout(async function () {
                await animation(pageObject.getViewById("homePageContainer"), "fade out", { opacity: 0.2 })
                pageObject.getViewById("bookingModal").visibility = 'visible';
                await animation(pageObject.getViewById("bookingModal"), "fade in")
                appointmentModalActive = true
                createConsultationList()
                createAddons()
                resolve(true)
            }, 100)
        }
        pageObject.bindingContext = source
    })
}

exports.initCalander = (args) => {
    
    console.log("here")
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

exports.closeAppointmentModal = (args) => {
    return new Promise(async (resolve, reject) => {
        if (appointmentModalActive && selectedIndex != 2) {
            //const page = args.object.page
            await animation(pageObject.getViewById("bookingModal"), "fade out")
            await animation(pageObject.getViewById("homePageContainer"), "fade in")
            pageObject.getViewById("bookingModal").visibility = 'collapsed';
            appointmentModalActive = false
            resolve(false)
        }
    })
}

function createConsultationList(){
    let consultationList = []
    consultationList.push(
        {
            question: 'The first question would go here?',
            answer: 'Then the awnser would go over here.'
        },
        {
            question: 'The second question would go here?',
            answer: 'Then the second awnser would go over here.'
        },
        {
            question: 'The third question would go here?',
            answer: 'Then the third awnser would go over here.'
        },
        {
            question: 'Appointment notes',
            answer: 'The appointment notes would go over here'
        }
    )
    source.set("consultationList", consultationList)
    //var listview = pageObject.getViewById("consultationList");
    //listview.items = consultationList;

    let consultationPhotos = []
    consultationPhotos.push(
        {
            image:'~/images/temp.png' 
        },
        {
            image: '~/images/temp2.png'
        }
         
    )
    source.set("consultationPhotoList", consultationPhotos)
    //var listview = pageObject.getViewById("consultationPhotoList");
    //listview.items = consultationPhotos;
}

function createAddons() {
    let appointmentAddons = []
    appointmentAddons.push(
        {
            id: 0,
            addonText: 'Addon number 1 @£15.00',
            checked: 'false'
        },
        {
            id: 0,
            addonText: 'Addon number 2 @£15.00',
            checked: 'true'
        },
        {
            id: 0,
            addonText: 'Addon number 3 @£15.00',
            checked: 'false'
        },
        {
            id: 0,
            addonText: 'Addon number 4 @£15.00',
            checked: 'true'
        },

        
    )
    var listview = pageObject.getViewById("appointmentAddons");
    listview.items = appointmentAddons;
}

exports.selectedIndexChangeInformation = async (args) => {
    const page = args.object.page
    selectedIndex = args.object.selectedIndex;
    const slides = [page.getViewById("detailsTab"), page.getViewById("consultationTab")]
    //check if on edit tab in here
    switch (parseInt(selectedIndex)) {
        case 0:
            slideTransition.goToCustomSlide(args, 1, 0, null, slides)
            break;
        case 1:
            slideTransition.goToCustomSlide(args, 0, 1, null, slides)
            break;
    }
}

exports.goToProfile = (args) => {
    const mainView = args.object;
    const context = ""
    navigation.navigateToModal(context, mainView, 7, true).then(function (result) {
        
    })
}

exports.editAppointment = async (args) => {
    const page = args.object.page
    const slides = [page.getViewById("detailsTab"), page.getViewById("consultationTab"), page.getViewById("editTab")]
    await animation(page.getViewById("appointmentModalSegmentedBar"), "fade out")
    page.getViewById("appointmentModalSegmentedBar").visibility = "collapsed"
    slideTransition.goToCustomSlide(args, selectedIndex, 2, null, slides)
    selectedIndex = 2;
}

exports.skipSlide = (args) => {
    const page = args.object.page
    const slides = [page.getViewById("editTabSlideOne"), page.getViewById("editTabSlideTwo")]
    slideTransition.goToCustomSlide(args, 0, 1, null, slides)
}

exports.exitEdit = async (args) => {
    const page = args.object.page
    const slides = [page.getViewById("detailsTab"), page.getViewById("consultationTab"), page.getViewById("editTab")]
    await animation(page.getViewById("appointmentModalSegmentedBar"), "fade in")
    page.getViewById("appointmentModalSegmentedBar").visibility = "visible"
    
    slideTransition.goToCustomSlide(args, selectedIndex, 0, null, slides)
    selectedIndex = 0
}

source.set("onDateSelected", (args) => {
    console.log("picked")
    const page = args.object.page
    //const date = dateFormat(args.date, "dddd, mmmm dS, yyyy");
    //const day = dateFormat(args.date, "d")
    //const month = dateFormat(args.date, "mmmm")
    page.getViewById("editAppointmentAvaliableTimes").visibility = "visible";

    
    let times = []
    times.push(
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
    var listview = page.getViewById("editAppointmentAvaliableTimes");
    listview.items = times;
})

exports.timeSelected = (args) => {
    const timeLabel = args.object.getChildAt(0)
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
}

exports.modifyAppointment = async (args) => {
    const page = args.object.page
    const slides = [page.getViewById("detailsTab"), page.getViewById("consultationTab"), page.getViewById("editTab")]
    await animation(page.getViewById("appointmentModalSegmentedBar"), "fade in")
    page.getViewById("appointmentModalSegmentedBar").visibility = "visible"

    slideTransition.goToCustomSlide(args, selectedIndex, 0, null, slides)
    selectedIndex = 0
    // save details()
}

exports.goBackEdit = (args) => {
    const page = args.object.page
    const slides = [page.getViewById("editTabSlideOne"), page.getViewById("editTabSlideTwo")]
    slideTransition.goToCustomSlide(args, 1, 0, null, slides)
}

exports.dropDownClicked = (args) => {
    const mainView = args.object;
    let context = mainView.optionContext.split(",")
    navigation.navigateToModal(context, mainView, 4, false).then(function (result) {
            args.object.text = result
    })
}