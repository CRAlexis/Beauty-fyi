const animation = require("~/controllers/animationController").loadAnimation
const navigation = require("~/controllers/navigationController")
const { sendHTTP, sendHTTPFile, getHttpFile } = require("~/controllers/HTTPControllers/sendHTTP");
const application = require('application');
const Observable = require("tns-core-modules/data/observable").Observable;
let source = new Observable();
let imageIndex = 0
let serviceModalActive = false
let addonArray = []
let addonIDs = []
let serviceID;
let images = []
let closeCallback;
let previewServiceContentArray;

exports.onShownModally = async (args) => {
    console.log("is this running?")
    let context = args.context;
    closeCallback = args.closeCallback;
    //console.log(context)
    const page = args.object;
    page.bindingContext = source
    serviceID = context.serviceID
    previewServiceContentArray = context.services
    //console.log("ServiceID: " + context.serviceID)
    //console.dir("previewServiceContentArray: " + context.services)
    await populate(args)

}

exports.loaded = async (args) => {
    const page = args.object.page
    if (application.android) { application.android.on(application.AndroidApplication.activityBackPressedEvent, backEvent); }
    page.on('goBack', () => { backEvent(args) })
    evtData = {
        eventName: 'refresh',
        header: "Service name"

    };
    page.notify(evtData)//Change
}

function backEvent(args) { // This event is a bit funny
    args.cancel = true
    if (application.android) {
        application.android.off(application.AndroidApplication.activityBackPressedEvent, backEvent);
    }
    closeCallback();
}


function populate(args) {
    return new Promise((resolve, reject) => {
        const page = args.object.page
        console.log("The service ID is received: " + serviceID)
        previewServiceContentArray.forEach(element => {
            if (element.id == serviceID) {
                let serviceImageInteger = 0;
                element.image_one ? serviceImageInteger++ : false
                element.image_two ? serviceImageInteger++ : false
                element.image_three ? serviceImageInteger++ : false
                element.image_four ? serviceImageInteger++ : false
                element.image_five ? serviceImageInteger++ : false
                element.image_six ? serviceImageInteger++ : false
                getServiceImages(args, serviceID, serviceImageInteger)
                page.getViewById("serviceModalImage").src = images[0]
                page.getViewById("previewServicePrice").text = "£" + element.price
                page.getViewById("previewServiceDescription").text = element.description
                page.getViewById("previewServiceCateogry").text = element.category
            }
        })
        const httpParameters = {
            url: 'servicegetaddon',
            method: 'POST',
            content: {
                serviceID: serviceID
            },
        }
        sendHTTP(httpParameters).then((result) => {
            let addons = result.JSON.addons
            let addonArray = []
            addons.forEach(element => {
                addonArray.push({
                    addonID: element.id,
                    addonText: element.name + " (£" + element.price + ")"
                })
            })
            source.set("addonsListView", addonArray)
        })

        const httpParametersTime = {
            url: 'servicegetlength',
            method: 'POST',
            content: {
                serviceID: serviceID
            },
        }
        sendHTTP(httpParametersTime).then((result) => {
            page.getViewById("previewServiceTime").text = result.JSON.time
        })

        resolve() //continue as normal
        //reject() // this.closeServiceModal(args) && display message that we had an error getting the data
    })
}

function getServiceImages(args, serviceID, serviceImageInteger) {
    const page = args.object.page
    console.log("amount of images: " + serviceImageInteger)
    for (let index = 0; index < serviceImageInteger; index++) {
        const httpParametersImages = {
            url: 'servicegetimage',
            method: 'POST',
            content: { serviceID: serviceID, index: index },
        }
        getHttpFile(httpParametersImages, { display: false }, { display: false }, { display: false }).then((result) => {
            result ? images.push(result._path) : false;
            if (index == 0) { page.getViewById("serviceModalImage").src = images[0] }
        }, (e) => {
            console.log("e" + e)
        })
    }
}



exports.goToNextImage = async (args) => {
    const object = args.object
    const direction = object.direction
    const page = args.object.page
    const imageContainer = page.getViewById("serviceModalImage");

    if (direction == 'forward') { imageIndex++ } else { imageIndex-- }

    if (imageIndex > images.length - 1) {
        imageIndex = 0
    }
    if (imageIndex < 0) {
        imageIndex = images.length - 1
    }
    await animation(imageContainer, "fade out")
    imageContainer.src = images[imageIndex]
    animation(imageContainer, "fade in")
}

exports.bookService = (args) => {
    const mainView = args.object;
    const page = args.object.page
    if (application.android) { application.android.off(application.AndroidApplication.activityBackPressedEvent, backEvent); }
    animation(args.object, "expand section width", { width: "80%", duration: 250 }).then(() => {
        navigation.navigateToModal({ serviceID: serviceID }, mainView, 24, true).then((result) => {
            if (application.android) { application.android.on(application.AndroidApplication.activityBackPressedEvent, backEvent); }
            args.object.width = "50%"
            if (result) {
                let context = { userID: result, addons: addonIDs, serviceID: serviceID }
                navigation.navigateToModal(context, mainView, 3, true).then((result) => {
                    if (application.android) { application.android.off(application.AndroidApplication.activityBackPressedEvent, backEvent); }
                    args.object.width = "50%"
                })
            }
        })
    })
}

exports.addonTapped = (args) => {
    const checkbox = args.object
    const page = args.object.page
    checkbox.isEnabled = false
    setTimeout(() => {
        const addonID = checkbox.addonID
        if (!checkbox.checked) {
            let i = 0
            addonIDs.forEach(element => {
                if (element == addonID) {
                    addonIDs.splice(i, 1)
                }
                i++
            })
            addonIDs.push(addonID)
            checkbox.isEnabled = true
            checkbox.checked = true
        } else {
            let i = 0
            addonIDs.forEach(element => {
                if (element == addonID) {
                    addonIDs.splice(i, 1)
                    checkbox.isEnabled = true
                    checkbox.checked = false
                }
                i++
            })
        }
        console.log(addonIDs)
    }, 125)
}