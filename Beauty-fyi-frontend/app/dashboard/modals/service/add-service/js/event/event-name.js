let eventName;
let eventLink;
let eventPassword;
let eventPostCode;
let eventAddressLineOne;
let eventAddressLineTwo;
let eventTown;
let offlineOrOnline;
exports.validateSecondPageEvents = (args) => {
    return new Promise((resolve, reject) => {
        const page = args.object.page
        eventName = page.getViewById("eventName").text
        eventLink = page.getViewById("eventLink").text
        eventPassword = page.getViewById("eventPassword").text
        eventPostCode = page.getViewById("eventPostCode").text
        eventAddressLineOne = page.getViewById("eventAddressLineOne").text
        eventAddressLineTwo = page.getViewById("eventAddressLineTwo").text
        eventTown = page.getViewById("eventTown").text
        switch (offlineOrOnline) {
            case 0:
                if (eventName && eventLink && eventPassword){
                    resolve()
                }else{
                    reject()
                }
                break;
        
            case 1:
                if (eventName && eventPostCode && eventAddressLineOne && eventTown) {
                    resolve()
                } else {
                    reject()
                }
                break
        }
    })
}

exports.addToBasket = (sourceForm) => {
    sourceForm.set("eventName", eventName)
    switch (offlineOrOnline) {
        case 0:
            sourceForm.set("eventLink", eventLink)
            sourceForm.set("eventPassword", eventPassword)
            sourceForm.set("isOnline", true)
            sourceForm.set("eventPostCode", null)
            sourceForm.set("eventAddressLineOne", null)
            sourceForm.set("eventAddressLineTwo", null)
            sourceForm.set("eventTown", null)
            break
        case 1:
            sourceForm.set("eventLink", null)
            sourceForm.set("eventPassword", null)
            sourceForm.set("isOnline", false)
            sourceForm.set("eventPostCode", eventPostCode)
            sourceForm.set("eventAddressLineOne", eventAddressLineOne)
            sourceForm.set("eventAddressLineTwo", eventAddressLineTwo)
            sourceForm.set("eventTown", eventTown)
           break
    }

}

exports.chooseEventLocation = async (args, loadAnimation) => {
    const object = args.object
    const page = args.object.page

    if (object.text == "Online"){
        page.getViewById("offlineEventLocation").visibility = "collapsed"
        await loadAnimation(page.getViewById("offlineEventLocation"), "fade out")

        page.getViewById("onlineEventLocation").visibility = "visible"
        await loadAnimation(page.getViewById("onlineEventLocation"), "fade in")
        offlineOrOnline = 0
    }else{
        page.getViewById("onlineEventLocation").visibility = "collapsed"
        await loadAnimation(page.getViewById("onlineEventLocation"), "fade out")

        page.getViewById("offlineEventLocation").visibility = "visible"
        await loadAnimation(page.getViewById("offlineEventLocation"), "fade in")
        offlineOrOnline = 1
    }
}