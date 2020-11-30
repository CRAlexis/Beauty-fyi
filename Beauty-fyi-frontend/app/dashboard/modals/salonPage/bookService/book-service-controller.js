const Observable = require("tns-core-modules/data/observable").Observable;
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
let dateSelected;
let timeSelected;
// Need to keep an eye on this just incase multiple instances are still open





exports.onShownModally = function (args) {
    initVariables(args)
    const context = args.context;
    closeCallback = args.closeCallback;
    const page = args.object;
    page.bindingContext = source
}

function initVariables(args){
    //dropDownlist = "~/dashboard/modals/form/drop-down-list-modal";
    //bookAppointmentSlideTransition = require("~/dashboard/modals/appointments/book-appointment-slide-transition.js");
    //firstSlide = require("~/dashboard/modals/appointments/first-slide.js")
    //secondSlide = require("~/dashboard/modals/appointments/second-slide.js")
    //thirdSlide = require("~/dashboard/modals/appointments/third-slide.js")
    //fifthSlide = require("~/dashboard/modals/appointments/fifth-slide.js")
    serviceDropDownActive = [false, false];
    closeCallback;
    slideIndex = 1
    dateSelected;
    timeSelected;
    //source.set("slideTitle", "Choose appointment")
    //source.set("nextSlideTitle", "Choose a date")
    //secondSlide.initAvailableTimes(args) // This will change, cause ill get the times from JJ when they choose a date  
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
    bookAppointmentSlideTransition.goToNextSlide(args, slideIndex, serviceDropDownActive, dateSelected, timeSelected, source).then(function(result){
        slideIndex = result;
    })
})

source.set("goToPreviousSlide", function (args) {
    bookAppointmentSlideTransition.goToPreviousSlide(args, slideIndex, serviceDropDownActive, dateSelected, timeSelected, source).then(function (result) {
        slideIndex = result;
        if (slideIndex == 1) {//Because the times may have refreshed and dates may have refreshed
            dateSelected = null; // I will need to remove calalnde date selected and also remove the times (rad list)
            timeSelected = null;
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

source.set("onDateSelected",  function (args) {
    //secondSlide.dateSelected(args).then(function (result){
    //    dateSelected = result;
    //})
})

source.set("onTimeSelected", function (args){
    //secondSlide.timeSelected(args).then(function (result){
    //    timeSelected = result;
    //})
})

source.set("expandSectionFifthSlide", function(args){
    console.log(1)
    //fifthSlide.expandSection(args, source)
})



/* ----------- Choose Date ---------------------------*/
const dateFormat = require('dateformat');
let lastSelectedTime = null
exports.initAvailableTimes = function (args) {
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

exports.dateSelected = function (args) {
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

exports.timeSelected = function (args) {
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

