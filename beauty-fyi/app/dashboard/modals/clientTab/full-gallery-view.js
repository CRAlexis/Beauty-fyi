const observableModule = require("tns-core-modules/data/observable");
const SocialShare = require("nativescript-social-share"); // I have hard coded sdk to 21
const imageSourceModule = require("tns-core-modules/image-source").ImageSource; 

let closeCallback;
let context
let imageIndex;

exports.onShownModally = function (args) {
    const page = args.object;
    context = args.context;
    closeCallback = args.closeCallback;
    imageIndex = context.imageIndex
    page.bindingContext = observableModule.fromObject({"imageUrl": context.imageUrl});
    
    
}

exports.swipe = function (args) {
    const page = args.object;
    //console.log(context.imageUrls[1]);
    switch (args.direction) {
        case 1:
            if (imageIndex > 1){
                imageIndex--
                page.bindingContext = observableModule.fromObject({ "imageUrl": context.imageUrls[imageIndex-1].image })
                
            }
            break;
        case 2:
            if (imageIndex < context.imageUrls.length){
                imageIndex++
                page.bindingContext = observableModule.fromObject({ "imageUrl": context.imageUrls[imageIndex-1].image })
            } 
            break;
        default:
            break;
    }
}

exports.pageTapped = async function (args) {
    const page = args.object;
    const bottomBar = page.getViewById("galleryViewBottomBar");
    const topBar = page.getViewById("galleryViewTopBar")
    if (page.backgroundColor == "#000000"){
        animation(page, "change background color", { color: "white", duration: 250 })
        animation(bottomBar, "fade in")
        animation(topBar, "fade in")
    }else{
        animation(page, "change background color", { color: "black", duration: 250 })
        animation(bottomBar, "fade out")
        animation(topBar, "fade out")
    }
}

exports.shareImage = function (args) {
    console.log("share")
    const page = args.object.page;
    const currentImagePath = page.getViewById("currentImage").src;
    
    let imageSource = imageSourceModule.fromFileSync(currentImagePath)
    console.log(imageSource);
        try {
            SocialShare.shareImage(imageSource)
        } catch (error) {
            console.log(error) //image path undefined
        }
        
        //SocialShare.shareUrl("https:/ / www.nativescript.org / ", "Home of NativeScript");
}

exports.deleteImage = function (args){
    const page = args.object.page;
    const currentImageId = page.getViewById("currentImage").src;
    // Need to tell JJ to delete them image here
    closeCallback();
}

exports.navigateBack = function(args) {
    closeCallback();
}
