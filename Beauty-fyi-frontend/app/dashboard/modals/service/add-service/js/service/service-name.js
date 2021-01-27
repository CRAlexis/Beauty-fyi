const navigation = require("~/controllers/navigationController");
exports.validateSecondPage = (args, sourceForm) => {
    return new Promise((resolve, reject) =>{
        console.log("validating")
        const page = args.object.page;
        const serviceName = page.getViewById("serviceName")
        const servicePrice = page.getViewById("servicePrice")
        const serviceCategory = page.getViewById("serviceCategory")
        const serviceDescription = page.getViewById("serviceDescription")
        const serviceColor = page.getViewById("serviceColor")
        try {
        sourceForm.set("serviceName", serviceName.text)
        sourceForm.set("servicePrice", servicePrice.text.slice(1))
        sourceForm.set("serviceCategory", serviceCategory.text)
        sourceForm.set("serviceDescription", serviceDescription.text)
        sourceForm.set("serviceColor", serviceColor.color)  
        } catch (error) {
            console.log(error)
        }
        console.log("name: " + serviceName.text)
        console.log("servicePrice: " + servicePrice.text.slice(1))
        console.log("serviceCategory: " + serviceCategory.text)
        console.log("serviceDescription: " + serviceDescription.text)
        if (serviceName.text && servicePrice.text && serviceCategory.text && serviceDescription.text) {    
            console.log("resolved")
            resolve()
        }else{
            reject()
        }
    })
}

exports.openColorPicker = (args) => {
    const context = "" // Dont think I need to send through context - maybe ID of the color
    const mainView = args.object
    console.log(mainView.id)
    navigation.navigateToModal(context, mainView, 17, false).then(function (result) {
        console.log(result)
        mainView.color = result.backgroundColor
        mainView.colorId = result.colorId
    })
}