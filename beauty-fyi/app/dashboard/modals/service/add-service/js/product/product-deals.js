exports.allowBundles = (args, animation) => {
    const page = args.object.page
    setTimeout(async ()=> {
        if (args.object.checked){
            page.getViewById("discountContainer").visibility = "visible"
            animation(page.getViewById("discountContainer"), "fade in")
        }else{
            await animation(page.getViewById("discountContainer"), "fade out")
            page.getViewById("discountContainer").visibility = "collapsed"
        }
    }, 250)
}

exports.addToBasket = (args, sourceForm) => {
    const page = args.object.page
    if (page.getViewById("discountContainer").visibility == "visible"){
        sourceForm.set("allowDeals", true)
        sourceForm.set("buyTwoDeal", page.getViewById("buyTwoDeal").text)
        sourceForm.set("buyThreeDeal", page.getViewById("buyThreeDeal").text)
        sourceForm.set("buyFourDeal", page.getViewById("buyFourDeal").text)
    }else{
        sourceForm.set("allowDeals", false)
        sourceForm.set("buyTwoDeal", null)
        sourceForm.set("buyThreeDeal", null)
        sourceForm.set("buyFourDeal", null)
    }
}