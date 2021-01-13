let images = []
exports.initConfirmationPage = (args, sourceForm) =>{
    setTimeout(function () {
        const page = args.object.page
        const height = (page.getMeasuredWidth() / 4)

        loadInformation(page, sourceForm)
        loadGallery(height, page, sourceForm)
    }, 75)
    
}

function loadGallery(height, page, sourceForm){
    let i = 0;
    sourceForm.productImages.forEach(element => {
        
        images.push({
            contentImage: element.image,
            contentId: i,
            height: height + "px",
            }
        )
        i++
    });
    var listview = page.getViewById("productGalleryList");
    listview.items = images;
    page.getViewById("displayImage").src = images[0].contentImage

    
}

function loadInformation(page, sourceForm){
    page.getViewById("productConfirmationName").text = sourceForm.productName
    page.getViewById("productConfirmationPrice").text = sourceForm.productPrice
    page.getViewById("productConfirmationCategory").text = "Category: " + sourceForm.productCategory
    page.getViewById("productConfirmationPostage").text = "Postage: " + sourceForm.postagePrice
    page.getViewById("productConfirmationDescription").text = sourceForm.productDescription
}

exports.viewContent = (args) => {
    try {
        const page = args.object.page
        const id = args.object.index;
        page.getViewById("displayImage").src = images[id].contentImage
    } catch (error) {
        console.log(error)
    }
    
}