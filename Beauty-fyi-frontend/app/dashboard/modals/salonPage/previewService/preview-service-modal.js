let images = []
const animation = require("~/controllers/animationController").loadAnimation
const navigation = require("~/controllers/navigationController")
const { sendHTTP, sendHTTPFile, getHttpFile } = require("~/controllers/HTTPControllers/sendHTTP");
let imageIndex = 0
let serviceModalActive = false
let pageObject;
let addonArray = []
let serviceID

exports.openService = async (args, serviceIndex, previewServiceContentArray, source) => {
    return new Promise((resolve, reject)=>{
        pageObject = args.object.page
        if (!serviceModalActive) {
            console.log("is the modal active: " + serviceModalActive)
            setTimeout(async function () {
                const object = args.object;
                const index = object.serviceIndex
                const page = object.page
                serviceID = serviceIndex
                
                let addonArray = []
                await populate(args, serviceIndex, previewServiceContentArray, source)
                serviceModalActive = true
                await animation(page.getViewById("profilePageContainer"), "fade out", { opacity: 0.2 })
                page.getViewById("serviceModal").visibility = 'visible';
                await animation(page.getViewById("serviceModal"), "fade in")
                resolve(true)
            }, 100)
        }
    })
    
}

function populate(args, serviceIndex, previewServiceContentArray, source){
    return new Promise((resolve, reject)=>{
        const page = args.object.page
        console.log("The service ID is received: " + serviceIndex) 
        previewServiceContentArray.forEach(element => {
            if (element.id == serviceIndex){
                let serviceImageInteger = 0;
                element.image_one ? serviceImageInteger++ : false
                element.image_two ? serviceImageInteger++ : false
                element.image_three ? serviceImageInteger++ : false
                element.image_four ? serviceImageInteger++ : false
                element.image_five ? serviceImageInteger++ : false
                element.image_six ? serviceImageInteger++ : false
                getServiceImages(args, serviceIndex, serviceImageInteger)
                page.getViewById("serviceModalImage").src = images[0]
                page.getViewById("previewServicePrice").text = "£" + element.price 
                page.getViewById("previewServiceDescription").text = element.description
            }
        })
        const httpParameters = {
            url: 'servicegetaddon',
            method: 'POST',
            content: {
                serviceID: serviceIndex
            },
        }
        sendHTTP(httpParameters).then((result) => {
            let addons = result.JSON.addons
            let addonArray = []
            addons.forEach(element =>{
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
                serviceID: serviceIndex
            },
        }
        sendHTTP(httpParametersTime).then((result) => {
            page.getViewById("previewServiceTime").text = result.JSON.time
        })

        resolve() //continue as normal
        //reject() // this.closeServiceModal(args) && display message that we had an error getting the data
    })
}

function getServiceImages(args, serviceIndex, serviceImageInteger){
    const page = args.object.page
    for (let index = 0; index < serviceImageInteger; index++) {
        const httpParametersImages = {
            url: 'servicegetimage',
            method: 'POST',
            content: { serviceID: serviceIndex, index: index },
        }
        getHttpFile(httpParametersImages, { display: false }, { display: false }, { display: false }).then((result) => {
            result ? images.push(result._path) : false;
            if (index == 0) { page.getViewById("serviceModalImage").src = images[0]}
        }, (e) => {
            console.log("e" + e)
        })
    }
}

exports.closeServiceModal = (args) => {
    return new Promise(async (resolve, reject) => {
        if (serviceModalActive) {
            //const page = args.object.page
            await animation(pageObject.getViewById("serviceModal"), "fade out")
            await animation(pageObject.getViewById("profilePageContainer"), "fade in")
            pageObject.getViewById("serviceModal").visibility = 'collapsed';
            serviceModalActive = false
            try {
                images = []
                console.log(images)
            } catch (error) {
                console.log(error)
            }
            
            resolve(false)
        }
    })
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
    let parent = page.getViewById("addonContainer")
    animation(args.object, "expand section width", { width: "80%", duration: 250 }).then(function () {
        navigation.navigateToModal("", mainView, 24, true).then(function (result) {        
            console.log("User ID in preview service modal: " + result)
            for (let index = 0; index < parent.getChildrenCount(); index++) {
                if (parent.getChildAt(index).checked) {
                    addonArray.push(parent.getChildAt(index).addonID)
                }
            }
            let context = { userID: result, addons: addonArray, serviceID: serviceID }           
            navigation.navigateToModal(context, mainView, 3, true).then((result)=>{
                args.object.width = "50%"
            })
        })
    })
}