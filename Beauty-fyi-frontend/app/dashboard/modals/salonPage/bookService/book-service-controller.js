const Observable = require("tns-core-modules/data/observable").Observable;
const mPicker = require("nativescript-mediafilepicker");
const mediafilepicker = new mPicker.Mediafilepicker();
const application = require('application');
let dropDownlist;
let bookAppointmentSlideTransition;
let firstSlide;
let secondSlide;
let thirdSlide;
let fifthSlide;
const source = new Observable();
let serviceDropDownActive;
let closeCallback;
let slideIndex;
let selectedDate;
let selectedTime;
// Need to keep an eye on this just incase multiple instances are still open

let ImagePickerOptions = {
    android: {
        isCaptureMood: false, // if true then camera will open directly.
        isNeedCamera: true,
        maxNumberFiles: 10,
        isNeedFolderList: true
    }, ios: {
        isCaptureMood: false, // if true then camera will open directly.
        isNeedCamera: true,
        maxNumberFiles: 10
    }
};

let mediafilepicker = new Mediafilepicker();
mediafilepicker.openImagePicker(options);

mediafilepicker.on("getFiles", function (res) {
    let results = res.object.get('results');
    console.dir(results);
});


exports.onShownModally = function (args) {
    initVariables(args)
    const context = args.context;
    closeCallback = args.closeCallback;
    const page = args.object;
    page.bindingContext = source
}

function initVariables(args){
    dropDownlist = "~/dashboard/modals/form/drop-down-list-modal";
    bookAppointmentSlideTransition = require("~/dashboard/modals/salonPage/bookService/book-appointment-slide-transition.js");
    serviceDropDownActive = [false, false];
    closeCallback;
    slideIndex = 1
    selectedDate;
    selectedTime;
    source.set("slideTitle", "Choose appointment")
    source.set("nextSlideTitle", "Choose a date")
    initAvailableTimes(args) // This will change, cause ill get the times from JJ when they choose a date  
}

exports.loaded = function (args){ //third slide
    // We only want to register the event in Android
        if (application.android) {
            application.android.on(application.AndroidApplication.activityBackPressedEvent, backEvent);
        }
    
      
}

exports.pageUnloaded = function () {
    // We only want to un-register the event on Android
    if (application.android) {
        application.android.off(application.AndroidApplication.activityBackPressedEvent, backEvent);
    }
};

function backEvent(args) {//Show modal
    args.cancel = true;
    inAppNotifiationAlert.areYouSure("Are you sure you want to exit?").then(function(result){
        console.log(result)
        if (result) { exitModal() }
    })

}

function exitModal(){
    console.log("here")
    closeCallback();
}

exports.exitExport = function (args, string) { // What if someone accidently clicks of the modal - Might have to save it to device memory
    
}

source.set("goToNextSlide", function(args){
    bookAppointmentSlideTransition.goToNextSlide(args, slideIndex, source).then(function(result){
        slideIndex = result;
    })
})

source.set("goToPreviousSlide", function (args) {
    bookAppointmentSlideTransition.goToPreviousSlide(args, slideIndex, serviceDropDownActive, selectedDate, selectedTime, source).then(function (result) {
        slideIndex = result;
        if (slideIndex == 1) {//Because the times may have refreshed and dates may have refreshed
            selectedDate = null; // I will need to remove calalnde date selected and also remove the times (rad list)
            selectedTime = null;
        }
        
    })
})

source.set("serviceTapped", function (args){
    //firstSlide.serviceTapped(args, serviceDropDownActive)
})

source.set("dropDownClicked", function (args){
    const mainView = args.object;
    let optionContext = [];
    optionContext = ['Option 1', 'Option 2', 'Option 3', 'Option 4'];
    const option = {
        // Gona need to send a http request to JJ to get client information
        context: {
            optionContext
        },
        closeCallback: (option) => {
            // Receive data from the modal view. e.g. username & password

            console.log(`${option}`)
            args.object.text = option
        },
        fullscreen: false
    };
    mainView.showModal(dropDownlist, option);
})



source.set("expandSectionFifthSlide", function(args){
    console.log(1)
    //fifthSlide.expandSection(args, source)
})



/* ----------- Choose Date ---------------------------*/
const dateFormat = require('dateformat');
let lastSelectedTime = null
function initAvailableTimes (args) {
    const page = args.object.page
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
    var listview = page.getViewById("bookAppointmentAvaliableTimes");
    listview.items = times;
}

source.set("onDateSelected", function (args) {
    dateSelected(args).then(function (result){
        selectedDate = result;
    })
})

source.set("onTimeSelected", function (args) {
    timeSelected(args).then(function (result){
        selectedTime = result;
    })
})

function dateSelected (args) {
    const page = args.object.page

    return new Promise(resolve => {
        const date = dateFormat(args.date, "dddd, mmmm dS, yyyy");
        const day = dateFormat(args.date, "d")
        const month = dateFormat(args.date, "mmmm")
        page.getViewById("bookAppointmentAvaliableTimes").visibility = "visible";
        page.getViewById("onTimeSelectedText").text = "Availability on the " + day + "th of " + month;
        resolve(date)
    })
}

function timeSelected (args) {
    const timeLabel = args.object.getChildAt(0)

    return new Promise(resolve => {
        if (timeLabel == lastSelectedTime) { // This deselects the current time if clicked twice
            timeLabel.color = "black"
            lastSelectedTime = null;
            timeLabel.id = ""
            resolve(null)
            return;
        } else if (lastSelectedTime != null) { // This changes previous time to black when new time is clicked
            lastSelectedTime.color = "black"
            lastSelectedTime.id = ""
        }
        timeLabel.id = "currentSelectedTimeLabel" // This sets new time clicked and sets it to preivousTime
        timeLabel.color = "purple"; // this will change
        lastSelectedTime = timeLabel;
        resolve(timeLabel.text)
    })
}

