/*const animation = require("~/controllers/animationController").loadAnimation
const navigation = require("~/controllers/navigationController")
confirmation = require("~/dashboard/modals/salonPage/bookService/js/confirmation")
const application = require('application');
const {sendHTTP} = require("~/controllers/HTTPControllers/sendHTTP");
let contentPreviewModalActive = false
let pageObject;
exports.openModal = async (args) => {
    return new Promise((resolve, reject) => {
        pageObject = args.object.page
        if (!contentPreviewModalActive) {
            setTimeout(async function () {
                const object = args.object;
                const index = object.serviceIndex
                const page = object.page
                contentPreviewModalActive = true
                await animation(page.getViewById("pageContainer"), "fade out", { opacity: 0.2 })
                animation(page.getViewById("menuHeader"), "fade out", { opacity: 0.2 })
                page.getViewById("addNewCardModal").visibility = 'visible';
                await animation(page.getViewById("addNewCardModal"), "fade in")
                const ccView = page.getViewById("card");
                const cc = ccView.card;
                cc.name = "Osei Fortune"
                resolve(true)
            }, 100)
        }
    })

}

exports.closeModal = (args) => {
    return new Promise(async (resolve, reject) => {
        if (contentPreviewModalActive) {
            //const page = args.object.page
            await animation(pageObject.getViewById("addNewCardModal"), "fade out")
            await animation(pageObject.getViewById("pageContainer"), "fade in")
            animation(pageObject.getViewById("menuHeader"), "fade in")
            pageObject.getViewById("addNewCardModal").visibility = 'collapsed';
            contentPreviewModalActive = false
            resolve(false)
        }
    })
}

exports.createNewPayment = (args) => {
    const page = args.object.page
    const cardHolerName = page.getViewById("cardHolerName").text
    const cardNumber = page.getViewById("cardNumber").text
    const cardMMExpiration = page.getViewById("cardMMExpiration").text
    const cardYYExpiration = page.getViewById("cardYYExpiration").text
    const cardCVC = page.getViewById("cardCVC").text

    if (!cardHolerName){
        //notifaction
        //return
    }
    if (cardNumber.length != 16){
        //Notification
        //return
    }

    if (cardMMExpiration.length != 2){
        //Notification
        //return
    }

    if (cardYYExpiration.length != 2) {
        //Notification
        //return
    }

    if (cardCVC.length != 3) {
        //Notification
        //return
    }

    const content = JSON.stringify({
        //name: page.getViewById("nameTextField").text
    })
    const httpParameters = {
        url: 'scheduleavailabilityday',
        method: 'GET',
        //content: content,
    }
    sendHTTP(httpParameters, {display: true, message: 'Adding your card, please wait.'},{display: false} ,{display: true})
        .then((response) => {
            console.log(response)
            confirmation.closeModal(args)
        }, (e) => {
            console.log(e)
            //unable to process the request
        })
}

    //send http request to add it to database
    //return to page
    //Reflect changes on page
    //-pay with will change
    


exports.exit = (args) => {
    confirmation.closeModal(args)
}*/