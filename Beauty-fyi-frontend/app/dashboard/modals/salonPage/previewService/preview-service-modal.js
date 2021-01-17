const images = ["~/images/temp4.png", "~/images/temp7.png"]
const animation = require("~/controllers/animationController").loadAnimation
const navigation = require("~/controllers/navigationController")
let imageIndex = 0
let serviceModalActive = false
let pageObject;
let addonArray = []
let serviceID

exports.openService = async (args, serviceIndex) => {
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
                //await populate(args)
                serviceModalActive = true
                await animation(page.getViewById("profilePageContainer"), "fade out", { opacity: 0.2 })
                page.getViewById("serviceModal").visibility = 'visible';
                await animation(page.getViewById("serviceModal"), "fade in")
                resolve(true)
            }, 100)
        }
    })
    
}

function populate(args){
    return new Promise((resolve, reject)=>{

        resolve() //continue as normal
        reject() // this.closeServiceModal(args) && display message that we had an error getting the data
    })
    //addons - pictures - price - description - time
}

exports.closeServiceModal = (args) => {
    return new Promise(async (resolve, reject) => {
        if (serviceModalActive) {
            //const page = args.object.page
            await animation(pageObject.getViewById("serviceModal"), "fade out")
            await animation(pageObject.getViewById("profilePageContainer"), "fade in")
            pageObject.getViewById("serviceModal").visibility = 'collapsed';
            serviceModalActive = false
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
            active = false
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