let productPrice;
let postagePrice;
let postageDescription;
let internationalPostage;
let postageShippingTime;
let checkbox;
exports.validateThirdPageProducts = (args) => {
    return new Promise((resolve, reject) => {
        const page = args.object.page
        productPrice = page.getViewById("productPrice").text
        postagePrice = page.getViewById("postagePrice").text
        postageDescription = page.getViewById("postageDescription").text
        internationalPostage = page.getViewById("internationalPostagePrice").text
        postageShippingTime = page.getViewById("postageShippingTime").text
        checkbox = page.getViewById("allowInternationalShippingCheckBox")
        if (checkbox.checked){
            if (productPrice && postagePrice && postageShippingTime && internationalPostage.length > 1) {
                resolve()
            } else {
                reject()
            }
        }else {
            if (productPrice && postagePrice && postageShippingTime) {
                resolve()
            } else {
                reject()
            }
        }  
    })
}

exports.allowInternationalShipping = (args) => {
    return new Promise((resolve, reject) => {
        const object = args.object
        const page = object.page
        setTimeout(()=> {
            if (object.checked){
                page.getViewById("internationalPostagePrice").visibility = "visible"
            }else{
                page.getViewById("internationalPostagePrice").visibility = "collapsed"
            }
            resolve()
        }, 250)
    })
}

exports.addToBasket = (sourceFormProduct) => {
    sourceFormProduct.set("productPrice", productPrice)
    sourceFormProduct.set("postagePrice", postagePrice)
    sourceFormProduct.set("postageDescription", postageDescription)
    sourceFormProduct.set("internationalPostage", internationalPostage)
    sourceFormProduct.set("postageShippingTime", postageShippingTime)
    sourceFormProduct.set("AllowInternationalShipping", checkbox.checked)
}