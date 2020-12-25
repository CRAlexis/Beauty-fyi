const navigation = require("~/controllers/navigationController");
exports.validateSecondPage = (args, sourceForm) => {
    return new Promise((resolve, reject) =>{
        try {
            const page = args.object.page;
            const serviceName = page.getViewById("serviceName")
            const servicePrice = page.getViewById("servicePrice")
            const serviceCategory = page.getViewById("serviceCategory")
            const serviceDescription = page.getViewById("serviceDescription")
            const serviceColor = page.getViewById("serviceColor")
            sourceForm.set("serviceName", serviceName.text)
            sourceForm.set("servicePrice", servicePrice.text)
            sourceForm.set("serviceCategory", serviceCategory.text)
            sourceForm.set("serviceDescription", serviceDescription.text)
            sourceForm.set("serviceColor", serviceColor.color)  
        } catch (error) {
            
        }
        if (serviceName.text && servicePrice.text && serviceCategory.text) {      
            resolve()
        }
    })
    
}

exports.openColorPicker = (args) => {
    const context = "" // Dont think I need to send through context - maybe ID of the color
    const mainView = args.object
    navigation.navigateToModal(context, mainView, 17, false).then(function (result) {
        console.log(result)
        mainView.color = result.backgroundColor
        mainView.colorId = result.colorId
    })
}