const Observable = require("tns-core-modules/data/observable").Observable;
const application = require('application');
const { sendHTTPFile } = require("~/controllers/HTTPControllers/sendHTTP");
const sendHTTP = require("~/controllers/HTTPControllers/sendHTTP").sendHTTP;
const navigation = require("~/controllers/navigationController")
const inAppNotifiationAlert = require("~/controllers/notifications/inApp/notification-alert.js")
const slideTransition = require("~/controllers/slide-transitionController");
const textFieldFormatting = require("~/controllers/textfield-formattingController");
const { loadAnimation } = require("~/controllers/animationController")
let selectAPhotoJs;
let serviceNameJs;
let serviceSteps;
let addAddonJs;
let selectPhotosProducts;
let productNameJS;
let productPriceJS;
let productDeals;
let productConfirmation;
let source = new Observable();
let sourceForm;
let sourceFormProduct;
let sourceFormEvent;
let slideIndex = 0
let slides = []
let creationType;
let previousButton;
let transitioning = false;
let disableNavigateBack = false

exports.onShownModally = function(args) {
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

exports.pageLoaded = function(args){
    //loadServices(args)
    //loadProducts(args)
    //loadEvents(args)
    const page = args.object.page
    if (application.android) {
        application.android.on(application.AndroidApplication.activityBackPressedEvent, backEvent);
    }
    page.on('goBack', () => {
        backEvent(args)
    })
    page.on('displayInfo', () => {
        //displayPageInformation(args)
    })
    slideIndex = 0
}

exports.goToNextSlide = function goToNextSlideFunction(args){
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

function goToNextSlideService(args){//This gona go up by one or something like that
    switch (slideIndex) {
        case 0: hideContinueButton(args)
        case 1: 
        case 2:      
        case 3: paddingTime.getPaddingData(args, sourceForm)
        case 4:
            slideTransition.goToNextSlide(args, slideIndex, source, slides).then(function (result) {
                slideIndex = result
            })
            break;
        case 5:
            createServiceFinalSlide.getData(args, sourceForm)
            sendServiceData(args).then((result) => {
                console.log("success?")
                slideTransition.goToCustomSlide(args, slideIndex, 7, source, slides).then(function (result) {
                    changeContinueButtontext(args, "Finish")
                    slideIndex = result
                    disableNavigateBack = true
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
    //updateBarValue(args, (slideIndex + 1) * 16.6)
}

async function goToNextSlideProduct(args){
    //check if object is visible
    if (!transitioning){
        transitioning = true;      
        switch (slideIndex) {
            case 0: hideContinueButton(args)
            case 1: hideContinueButton(args)
            case 2: //Transitions to discount in here
                slideTransition.goToNextSlide(args, slideIndex, source, slides).then(function (result) {
                    slideIndex = result
                    transitioning = false
                })
                break;
            case 3: //Transitions to confirmation
                productNameJS.addToBasket(sourceFormProduct)
                productPriceJS.addToBasket(sourceFormProduct)
                await productDeals.addToBasket(args, sourceFormProduct)
                productConfirmation.initConfirmationPage(args, sourceFormProduct)
                slideTransition.goToNextSlide(args, slideIndex, source, slides).then(function (result) {
                    slideIndex = result
                    transitioning = false
                })
                break;
            case 4: 
                sendProductData(args).then((result)=>{
                    //slideTransition.goToNextSlide(args, slideIndex, source, slides).then(function (result) {
                    //    slideIndex = result
                    //    transitioning = false
                    //    disableNavigateBack = true;
                    //    //set the button to done or something
                    //})
                },(e) => {
                    //Ask them to retry - at some point, just say we will save your settings and try again later
                    //Unable to create your product - try agian later - for this will need to learn to save in database
                })
                break;
            case 5:
                // Clear data
                closeCallback();
                break
        }
    }
}

async function goToNextSlideEvent(args) {
    //check if object is visible
    if (!transitioning) {
        transitioning = true;
        switch (slideIndex) {
            case 0: hideContinueButton(args)
            case 1: 
            case 2:
                slideTransition.goToNextSlide(args, slideIndex, source, slides).then(function (result) {
                    slideIndex = result
                    transitioning = false
                    
                })
                break
            case 3:
                try {
                    await eventNameJS.addToBasket(sourceFormEvent)
                    eventDescriptionJS.addToBasket(sourceFormEvent)
                    await eventTimePrice.addToBasket(sourceFormEvent)
                } catch (error) {
                    console.log(error)
                }
                
                slideTransition.goToNextSlide(args, slideIndex, source, slides).then(function (result) {
                    slideIndex = result
                    transitioning = false
                    console.dir(sourceFormEvent)
                })
                break;
            case 4:
                closeCallback()
        }
    }
}

function sendServiceData(args){
    console.log("tryna send http file")
    return new Promise((resolve, reject) =>{
        let files = []
        sourceForm.get("serviceImages").forEach(element => {
            files.push({
                name: "photo[]",
                filename: element.image,
                mimeType: "image/jpeg"
            })
        })
        console.log(sourceForm.get("serviceImages"))
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
        sendHTTPFile(httpParametersPicture, { display: false }, { display: true }, { display: true }).then((result) => {
            resolve()
        },(error)=>{
            reject()
        })
    }) 
}
function sendProductData(args){
    return new Promise((resolve, reject) => {
        let files = []
        let numberOfFiles = 0
        sourceFormProduct.get("productImages").forEach(element => {
            files.push({
                index: numberOfFiles,
                name: "photo" + numberOfFiles,
                filename: element.image,
                mimeType: "image/jpeg"
            })
            numberOfFiles++
        })
        const content = {
            productName: sourceFormProduct.get("productName"),
            productQuantity: sourceFormProduct.get("productQuantity"),
            productDescription: sourceFormProduct.get("productDescription"),
            productCategory: sourceFormProduct.get("productCategory"),
            productPrice: sourceFormProduct.get("productPrice"),
            postagePrice: sourceFormProduct.get("postagePrice"),
            postageDescription: sourceFormProduct.get("postageDescription"),
            internationalPostage: sourceFormProduct.get("internationalPostage"),
            postageShippingTime: sourceFormProduct.get("postageShippingTime"),
            AllowInternationalShipping: sourceFormProduct.get("AllowInternationalShipping"),
            allowDeals: sourceFormProduct.get("allowDeals"),
            buyTwoDeal: sourceFormProduct.get("buyTwoDeal"),
            buyThreeDeal: sourceFormProduct.get("buyThreeDeal"),
            buyFourDeal: sourceFormProduct.get("buyFourDeal"),
        }
        const httpParameters = {
            url: 'addproduct',
            method: 'POST',
            description: "Creating new product",
            content: content,
            files: files
        }
        //resolve()
        sendHTTPFile(httpParameters, { display: false }, { display: true }, { display: true }).then((result) => {
            console.log(result)
        }, (e) =>{
            console.log(e)
        })
    })
    
}

function sendEventData(args){
    return new Promise((resolve, reject) => {
        let files = []
        let numberOfFiles = 1
        sourceFormEvent.get("productImages").forEach(element => {
            files.push({
                name: "photo" + numberOfFiles,
                filename: element.image,
                mimeType: "image/jpeg"
            })
            numberOfFiles++
        })
        const content = {
            eventName: sourceFormEvent.get("eventName"),
            eventLink: sourceFormEvent.get("eventLink"),
            eventPassword: sourceFormEvent.get("eventPassword"),
            isOnline: sourceFormEvent.get("isOnline"),
            eventPostCode: sourceFormEvent.get("eventPostCode"),
            eventAddressLineOne: sourceFormEvent.get("eventAddressLineOne"),
            eventAddressLineTwo: sourceFormEvent.get("eventAddressLineTwo"),
            eventTown: sourceFormEvent.get("eventTown"),
            eventCategory: sourceFormEvent.get("eventCategory"),
            eventDescription: sourceFormEvent.get("eventDescription"),
            eventStartTime: sourceFormEvent.get("eventStartTime"),
            eventEndTime: sourceFormEvent.get("eventEndTime"),
            eventDate: sourceFormEvent.get("eventDate"),
            eventPrice: sourceFormEvent.get("eventPrice"),
            eventCapacity: sourceFormEvent.get("eventCapacity"),
            ticketType: sourceFormEvent.get("ticketType"),
        }
        const httpParameters = {
            url: 'bio',
            method: 'POST',
            description: "Creating new event",
            content: content,
            files: files
        }
        resolve()
        sendHTTPFile(httpParameters, { display: false }, { display: false }, { display: false })
    })
}

async function makeContinueButtonAppear (args){
    const page = args.object.page;
    page.getViewById("continueButton").visibility = "visible"
    await loadAnimation(page.getViewById("continueButton"), "fade in")
}

async function hideContinueButton (args) {
    const page = args.object.page;
    await loadAnimation(page.getViewById("continueButton"), "fade out")
    page.getViewById("continueButton").visibility = "collapsedd"
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

exports.goBack = function (args) {
    backEvent(args)
}
function backEvent(args){ // This event is a bit funny
    args.cancel = true;
    if(slideIndex == 0){
        inAppNotifiationAlert.areYouSure("Are you sure you want to exit?", "Your information will not be saved.").then(function (result) {
            if (result) { exitModal(args) }
        })
    }else if (!disableNavigateBack){
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

function loadServices(args) {
    const page = args.object.page
    const servicesList = [];
    servicesList.push({
            serviceImage: "~/images/temp.png",
            serviceName: "My new service",
            serviceActive: true
        },
        {
            serviceImage: "~/images/temp2.png",
            serviceName: "My other service",
            serviceActive: true
        },
    )
    source.set("serviceList", servicesList)
    source.set("test", "hey")
    var listview = page.getViewById("servicesList");
    console.log(listview)
    //listview.items = servicesList;
}

function loadProducts(args) {
    const page = args.object.page
    const productList = [];
    productList.push({
            productImage: "~/images/temp.png",
            productName: "My new product",
            productActive: true
        },
        {
            productImage: "~/images/temp2.png",
            productName: "My other product",
            productActive: false
        },
    )
    source.set("productList", productList)
    //listview.items = servicesList;
}

function loadEvents(args) {
    const page = args.object.page
    const eventList = [];
    eventList.push({
        eventImage: "~/images/temp.png",
        eventName: "My new event",
        eventActive: true
    },
        {
            eventImage: "~/images/temp2.png",
            eventName: "My other event",
            eventActive: false
        },
    )
    source.set("eventList", eventList)
    //listview.items = servicesList;
}

let lastOpenedContainer;
exports.expandSection = async (args) => {
    const object = args.object
    const page = object.page
    const lowerSection = object.parent.getChildAt(1)
    console.log(lowerSection.height)
    if (lowerSection.height == 1) {
        if (lastOpenedContainer) {
            loadAnimation(lastOpenedContainer, "reduce section down", { height: 1 })
        }
        lastOpenedContainer = lowerSection
        loadAnimation(lowerSection, "expand section down", { height: 210 })
    } else {
        lastOpenedContainer = null
        loadAnimation(lowerSection, "reduce section down", { height: 1 })
    }
}

let createNewProductAnimationActive = false
exports.createNewProduct = async (args) => {
    if (!createNewProductAnimationActive) {
        createNewProductAnimationActive = true
        const button = args.object
        const page = button.page;
        const index = button.buttonId
        if (previousButton) {
            if (previousButton.buttonId == index) {
                loadAnimation(previousButton, "change background color", { color: 'white' })
                previousButton.color = "black"
                previousButton = null
                createNewProductAnimationActive = false
                return;
            }
        }
        if (previousButton) {
            loadAnimation(previousButton, "change background color", { color: 'white' })
            previousButton.color = "black"
        }
        await loadAnimation(button, "change background color", { color: 'black' })
        button.color = "white";
        previousButton = button;

        page.getViewById("continueLabel").visibility = "visible"
        page.getViewById("continueLabel").index = index
        loadAnimation(page.getViewById("continueLabel"), "fade in")
        createNewProductAnimationActive = false
    }
}

exports.continueToSetup = async (args) => {
    const page = args.object.page
    let evtData;
    console.log("tapped")
    //hide this page
    await loadAnimation(page.getViewById("viewServiceProductEvent"), "fade out")
    console.log(args.object.index)
    page.getViewById("viewServiceProductEvent").visibility = "collapsed"
    // set the correct slides
    switch (args.object.index) {
        case '1':
            try {
            sourceForm = new Observable();
            generateServiceJs(args)
            evtData = {
                eventName: 'refresh',
                header: "Add a service"

            };
            args.object.page.notify(evtData)//Change
            await loadAnimation(page.getViewById("selectAPhotoSlide"), "fade in")
            page.getViewById("selectAPhotoSlide").visibility = "visible"
            creationType = 1
            slides = [page.getViewById("selectAPhotoSlide"), page.getViewById("serviceNameSlide"), page.getViewById("serviceStepsSlide"), page.getViewById("paddingTimeSlide"), page.getViewById("addonsSlide"), page.getViewById("createServiceFinalSlide"), page.getViewById("addForm"), page.getViewById("addServiceSuccess")]
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

function generateProductJs(args) {
    selectPhotosProducts = require("~/dashboard/modals/service/add-service/js/product/select-photos-products")
    selectPhotosProducts.initSlide(args)
    productNameJS = require("~/dashboard/modals/service/add-service/js/product/product-name")
    productPriceJS = require("~/dashboard/modals/service/add-service/js/product/product-price")
    productDeals = require("~/dashboard/modals/service/add-service/js/product/product-deals")
    productConfirmation = require("~/dashboard/modals/service/add-service/js/product/product-confirmation")
    
}

function generateEventJs(args) {
    selectPhotosEvents = require("~/dashboard/modals/service/add-service/js/event/select-photos-events")
    selectPhotosEvents.initSlide(args)
    eventNameJS = require("~/dashboard/modals/service/add-service/js/event/event-name")
    eventDescriptionJS = require("~/dashboard/modals/service/add-service/js/event/event-description")
    eventTimePrice = require("~/dashboard/modals/service/add-service/js/event/event-time-price")
    eventTimePrice.initSlide(args)
    
}
/*-------------First slide-----------------*/
exports.openGallery = function(args){
    selectAPhotoJs.openGallery(args, sourceForm, source).then(function(result){
        makeContinueButtonAppear(args)
    })
}

exports.imageTappedServiceImage = (args) => {
    selectAPhotoJs.removeImage(args, sourceForm).then((result) => {
    },(e) =>{
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
    if (slideIndex == 1){ // Something was causing this function to fire twice
        serviceNameJs.validateSecondPage(args, sourceForm).then(function (result) {
            makeContinueButtonAppear(args)
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
/*-----------sixth slide-----------------------*/



/*---------------Create form-----------------*/


/*--------------First slide products-----------*/
exports.uploadPhotosProducts = (args) => {
    selectPhotosProducts.openGallery(args, sourceFormProduct).then((result) => {
        makeContinueButtonAppear(args)
    })
}

exports.imageTappedProductImage = (args) => {
    selectPhotosProducts.removeImage(args, sourceFormProduct).then((result) => {
    },(e) =>{
            hideContinueButton(args)
    })
}

exports.onItemReorderProduct = (args) => {
    selectPhotosProducts.onItemReorderProduct(args, sourceFormProduct)
}
/*------------Second slide products-----------------*/
exports.validateSecondPageProducts = (args) => {
    productNameJS.validateSecondPageProducts(args).then((result) => {
        makeContinueButtonAppear(args)
        console.log("validated!")
    }, (e) =>{
        hideContinueButton(args)
    })
}

/*-----------Third slide products-----------------*/
exports.productPriceFocus = function (args) {
    textFieldFormatting.currencyFormattingStarted(args)
}

exports.productPriceTextChange = function (args) {
    textFieldFormatting.currencyFormattingLive(args)
}
exports.productPriceReturn = function (args) {
    textFieldFormatting.currencyFormattingFinished(args)
}

exports.validateThirdPageProducts = (args) => {
    productPriceJS.validateThirdPageProducts(args).then((result) => {
        makeContinueButtonAppear(args)
    }, (e) => {
        hideContinueButton(args)
    })
}

exports.allowInternationalShipping = async (args) => {
    await productPriceJS.allowInternationalShipping(args)
    productPriceJS.validateThirdPageProducts(args).then((result) => {
        makeContinueButtonAppear(args)
    }, (e) => {
        hideContinueButton(args)
    })
}

exports.allowBundles = (args) => {
    productDeals.allowBundles(args, loadAnimation)
}

exports.percentFormatStart = (args) => {
    textFieldFormatting.percentFormattingStarted(args)
}

exports.percentFormatEnd = (args) => {
    textFieldFormatting.percentFormattingFinished(args)
}

/*-------------Confirmation slide--------------*/
exports.viewProductPicture = (args) => {
    productConfirmation.viewContent(args)
}

/*---------------------Events----------------------*/
exports.openGalleryEvent = (args) => {
    selectPhotosEvents.openGallery(args, sourceFormEvent).then((result) => {
        makeContinueButtonAppear(args)
    })
}

exports.imageTappedEventImage = (args) => {
    selectPhotosEvents.removeImage(args, sourceFormEvent).then((result) => {
    }, (e) => {
        hideContinueButton(args)
    })
}

exports.onItemReorderEvent = (args) => {
    selectPhotosEvents.onItemReorderEvent(args, sourceFormEvent)
}

/*-----------------Second slide---------------*/
exports.eventEndTimeChanged = async (args) => {
    await eventTimePrice.eventEndTimeChanged(args)
    this.validateSecondPageEvents(args)
}

exports.validateSecondPageEvents = (args) => {
    eventNameJS.validateSecondPageEvents(args).then((result) => {
        makeContinueButtonAppear(args)
    }, (e) => {
        hideContinueButton(args)
    })
}


exports.chooseEventLocation = async (args) => {
    await eventNameJS.chooseEventLocation(args, loadAnimation)
    this.validateSecondPageEvents(args)
}

/*----------------third slide------------------*/
exports.validateThirdPageEvents = (args) => {
    eventDescriptionJS.validateThirdPageEvents(args).then((result) => {
        makeContinueButtonAppear(args)
    }, (e) => {
        hideContinueButton(args)
    })
}

/*----------------Fourth slide------------------*/
exports.chooseTicketType = async (args) => {
    await eventTimePrice.chooseTicketType(args, loadAnimation)
    this.validateFourthPageEvents(args)
}

exports.limitTotalCapicity = async (args) => {
    await c.limitTotalCapicity(args, loadAnimation)
    setTimeout(()=>{
        this.validateFourthPageEvents(args)
    },500 )
    
}

exports.validateFourthPageEvents = (args) => {
    eventTimePrice.validateFourthPageEvents(args).then((result) => {
        makeContinueButtonAppear(args)
    }, (e) => {
        hideContinueButton(args)
    })
}