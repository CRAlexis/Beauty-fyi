async function goToNextSlideProduct(args) {
    //check if object is visible
    if (!transitioning) {
        transitioning = true;
        switch (slideIndex) {
            case 0: hideContinueButton(args)
            case 1: hideContinueButton(args)
            case 2: //Transitions to discount in here
                slideTransition.goToNextSlide(args, slideIndex, source, slides).then(function (result) {
                    slideIndex = result
                    transitioning = false
                })
                break;
            case 3: //Transitions to confirmation
                productNameJS.addToBasket(sourceFormProduct)
                productPriceJS.addToBasket(sourceFormProduct)
                await productDeals.addToBasket(args, sourceFormProduct)
                productConfirmation.initConfirmationPage(args, sourceFormProduct)
                slideTransition.goToNextSlide(args, slideIndex, source, slides).then(function (result) {
                    slideIndex = result
                    transitioning = false
                })
                break;
            case 4:
                sendProductData(args).then((result) => {
                    //slideTransition.goToNextSlide(args, slideIndex, source, slides).then(function (result) {
                    //    slideIndex = result
                    //    transitioning = false
                    //    disableNavigateBack = true;
                    //    //set the button to done or something
                    //})
                }, (e) => {
                    //Ask them to retry - at some point, just say we will save your settings and try again later
                    //Unable to create your product - try agian later - for this will need to learn to save in database
                })
                break;
            case 5:
                // Clear data
                closeCallback();
                break
        }
    }
}

async function goToNextSlideEvent(args) {
    //check if object is visible
    if (!transitioning) {
        transitioning = true;
        switch (slideIndex) {
            case 0: hideContinueButton(args)
            case 1:
            case 2:
                slideTransition.goToNextSlide(args, slideIndex, source, slides).then(function (result) {
                    slideIndex = result
                    transitioning = false

                })
                break
            case 3:
                try {
                    await eventNameJS.addToBasket(sourceFormEvent)
                    eventDescriptionJS.addToBasket(sourceFormEvent)
                    await eventTimePrice.addToBasket(sourceFormEvent)
                } catch (error) {
                    console.log(error)
                }

                slideTransition.goToNextSlide(args, slideIndex, source, slides).then(function (result) {
                    slideIndex = result
                    transitioning = false
                    console.dir(sourceFormEvent)
                })
                break;
            case 4:
                closeCallback()
        }
    }
}

function sendProductData(args) {
    return new Promise((resolve, reject) => {
        let files = []
        let numberOfFiles = 0
        sourceFormProduct.get("productImages").forEach(element => {
            files.push({
                index: numberOfFiles,
                name: "photo" + numberOfFiles,
                filename: element.image,
                mimeType: "image/jpeg"
            })
            numberOfFiles++
        })
        const content = {
            productName: sourceFormProduct.get("productName"),
            productQuantity: sourceFormProduct.get("productQuantity"),
            productDescription: sourceFormProduct.get("productDescription"),
            productCategory: sourceFormProduct.get("productCategory"),
            productPrice: sourceFormProduct.get("productPrice"),
            postagePrice: sourceFormProduct.get("postagePrice"),
            postageDescription: sourceFormProduct.get("postageDescription"),
            internationalPostage: sourceFormProduct.get("internationalPostage"),
            postageShippingTime: sourceFormProduct.get("postageShippingTime"),
            AllowInternationalShipping: sourceFormProduct.get("AllowInternationalShipping"),
            allowDeals: sourceFormProduct.get("allowDeals"),
            buyTwoDeal: sourceFormProduct.get("buyTwoDeal"),
            buyThreeDeal: sourceFormProduct.get("buyThreeDeal"),
            buyFourDeal: sourceFormProduct.get("buyFourDeal"),
        }
        const httpParameters = {
            url: 'addproduct',
            method: 'POST',
            description: "Creating new product",
            content: content,
            files: files
        }
        //resolve()
        sendHTTPFile(httpParameters, { display: false }, { display: true }, { display: true }).then((result) => {
            console.log(result)
        }, (e) => {
            console.log(e)
        })
    })

}

function sendEventData(args) {
    return new Promise((resolve, reject) => {
        let files = []
        let numberOfFiles = 1
        sourceFormEvent.get("productImages").forEach(element => {
            files.push({
                name: "photo" + numberOfFiles,
                filename: element.image,
                mimeType: "image/jpeg"
            })
            numberOfFiles++
        })
        const content = {
            eventName: sourceFormEvent.get("eventName"),
            eventLink: sourceFormEvent.get("eventLink"),
            eventPassword: sourceFormEvent.get("eventPassword"),
            isOnline: sourceFormEvent.get("isOnline"),
            eventPostCode: sourceFormEvent.get("eventPostCode"),
            eventAddressLineOne: sourceFormEvent.get("eventAddressLineOne"),
            eventAddressLineTwo: sourceFormEvent.get("eventAddressLineTwo"),
            eventTown: sourceFormEvent.get("eventTown"),
            eventCategory: sourceFormEvent.get("eventCategory"),
            eventDescription: sourceFormEvent.get("eventDescription"),
            eventStartTime: sourceFormEvent.get("eventStartTime"),
            eventEndTime: sourceFormEvent.get("eventEndTime"),
            eventDate: sourceFormEvent.get("eventDate"),
            eventPrice: sourceFormEvent.get("eventPrice"),
            eventCapacity: sourceFormEvent.get("eventCapacity"),
            ticketType: sourceFormEvent.get("ticketType"),
        }
        const httpParameters = {
            url: 'bio',
            method: 'POST',
            description: "Creating new event",
            content: content,
            files: files
        }
        resolve()
        sendHTTPFile(httpParameters, { display: false }, { display: false }, { display: false })
    })
}

function loadProducts(args) {
    const page = args.object.page
    const productList = [];
    productList.push({
        productImage: "~/images/temp.png",
        productName: "My new product",
        productActive: true
    },
        {
            productImage: "~/images/temp2.png",
            productName: "My other product",
            productActive: false
        },
    )
    source.set("productList", productList)
    //listview.items = servicesList;
}

function loadEvents(args) {
    const page = args.object.page
    const eventList = [];
    eventList.push({
        eventImage: "~/images/temp.png",
        eventName: "My new event",
        eventActive: true
    },
        {
            eventImage: "~/images/temp2.png",
            eventName: "My other event",
            eventActive: false
        },
    )
    source.set("eventList", eventList)
    //listview.items = servicesList;
}


/*--------------First slide products-----------*/
exports.uploadPhotosProducts = (args) => {
    selectPhotosProducts.openGallery(args, sourceFormProduct).then((result) => {
        makeContinueButtonAppear(args)
    })
}

exports.imageTappedProductImage = (args) => {
    selectPhotosProducts.removeImage(args, sourceFormProduct).then((result) => {
    }, (e) => {
        hideContinueButton(args)
    })
}

exports.onItemReorderProduct = (args) => {
    selectPhotosProducts.onItemReorderProduct(args, sourceFormProduct)
}
/*------------Second slide products-----------------*/
exports.validateSecondPageProducts = (args) => {
    productNameJS.validateSecondPageProducts(args).then((result) => {
        makeContinueButtonAppear(args)
        console.log("validated!")
    }, (e) => {
        hideContinueButton(args)
    })
}

/*-----------Third slide products-----------------*/
exports.productPriceFocus = function (args) {
    textFieldFormatting.currencyFormattingStarted(args)
}

exports.productPriceTextChange = function (args) {
    textFieldFormatting.currencyFormattingLive(args)
}
exports.productPriceReturn = function (args) {
    textFieldFormatting.currencyFormattingFinished(args)
}

exports.validateThirdPageProducts = (args) => {
    productPriceJS.validateThirdPageProducts(args).then((result) => {
        makeContinueButtonAppear(args)
    }, (e) => {
        hideContinueButton(args)
    })
}

exports.allowInternationalShipping = async (args) => {
    await productPriceJS.allowInternationalShipping(args)
    productPriceJS.validateThirdPageProducts(args).then((result) => {
        makeContinueButtonAppear(args)
    }, (e) => {
        hideContinueButton(args)
    })
}

exports.allowBundles = (args) => {
    productDeals.allowBundles(args, loadAnimation)
}

exports.percentFormatStart = (args) => {
    textFieldFormatting.percentFormattingStarted(args)
}

exports.percentFormatEnd = (args) => {
    textFieldFormatting.percentFormattingFinished(args)
}

/*-------------Confirmation slide--------------*/
exports.viewProductPicture = (args) => {
    productConfirmation.viewContent(args)
}

/*---------------------Events----------------------*/
exports.openGalleryEvent = (args) => {
    selectPhotosEvents.openGallery(args, sourceFormEvent).then((result) => {
        makeContinueButtonAppear(args)
    })
}

exports.imageTappedEventImage = (args) => {
    selectPhotosEvents.removeImage(args, sourceFormEvent).then((result) => {
    }, (e) => {
        hideContinueButton(args)
    })
}

exports.onItemReorderEvent = (args) => {
    selectPhotosEvents.onItemReorderEvent(args, sourceFormEvent)
}

/*-----------------Second slide---------------*/
exports.eventEndTimeChanged = async (args) => {
    await eventTimePrice.eventEndTimeChanged(args)
    this.validateSecondPageEvents(args)
}

exports.validateSecondPageEvents = (args) => {
    eventNameJS.validateSecondPageEvents(args).then((result) => {
        makeContinueButtonAppear(args)
    }, (e) => {
        hideContinueButton(args)
    })
}


exports.chooseEventLocation = async (args) => {
    await eventNameJS.chooseEventLocation(args, loadAnimation)
    this.validateSecondPageEvents(args)
}

/*----------------third slide------------------*/
exports.validateThirdPageEvents = (args) => {
    eventDescriptionJS.validateThirdPageEvents(args).then((result) => {
        makeContinueButtonAppear(args)
    }, (e) => {
        hideContinueButton(args)
    })
}

/*----------------Fourth slide------------------*/
exports.chooseTicketType = async (args) => {
    await eventTimePrice.chooseTicketType(args, loadAnimation)
    this.validateFourthPageEvents(args)
}

exports.limitTotalCapicity = async (args) => {
    await c.limitTotalCapicity(args, loadAnimation)
    setTimeout(() => {
        this.validateFourthPageEvents(args)
    }, 500)

}

exports.validateFourthPageEvents = (args) => {
    eventTimePrice.validateFourthPageEvents(args).then((result) => {
        makeContinueButtonAppear(args)
    }, (e) => {
        hideContinueButton(args)
    })
}

function generateProductJs(args) {
    selectPhotosProducts = require("~/dashboard/modals/service/add-service/js/product/select-photos-products")
    selectPhotosProducts.initSlide(args)
    productNameJS = require("~/dashboard/modals/service/add-service/js/product/product-name")
    productPriceJS = require("~/dashboard/modals/service/add-service/js/product/product-price")
    productDeals = require("~/dashboard/modals/service/add-service/js/product/product-deals")
    productConfirmation = require("~/dashboard/modals/service/add-service/js/product/product-confirmation")

}

function generateEventJs(args) {
    selectPhotosEvents = require("~/dashboard/modals/service/add-service/js/event/select-photos-events")
    selectPhotosEvents.initSlide(args)
    eventNameJS = require("~/dashboard/modals/service/add-service/js/event/event-name")
    eventDescriptionJS = require("~/dashboard/modals/service/add-service/js/event/event-description")
    eventTimePrice = require("~/dashboard/modals/service/add-service/js/event/event-time-price")
    eventTimePrice.initSlide(args)

}

let createNewProductAnimationActive = false
exports.createNewProduct = async (args) => {
    if (!createNewProductAnimationActive) {
        createNewProductAnimationActive = true
        const button = args.object
        const page = button.page;
        const index = button.buttonId
        if (previousButton) {
            if (previousButton.buttonId == index) {
                loadAnimation(previousButton, "change background color", { color: 'white' })
                previousButton.color = "black"
                previousButton = null
                createNewProductAnimationActive = false
                return;
            }
        }
        if (previousButton) {
            loadAnimation(previousButton, "change background color", { color: 'white' })
            previousButton.color = "black"
        }
        await loadAnimation(button, "change background color", { color: 'black' })
        button.color = "white";
        previousButton = button;

        page.getViewById("continueLabel").visibility = "visible"
        page.getViewById("continueLabel").index = index
        loadAnimation(page.getViewById("continueLabel"), "fade in")
        createNewProductAnimationActive = false
    }
}