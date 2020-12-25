const Observable = require("tns-core-modules/data/observable").Observable;
const application = require('application');
const { sendHTTPFile } = require("~/controllers/HTTPControllers/sendHTTP");
const sendHTTP = require("~/controllers/HTTPControllers/sendHTTP").sendHTTP;
const navigation = require("~/controllers/navigationController")
const inAppNotifiationAlert = require("~/controllers/notifications/inApp/notification-alert.js")
const slideTransition = require("~/controllers/slide-transitionController");
const textFieldFormatting = require("~/controllers/textfield-formattingController");
let selectAPhotoJs;
let serviceNameJs;
let serviceSteps;
let addAddonJs;
let source = new Observable();
let sourceForm;
let slideIndex = 0
let slides = []


exports.onShownModally = function(args) {
    const context = args.context;
    closeCallback = args.closeCallback;
    const page = args.object;
    page.bindingContext = source
    // get option context to know if we editing the service - so ican change continue button to save changes or something
    
}

exports.pageLoaded = function(args){
    const page = args.object.page
    if (application.android) {
        application.android.on(application.AndroidApplication.activityBackPressedEvent, backEvent);
    }
    sourceForm = new Observable();
    source.set("title", "Add a service")
    selectAPhotoJs = require("~/dashboard/modals/service/add-service/js/select-a-photo")
    serviceNameJs = require("~/dashboard/modals/service/add-service/js/service-name")
    serviceSteps = require("~/dashboard/modals/service/add-service/js/service-steps")
    paddingTime = require("~/dashboard/modals/service/add-service/js/padding-time")
    addAddonJs = require("~/dashboard/modals/service/add-service/js/add-addon")
    createServiceFinalSlide = require("~/dashboard/modals/service/add-service/js/create-service-final-slide")
    initialiseThirdSlide(args)
    initialiseFifthSlide(args)
    slideIndex = 0
    slides = [page.getViewById("selectAPhotoSlide"), page.getViewById("serviceNameSlide"), page.getViewById("serviceStepsSlide"), page.getViewById("paddingTimeSlide"), page.getViewById("addonsSlide"), page.getViewById("createServiceFinalSlide"), page.getViewById("addForm"), page.getViewById("addServiceSuccess")]
    
}

exports.goToNextSlide = function goToNextSlideFunction(args){
    goToNextSlide(args)
}

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
                slideIndex = result
                slideValidated(args)
            })
            break;
        case 2:
            
            slideTransition.goToNextSlide(args, slideIndex, source, slides).then(function (result) {
                slideIndex = result
                slideValidated(args)
            })
            break;
        case 3:
            paddingTime.getPaddingData(args, sourceForm)
            slideTransition.goToNextSlide(args, slideIndex, source, slides).then(function (result) {
                slideIndex = result
                slideValidated(args)
            })
            break;
        case 4:
            slideTransition.goToNextSlide(args, slideIndex, source, slides).then(function (result) {
                changeContinueButtontext(args, "Create service")
                slideIndex = result
            })
            break;
        case 5:
            createServiceFinalSlide.getData(args, sourceForm)
            sendDataToBackEnd(args).then((result) => {
                console.log("success?")
                slideTransition.goToCustomSlide(args, slideIndex, 7, source, slides).then(function (result) {
                    changeContinueButtontext(args, "Go To Dashboard")
                    slideIndex = result
                })
            }, error => {
                // There was an error....
                // Try again?
            })
            break;
        case 6:
            slideTransition.goToPreviousSlide(args, slideIndex, source, slides).then(function (result) {
                slideIndex = result
            })
            break;       
        case 7:
            closeCallback()
    }
}

function sendDataToBackEnd(args){
    return new Promise((resolve, reject) => {
        setLoadingStyle(args, 0)
        sendData(args).then((result)=>{
            resolve()
        }, (error) =>{
            reject(error)
        }).finally((result) => {    
            setLoadingStyle(args, 1)
        })
    })
    
}
function setLoadingStyle(args, index){
    const page = args.object.page
    switch (index) {
        case 0:
            page.getViewById("addFormContainer").opacity = 0.5
            page.getViewById("addFormActivityIndicator").busy = true
            break;
        default:
            page.getViewById("addFormContainer").opacity = 1
            page.getViewById("addFormActivityIndicator").busy = false
            break;
    }
    
}
function sendData(args){
    return new Promise((resolve, reject) =>{
        const httpParametersPicture = {
            url: "http://192.168.1.12:3333/uploadfile",
            method: 'POST',
            file: sourceForm.get("serviceImage"),
            content: {
                serviceName: sourceForm.get("serviceName"),
                servicePrice: sourceForm.get("servicePrice"),
                serviceCategory: sourceForm.get("serviceCategory"),
                serviceDescription: sourceForm.get("serviceDescription"),
                rgbaColour: sourceForm.get("serviceColor"),
                serviceSteps: sourceForm.get("serviceSteps"),
                paddingBefore: sourceForm.get("paddingBefore"),
                paddingAfter: sourceForm.get("paddingAfter"),
                serviceAddons: sourceForm.get("serviceAddons"),
                serviceForm: sourceForm.get("serviceForm"),
                optionalQuestion: sourceForm.get("serviceOptionalQuestion"),
                paymentType: sourceForm.get("servicePaymentSetting"),
            }
        }
        sendHTTPFile(httpParametersPicture).then((result) => {
            resolve()
            console.log(result)
        },(error)=>{
            reject()
        })
    }) 
}



function changeContinueButtontext(args, text){
    const page = args.object.page;
    page.getViewById("continueButton").text = text  
}
function slideValidated(args){
    const page = args.object.page;      
    page.getViewById("continueButton").text = "Continue"   
}

source.set("dropDownClicked", function (args) {
    const mainView = args.object;
    let context = mainView.optionContext.split(",")
    navigation.navigateToModal(context, mainView, 4, false).then(function (result) {
        if (result.localeCompare("Add new form") == '0') {
            slideTransition.goToCustomSlide(args, slideIndex, 6, source, slides).then(function (result) {
                changeContinueButtontext(args, "Save")
                slideIndex = result
            })
        } else {
            args.object.text = result
        }
    })
})
exports.learnMoreModal = (args) => {
    const mainView = args.object
    context = { textTwo: "test", textOne: 'Here would we put all the other information they may need to know about this particular function. So that all our clients are infromed and know what they need to do to get their deisred result.' }
    navigation.navigateToModal(context, mainView, 14, false)
}


exports.goBack = function (args) {
    backEvent(args)
}
function backEvent(args){ // This event is a bit funny
    args.cancel = true;
    if(slideIndex == 0){
        inAppNotifiationAlert.areYouSure("Are you sure you want to exit?", "Your information will not be saved.").then(function (result) {
            if (result) { exitModal(args) }
        })
    }else{
        slideTransition.goToPreviousSlide(args, slideIndex, source, slides).then(function (result) {
            slideIndex = result
            slideValidated(args)
        })
    }
}
function exitModal(args) {
    //Delete all info
    const page = args.object.page
    page.getViewById("stepsListView").items = []
    page.getViewById("addonsListView").items = []
    
    if (application.android) {
        application.android.off(application.AndroidApplication.activityBackPressedEvent, backEvent);
        closeCallback();
    } 
}



/*-------------First slide-----------------*/
exports.openGallery = function(args){
    selectAPhotoJs.openGallery(args, sourceForm, source).then(function(result){
        slideValidated(args)
    })
}


/*----------second slide----------------*/

exports.servicePriceFocus = function (args) {
    textFieldFormatting.currencyFormattingStarted(args)
}

exports.servicePriceTextChange = function (args) {
    textFieldFormatting.currencyFormattingLive(args)
}
exports.servicePriceReturn = function (args) {
    textFieldFormatting.currencyFormattingFinished(args)
}

exports.validateSecondPage = (args) => { 
    if (slideIndex == 1){ // Something was causing this function to fire twice
        serviceNameJs.validateSecondPage(args, sourceForm).then(function (result) {
            slideValidated(args)
        })
    }
    
 };
 
exports.openColorPicker = (args) => {
    serviceNameJs.openColorPicker(args)
}


/*----------third slide----------------*/

function initialiseThirdSlide(args){
    serviceSteps.initialise(args, sourceForm)
}

exports.addStep = function (args){
    serviceSteps.addSteps(args, sourceForm)
}

exports.removeStep = function (args){
    serviceSteps.removeStep(args, sourceForm)
}

/*-----------fourth slide--------------*/
function initiliaseFourthSlide(args) {
   
}

/*---------fifth slide-----------------*/
function initialiseFifthSlide(args) { 
    addAddonJs.initialise(args, sourceForm)  
}

exports.addAddon = function (args) {
    addAddonJs.addAddon(args, sourceForm)
}

exports.removeAddon = function (args) {
    addAddonJs.removeAddon(args, sourceForm)
}

exports.addonPriceFocus = function (args) {
    textFieldFormatting.currencyFormattingStarted(args)
}

exports.addonPriceTextChange = function (args) {
    textFieldFormatting.currencyFormattingLive(args)
}
exports.addonPriceReturn = function (args) {
    textFieldFormatting.currencyFormattingFinished(args)
}

/*-----------sixth slide-----------------------*/
//function initialiseFifthSlide(args) {
    //addForm.initialise(args)
//}

/*---------------Create form-----------------*/