const Observable = require("tns-core-modules/data/observable").Observable;
const application = require('application');
const navigation = require("~/controllers/navigationController")
const inAppNotifiationAlert = require("~/controllers/notifications/inApp/notification-alert.js")
const slideTransition = require("~/controllers/slide-transitionController");
const source = new Observable();
let sourceForm;
let closeCallback;
let slideIndex;
let slides = []
let context;
let chooseDate;

exports.onShownModally = function (args) {
    context = args.context;
    closeCallback = args.closeCallback;
    const page = args.object;
    page.bindingContext = source
    setTimeout(function () { source.set("width", (page.getMeasuredWidth() / 3)) }, 500)
    formatContext(context)
    
}

exports.loaded = function (args) { //third slide
    if (application.android) { application.android.on(application.AndroidApplication.activityBackPressedEvent, backEvent); }
    const page = args.object.page
    sourceForm = new Observable()
    chooseDate = require("~/dashboard/modals/salonPage/bookService/js/choose-date")
    consultation = require("~/dashboard/modals/salonPage/bookService/js/consultation")
    slideIndex = 0
    console.log("Resetsetset")
    slides = [page.getViewById("chooseDateSlide"), page.getViewById("consultationSlide"), page.getViewById("confirmationSlide"), page.getViewById("addPaymentSlide") ]
}

function formatContext(context){
    // In here I need to request the length of the service - price and other details - addons etc
    // I would need to cycle through the services in order - Might be best after payment to close the entire modal with context to re open it
    console.log(context.servicesTapped)
    console.log(context.addonsTapped)
    // Here send a request to jj to get available times and information about the services picked
    // Going back and multiple services
}



exports.goBack = function (args) {
    backEvent(args)
}

function backEvent(args) { // This event is a bit funny
    console.log("Here")
    args.cancel = true;
    if (slideIndex == 0) {
        inAppNotifiationAlert.areYouSure("Are you sure you want to exit?").then(function (result) {
            if (result) { exitModal(args) }
        })
    } else {
        slideTransition.goToPreviousSlide(args, slideIndex, source, slides).then(function (result) {
            slideIndex = result
        })
    }
}

exports.goToNextSlide = (args) => { goToNextSlide(args) }

function goToNextSlide(args){
    switch (slideIndex) {
        case 0:
            slideTransition.goToNextSlide(args, slideIndex, source, slides).then(function (result) {
                changeContinueButtontext(args, "")
                slideIndex = result
            })
            break;
        case 1:
            slideTransition.goToNextSlide(args, slideIndex, source, slides).then(function (result) {
                changeContinueButtontext(args, "")
                slideIndex = result
            })
            break;
        case 2:
            slideTransition.goToNextSlide(args, slideIndex, source, slides).then(function (result) {
                changeContinueButtontext(args, "")
                slideIndex = result
            })
            break;
        case 3:
            //successx
            break;
        }
}

source.set("dropDownClicked", function (args){
    const mainView = args.object;
    let context = mainView.optionContext.split(",")
    navigation.navigateToModal(context, mainView, 4, false).then(function (result) {
       
    })
})

function changeContinueButtontext(args, text) {
    const page = args.object.page;
    page.getViewById("continueButton").text = text
}



/* ----------- Choose Date ---------------------------*/
exports.onCalanderLoad = function (args) { setTimeout(function () { chooseDate.initialise(args)}, 250)  }

source.set("onDateSelected", function (args) {
    chooseDate.dateSelected(args).then(function (result){
        
    })
})

source.set("onTimeSelected", function (args) {
    const page = args.object.page
    chooseDate.timeSelected(args).then(function (result){
        page.getViewById("continueButton").text = "continue"
    })
})

/*-----------------Consultation--------------------*/

source.set("uploadReferenceImage", function(args){
    consultation.uploadeReferenceImage(args)
})

source.set("uploadedImageTapped", function(args){
    consultation.referenceimageTapped(args)
})

/*---------------------Confirmation-------------------*/

source.set("openCardModal", function(args){
    bookAppointmentSlideTransition.goToNextSlide(args, slideIndex, source).then(function (result) {
        slideIndex = result;
    })
})

function initConfirmationPage(args){
    const page = args.object.page;
    let paymentItems = []
    paymentItems.push(
        {
            serviceName: 'Braid Installation',
            servicePrice: "£100",
            class: "h5"
        },
        {
            serviceName: '24 inch hair',
            servicePrice: "£30",
            class: "h5"
        },
        {
            serviceName: 'To pay now',
            servicePrice: "£75",
            class: "h5 font-bold"
        },
        {
            serviceName: 'Total',
            servicePrice: "£150",
            class: "h5 font-bold"
        }
    )
    //context.addonsTapped.forEach(element => {
    //    paymentItems.push({
    //        serviceName: element.addonId,
    //        servicePrice: element.serviceId
    //    })
    //});

    var listview = page.getViewById("paymentList");
    listview.items = paymentItems;
}