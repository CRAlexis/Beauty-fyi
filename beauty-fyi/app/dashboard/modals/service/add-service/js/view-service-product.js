const { SecureStorage } = require("nativescript-secure-storage")
const { loadAnimation } = require("~/controllers/animationController")
const { sendHTTP, getHttpFile } = require("~/controllers/HTTPControllers/sendHTTP")
let secureStorage = new SecureStorage
let lastOpenedContainer;
let editServiceArray = []
let serviceListView = []

exports.loaded = (args, source) => {
    editServiceArray = []
    serviceListView = []
    loadServices(args, source)

}
exports.expandSection = async (args) => {
    const object = args.object
    const page = object.page
    const lowerSection = object.parent.getChildAt(1)
    console.log(lowerSection.height)
    if (lowerSection.height == 1) {
        if (lastOpenedContainer) {
            loadAnimation(lastOpenedContainer, "reduce section down", { height: 1 })
            loadAnimation(lastOpenedContainer, "fade out")
        }
        lastOpenedContainer = lowerSection
        loadAnimation(lowerSection, "expand section down", { height: 210 })
        loadAnimation(lowerSection, "fade in")
    } else {
        lastOpenedContainer = null
        loadAnimation(lowerSection, "fade out")
        loadAnimation(lowerSection, "reduce section down", { height: 1 })
    }
}


async function loadServices (args, source, row = 1){
    const page = args.object.page
    let repeater = page.getViewById("servicesList")
    let sendRequests = true
    let serviceData;
    console.log("row number: " + row)
    const httpParameters = {
        url: 'servicegetdata',
        method: 'POST',
        content: {
            userID: await secureStorage.get({ key: "userID" }),
            row: row
        },
    }
    sendHTTP(httpParameters).then((result) => {
        let processedImages = 0
        sendRequests = result.JSON.continueRequests
        console.log("continue?: " + sendRequests)
        serviceData = result.JSON.service
        serviceData.forEach(async element => {
            console.log("ran")
            editServiceArray.push(element)
            let image = await serviceImage(element.id)
            serviceListView.push({
                serviceIndex: element.id,
                serviceImage: image,
                serviceName: element.name,
                serviceActive: !!parseInt(element.active),
                serviceCreatedOn: element.created_at.slice(0, -14)
            })
            source.set("serviceList", serviceListView)
            repeater.refresh()
            processedImages++
            if (processedImages == serviceData.length) {
                if (sendRequests) {
                    row++
                    console.log("sending next request")
                    try {
                        loadServices(args, source, row)
                    } catch (error) {
                        console.log(error)
                    }
                    
                }
            }
        })
    })
}

function serviceImage(id) {
    return new Promise((resolve, reject) => {
        const httpParametersImages = {
            url: 'servicegetimage',
            method: 'POST',
            content: { serviceID: id, index: 0 },
        }
        getHttpFile(httpParametersImages, { display: false }, { display: false }, { display: false }).then((result) => {
            resolve(result ? result._path : "defaultServiceImage.png")
        }, (e) => {
            console.log("e" + e)
        })
    })
}

exports.serviceSetActive = (args) => {
    setTimeout(() => {
        const object = args.object
        const page = object.page
        args.object.isEnabled = false
        const httpParameters = {
            url: 'servicesetactive',
            method: 'POST',
            content: {
                serviceID: object.serviceID,
                active: object.checked
            },
        }
        sendHTTP(httpParameters).then((result) => {
            object.isEnabled = true
            //changing textColor
            if (object.checked){
                object.parent.parent.parent.parent.getChildAt(0).getChildAt(1).color = "black"; return } 
            object.parent.parent.parent.parent.getChildAt(0).getChildAt(1).color = "gray"
            
        }, (e) => {
            object.isEnabled = true
            object.checked = !object.checked
        })
        //let repeater = page.getViewById("servicesList")
        //repeater.refresh()

    }, 125)
}

exports.deleteService = (args) => {
    const object = args.object
    const page = object.page
    const serviceID = object.serviceID
    const httpParameters = {
        url: 'deleteservice',
        method: 'POST',
        content: {
            serviceID: object.serviceID,
        },
    }
    sendHTTP(httpParameters).then((result) => {
        console.log(result)
    }, (e) => {
        console.log(e)
    })
}