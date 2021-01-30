
let productName;
let productQuantity;
let productDescription;
let productCategory;
exports.validateSecondPageProducts = (args) => {
    return new Promise((resolve, reject) => {
        const page = args.object.page
        productName = page.getViewById("productName").text
        productQuantity = page.getViewById("productQuantity").text
        productDescription = page.getViewById("productDescription").text
        productCategory = page.getViewById("productCategory").text
        if (productName && productQuantity && productDescription && productCategory){
            resolve()
        }else{
            reject()
        }
    })
}

exports.addToBasket = (sourceForm) => {
    sourceForm.set("productName", productName)
    sourceForm.set("productQuantity", productQuantity)
    sourceForm.set("productDescription", productDescription)
    sourceForm.set("productCategory", productCategory)
}