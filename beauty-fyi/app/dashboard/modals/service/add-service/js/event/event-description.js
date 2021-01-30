let eventCategory;
let eventDescription ;
exports.validateThirdPageEvents = (args) => {
    return new Promise((resolve, reject) => {
        const page = args.object.page
        eventCategory = page.getViewById("eventCategory").text
        eventDescription = page.getViewById("eventDescription").text
        if (eventCategory && eventDescription){
            resolve()
        }else{
            reject()
        }
    })
}

exports.addToBasket = (sourceForm) => {
    sourceForm.set("eventCategory", eventCategory)
    sourceForm.set("eventDescription", eventDescription)
}