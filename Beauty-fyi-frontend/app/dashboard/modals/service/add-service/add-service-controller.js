const Observable = require("tns-core-modules/data/observable").Observable;
const application = require('application');
const { sendHTTPFile, sendHTTP } = require("~/controllers/HTTPControllers/sendHTTP");
const navigation = require("~/controllers/navigationController")
const inAppNotifiationAlert = require("~/controllers/notifications/inApp/notification-alert.js")
const slideTransition = require("~/controllers/slide-transitionController");
const textFieldFormatting = require("~/controllers/textfield-formattingController");
const { loadAnimation } = require("~/controllers/animationController")
let selectAPhotoJs;
let serviceNameJs;
let serviceSteps;
let addAddonJs;
let viewServiceProduct;
let source = new Observable();
let sourceForm;
let slideIndex = 0
let slides = []
let creationType;
let disableNavigateBack = false
let creationProcessStarted = false

exports.onShownModally = function (args) {
    const context = args.context;
    closeCallback = args.closeCallback;
    const page = args.object;
    page.bindingContext = source
    page.on('viewServiceProductLoaded', (args) => {
        console.log("recevied the other page has loaded")
        const evtData = {
            eventName: 'receiveSource',
            source: source,
        };
        args.object.page.notify(evtData)
        console.log("sent the source")
    })
    // get option context to know if we editing the service - so ican change continue button to save changes or something 
}

exports.pageLoaded = function (args) {
    const page = args.object.page
    viewServiceProduct = require("~/dashboard/modals/service/add-service/js/view-service-product");
    viewServiceProduct.loaded(args, source)
    if (application.android) { application.android.on(application.AndroidApplication.activityBackPressedEvent, backEvent); }
    page.on('goBack', () => { backEvent(args) })
    page.on('displayInfo', () => {/*displayPageInformation(args)})*/ })
    slideIndex = 0
}

exports.goToNextSlide = function goToNextSlideFunction(args) {
    switch (creationType) {
        case 1:
            goToNextSlideService(args)
            break;
        case 2:
            goToNextSlideProduct(args)
            //create product
            break;
        case 3:
            goToNextSlideEvent(args)
            //create event
            break;
    }
}

function goToNextSlideService(args) {//This gona go up by one or something like that
    switch (slideIndex) {
        case 0: hideContinueButton(args)
        case 1:
        case 2:
        case 3: paddingTime.getPaddingData(args, sourceForm)
            slideTransition.goToNextSlide(args, slideIndex, source, slides).then(function (result) {
                slideIndex = result
            })
            break;
        case 4:
            slideTransition.goToNextSlide(args, slideIndex, source, slides).then(function (result) { // Going to final slide ( currently addons)
                addAddonJs.getData(args, sourceForm)
                slideIndex = result
                createServiceFinalSlide.createFormOptions(args, sendHTTP)
            })
            break;
        case 5:
            createServiceFinalSlide.getData(args, sourceForm)
            sendServiceData(args).then((result) => {
                console.log("resolved")
                slideTransition.goToNextSlide(args, slideIndex, source, slides).then(function (result) {
                    args.object.page.getViewById("continueButton").text = "Finish"
                    slideIndex = result
                    disableNavigateBack = true
                })
            }, error => {
                // There was an error....
                // Try again?
            })
            break;
        case 6:
            closeCallback()
    }
    //updateBarValue(args, (slideIndex + 1) * 16.6)
}



function sendServiceData(args) {
    return new Promise((resolve, reject) => {
        let files = []
        sourceForm.get("serviceImages").forEach(element => {
            files.push({
                name: "photo[]",
                filename: element.image,
                mimeType: "image/jpeg"
            })
        })
        const httpParametersPicture = {
            url: "addservice",
            method: 'POST',
            description: "Creating new service",
            file: files,
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
        sendHTTPFile(httpParametersPicture, { display: true }, { display: false }, { display: true }).then((result) => {
            console.log("resolving")
            resolve()
        }, (error) => {
            reject()
        })
    })
}


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

source.set("dropDownClicked", function (args) {
    const mainView = args.object;
    const page = mainView.page
    let context = mainView.optionContext.split(",")
    let meta;
    try { meta = mainView.optionContextMeta.split(",") } catch (error) { }
    console.log(context, meta)
    navigation.navigateToModal({ context: context, meta: meta }, mainView, 4, false).then((result) => {
        console.log(result)
        page.getViewById("serviceForm").formID = result.meta
        try {
            if (result.text.localeCompare("Add new form") == '0') {

            } else {
                args.object.text = result.text
            }
        } catch (error) {
            console.log(error)
        }
    })
})

exports.goBack = function (args) {
    backEvent(args)
}
function backEvent(args) { // This event is a bit funny
    args.cancel = true;
    if (!creationProcessStarted) {
        exitModal(args)
        return
    }
    if (slideIndex == 0) {
        inAppNotifiationAlert.areYouSure("Are you sure you want to exit?", "Your information will not be saved.").then(function (result) {
            if (result) { exitModal(args) }
        })
    } else if (!disableNavigateBack) {
        slideTransition.goToPreviousSlide(args, slideIndex, source, slides).then(function (result) {
            slideIndex = result
            //slideValidated(args)
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

/*-------------View services and products------------*/

exports.expandSection = async (args) => {
    viewServiceProduct.expandSection(args)
}

exports.serviceSetActive = (args) => {
    viewServiceProduct.serviceSetActive(args)
}

exports.createNewProduct = async (args) => {
    const page = args.object.page;
    args.object.visibility = "collapsed";
    let evtData;
    await loadAnimation(page.getViewById("viewServiceProductEvent"), "fade out")
    page.getViewById("viewServiceProductEvent").visibility = "collapsed"
    // set the correct slides
    switch ("1") {
        case '1':
            try {
                creationProcessStarted = true
                sourceForm = new Observable();
                generateServiceJs(args)
                evtData = {
                    eventName: 'refresh',
                    header: "Create a service"

                };
                args.object.page.notify(evtData)//Change
                await loadAnimation(page.getViewById("selectAPhotoSlide"), "fade in")
                page.getViewById("selectAPhotoSlide").visibility = "visible"
                creationType = 1
                slides = [page.getViewById("selectAPhotoSlide"), page.getViewById("serviceNameSlide"), page.getViewById("serviceStepsSlide"), page.getViewById("paddingTimeSlide"), page.getViewById("addonsSlide"), page.getViewById("createServiceFinalSlide"), page.getViewById("addServiceSuccess")]
            } catch (error) {
                console.log(error)
            }
            break;
        case '2':
            sourceFormProduct = new Observable();
            generateProductJs(args)
            evtData = {
                eventName: 'refresh',
                header: "Add a product"

            };
            args.object.page.notify(evtData)//Change
            await loadAnimation(page.getViewById("selectPhotosProductsSlide"), "fade in")
            page.getViewById("selectPhotosProductsSlide").visibility = "visible"
            creationType = 2
            slides = [page.getViewById("selectPhotosProductsSlide"), page.getViewById("productsNameSlide"), page.getViewById("productPriceSlide"), page.getViewById("productDealsSlide"), page.getViewById("productConfirmationSlide"), page.getViewById("productSuccessSlide")]
            break;
        case '3':
            sourceFormEvent = new Observable();
            generateEventJs(args)
            evtData = {
                eventName: 'refresh',
                header: "Create an event"

            };
            args.object.page.notify(evtData)
            await loadAnimation(page.getViewById("selectPhotosEventSlide"), "fade in")
            page.getViewById("selectPhotosEventSlide").visibility = "visible"
            creationType = 3
            slides = [page.getViewById("selectPhotosEventSlide"), page.getViewById("eventNameSlide"), page.getViewById("eventDescriptionSlide"), page.getViewById("eventTimePriceSlide"), page.getViewById("eventSuccessSlide")]
            break;
    }
    // unhide the normal continue button
    page.getViewById("continueButton").visibility = "visible"
}

function generateServiceJs(args) {
    selectAPhotoJs = require("~/dashboard/modals/service/add-service/js/service/select-a-photo")
    selectAPhotoJs.initSlide(args)
    serviceNameJs = require("~/dashboard/modals/service/add-service/js/service/service-name")
    serviceSteps = require("~/dashboard/modals/service/add-service/js/service/service-steps")
    paddingTime = require("~/dashboard/modals/service/add-service/js/service/padding-time")
    addAddonJs = require("~/dashboard/modals/service/add-service/js/service/add-addon")
    createServiceFinalSlide = require("~/dashboard/modals/service/add-service/js/service/create-service-final-slide")
    initialiseThirdSlide(args)
    initialiseFifthSlide(args)
}


/*-------------First slide-----------------*/
exports.openGallery = function (args) {
    selectAPhotoJs.openGallery(args, sourceForm, source).then(function (result) {
        makeContinueButtonAppear(args)
    })
}

exports.imageTappedServiceImage = (args) => {
    selectAPhotoJs.removeImage(args, sourceForm).then((result) => {
    }, (e) => {
        hideContinueButton(args)
    })
}

exports.onItemReorderService = (args) => {
    selectAPhotoJs.onItemReorderService(args, sourceForm)
}
/*----------second slide----------------*/

exports.currencyFormattingStarted = function (args) {
    textFieldFormatting.currencyFormattingStarted(args)
}

exports.currencyFormattingLive = function (args) {
    textFieldFormatting.currencyFormattingLive(args)
}
exports.currencyFormattingFinished = function (args) {
    textFieldFormatting.currencyFormattingFinished(args)
}

exports.validateSecondPage = (args) => {
    console.log(slideIndex)
    if (slideIndex == 1) { // Something was causing this function to fire twice
        serviceNameJs.validateSecondPage(args, sourceForm).then(function (result) {
            makeContinueButtonAppear(args)
        })
    }
};

exports.openColorPicker = (args) => {
    serviceNameJs.openColorPicker(args)
}


/*----------third slide----------------*/

function initialiseThirdSlide(args) {
    serviceSteps.initialise(args, sourceForm)
}

exports.addStep = function (args) {
    serviceSteps.addSteps(args, sourceForm)
}

exports.removeStep = function (args) {
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
/*-----------sixth slide-----------------------*/



/*---------------Create form-----------------*/