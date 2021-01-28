const animation = require("~/controllers/animationController").loadAnimation;
const addNewCardModal = require("~/dashboard/includes/bookService/add-new-card")
const application = require('application');

exports.initialise = (args, sourceForm, serviceID, addonsArray, sendHTTP) => {
    return new Promise((resolve, reject) => {
        createTimeAndLocation(args, sourceForm)
        createReciept(args, sourceForm, serviceID, addonsArray, sendHTTP).then((result) => {
            resolve()
        }, (e) => {
            reject()
        })
        createPhotos(args, sourceForm)
    })
    
}

function createTimeAndLocation(args, sourceForm) {
    try {
        const page = args.object.page
        page.getViewById("confirmationTimeDisplayed").text = sourceForm.date + " - " + sourceForm.time
    } catch (error) {
        console.log(error)
    }
}

function createReciept(args, sourceForm, serviceID, addonsArray, sendHTTP) {
    return new Promise((resolve, reject) => {
        const page = args.object.page;
        const httpParameters = { url: 'servicereceiptget', method: 'POST', content: { serviceID: serviceID, addons: addonsArray }, }
        sendHTTP(httpParameters, { display: false }, { display: false }, { display: true })
            .then((response) => {
                if (response.JSON.status == "success") {
                    let recieptList = []
                    response.JSON.receipt.forEach(element => {
                        if (element.serviceName == "Deposit" || element.serviceName == "Total") {
                            recieptList.push(
                                {
                                    serviceName: element.serviceName,
                                    servicePrice: "£" + element.servicePrice,
                                    class: "h5 font-bold"
                                }
                            )
                        } else {
                            recieptList.push(
                                {
                                    serviceName: element.serviceName,
                                    servicePrice: "£" + element.servicePrice,
                                    class: "h5"
                                }
                            )
                        }
                    })
                    var listview = page.getViewById("recieptList");
                    listview.items = recieptList;
                    resolve()
                }
                console.log(response)
            }, (e) => {
                reject()
                console.log(e)
            })
    })
}

async function createPhotos(args, sourceForm) {
    const page = args.object.page
    if (sourceForm.images.length == 0) { return true }
    setTimeout(() => {
        const height = (page.getMeasuredWidth() / 4)
        let photos = []
        let i = 0;
        sourceForm.images.forEach(element => {
            photos.push({
                image: element,
                height: height + "px",
                index: i
            })
            i++
        })
        //format photos when uploading
        var listview = page.getViewById("confirmationImageListS");
        listview.items = photos;
    }, 250)
}


function createPaymentMethodList(args) {
    const page = args.object.page;
    let paymentMethodList = []
    paymentMethodList.push(
        {
            index: '0',
            text: "Pay with: *1234",
        },
        {
            index: '1',
            text: "Add a card",
        },
        {
            action: '2',
            text: "Apply a voucher",
        },

    )
    var listview = page.getViewById("paymentMethodList");
    try {
        listview.items = paymentMethodList;
    } catch (error) {
        console.log("error2 " + error)
    }
}

/*exports.paymentMethodAction = (args) => {
    object = args.object;
    index = object.index;
    const page = object.page
    animation(args.object.getChildAt(2), "arrow swipe").then(function () {

    })

    switch (index) {
        case '0':
            //change card
            console.log("should be here")
            break;
        case '1':
            //add new card
            addNewCardModal.openModal(args).then((result) => {
                modalActive = result
            })
            break;
        case '2':
            //add voucher
            break;
    }
}*/

