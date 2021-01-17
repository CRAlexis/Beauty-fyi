const Observable = require("tns-core-modules/data/observable").Observable;
const application = require('application');
const navigation = require("~/controllers/navigationController")
const inAppNotifiationAlert = require("~/controllers/notifications/inApp/notification-alert.js")
const slideTransition = require("~/controllers/slide-transitionController");
const { loadAnimation } = require("~/controllers/animationController");
const { sendHTTPFile } = require("~/controllers/HTTPControllers/sendHTTP");
const source = new Observable();
let sourceForm;
let closeCallback;
let slideIndex;
let slides = []
let context;
let chooseDate;
let userID;
let addonArray;
let serviceID;

exports.onShownModally = function (args) {
    context = args.context;
    userID = context.userID
    addonsArray = context.addons
    serviceID = context.serviceID
    closeCallback = args.closeCallback;
    const page = args.object;
    page.bindingContext = source
    setTimeout(function () { source.set("width", (page.getMeasuredWidth() / 3)) }, 500)
    
}

exports.loaded = function (args) { //third slide
    if (application.android) { application.android.on(application.AndroidApplication.activityBackPressedEvent, backEvent); }
    const page = args.object.page
    sourceForm = new Observable()
    chooseDate = require("~/dashboard/modals/salonPage/bookService/js/choose-date")
    consultation = require("~/dashboard/modals/salonPage/bookService/js/consultation")
    confirmation = require("~/dashboard/modals/salonPage/bookService/js/confirmation")
    slideIndex = 0
    slides = [page.getViewById("chooseDateSlide"), page.getViewById("consultationSlide"), page.getViewById("confirmationSlide"), page.getViewById("successSlide") ]
    initialiseConsultationPage(args)
    initConfirmationPage(args)

    //listener to close modals in here
    page.on('headerBarClicked', (args) => {
        
    })
    page.on('goBack', () => {
        backEvent(args)
    })
}


function backEvent(args) { // This event is a bit funny
    args.cancel = true;
    if (slideIndex == 3) { exitModal(args) }
    if (slideIndex == 0) {
        inAppNotifiationAlert.areYouSure("Are you sure you want to exit?", "Your information will not be saved").then(function (result) {
            if (result) { exitModal(args) }
        })
    } else {
        slideTransition.goToPreviousSlide(args, slideIndex, source, slides).then(function (result) {
            slideIndex = result
        })
    }
}

function exitModal(args) {
    //Delete all info
    const page = args.object.page

    if (application.android) {
        application.android.off(application.AndroidApplication.activityBackPressedEvent, backEvent);
        closeCallback();
    }
}

exports.goToNextSlide = (args) => { goToNextSlide(args) }

async function goToNextSlide(args){
    const page = args.object.page
    switch (slideIndex) {
        case 0: 
            slideTransition.goToNextSlide(args, slideIndex, source, slides).then(function (result) {
                slideIndex = result
                hideContinueButton(args)
            })
            break;
        case 1: 
            await chooseDate.getData(args, sourceForm)
            await consultation.getData(args, sourceForm)
            confirmation.initialise(args, sourceForm)
            console.log(sourceForm)
            slideTransition.goToNextSlide(args, slideIndex, source, slides).then(function (result) {
                slideIndex = result
                page.getViewById("continueButton").text = "Confirm appointment"
            })
            break;
        case 2:   
            //sendHttp(args).then((result) => {
            //    slideTransition.goToNextSlide(args, slideIndex, source, slides).then(function (result) {
            //        slideIndex = result
            //        page.getViewById("continueButton").text = "Finish"
            //    })
            //}, (e) => {
            //        // Im not sure what to do here.
            //})
            break;
           //success here
        }
}

source.set("dropDownClicked", function (args) {
    const mainView = args.object;
    let context = mainView.optionContext.split(",")
    navigation.navigateToModal(context, mainView, 4, false).then(function (result) {
            args.object.text = result
   
    })
})

async function makeContinueButtonAppear(args) {
    const page = args.object.page;
    page.getViewById("continueButton").visibility = "visible"
    await loadAnimation(page.getViewById("continueButton"), "fade in")
}

async function hideContinueButton(args) {
    const page = args.object.page;
    await loadAnimation(page.getViewById("continueButton"), "fade out")
    page.getViewById("continueButton").visibility = "collapsedd"
}

function sendHttp(args) {
    return new Promise((resolve, reject)=>{
        let files = []
        sourceForm.get("images").forEach(element => {
            files.push({
                name: "photo[]",
                filename: element,
                mimeType: "image/jpeg"
            })
        })
        const httpParametersPicture = {
            url: "bookservice",
            method: 'POST',
            description: "Booking service",
            file: files,
            content: {
                date: sourceForm.get("date"),
                time: sourceForm.get("time"),
                consultationAnswers: sourceForm.get("consultationAnswers"),
                appointmentNotes: sourceForm.get("appointmentNotes"),
                userID: userID,
                addons: addonArray,
                serviceID: serviceID,

            }
        }
        sendHTTPFile(httpParametersPicture).then((result) => {
            resolve()
        }, (error) => {
            reject()
        })
    })
}


/* ----------- Choose Date ---------------------------*/
exports.onCalanderLoad = function (args) { setTimeout(function () { chooseDate.initialise(args)}, 250)  }

source.set("onDateSelected", function (args) {
    chooseDate.dateSelected(args).then(function (result){
        hideContinueButton(args)
    })
})

source.set("onTimeSelected", function (args) {
    chooseDate.timeSelected(args).then((result) =>{
        makeContinueButtonAppear(args)
    }, (e) =>{
        hideContinueButton(args)
    })
})

/*-----------------Consultation--------------------*/

function initialiseConsultationPage(args){
    consultation.initialise(args)
}

exports.templateSelector = (item, index, items) => {
    return consultation.templateSelector(item, index, items)
}

exports.validateConsultationPage = (args) => {
    consultation.validateConsultationPage(args).then((result) => {
        makeContinueButtonAppear(args)
    }, (e) => {
        hideContinueButton(args)
    })
}

source.set("uploadReferenceImage", function(args){
    consultation.uploadeReferenceImage(args)
})

source.set("uploadedImageTapped", function(args){
    consultation.referenceimageTapped(args)
})

/*---------------------Confirmation-------------------*/

exports.openCardModal = (args) =>{
    bookAppointmentSlideTransition.goToNextSlide(args, slideIndex, source).then(function (result) {
        slideIndex = result;
    })
}

/*--------------Payment--------------*/
exports.paymentMethodAction = (args)=>{
    confirmation.paymentMethodAction(args)
    if (application.android) {
        application.android.off(application.AndroidApplication.activityBackPressedEvent, backEvent);
        application.android.on(application.AndroidApplication.activityBackPressedEvent, closeModal);
    }
}


