const animation = require("~/controllers/animationController").loadAnimation
const navigation = require("~/controllers/navigationController")
const application = require('application');
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
                await animation(page.getViewById("profilePageContainer"), "fade out", { opacity: 0.2 })
                page.getViewById("contentModal").visibility = 'visible';
                await animation(page.getViewById("contentModal"), "fade in")
                const height = (pageObject.getMeasuredWidth() / 3)
                loadImages(height)
                resolve(true)
            }, 100)
        }
    })

}

exports.closeModal = (args) => {
    return new Promise(async (resolve, reject) => {
        if (contentPreviewModalActive) {
            //const page = args.object.page
            await animation(pageObject.getViewById("contentModal"), "fade out")
            await animation(pageObject.getViewById("profilePageContainer"), "fade in")
            pageObject.getViewById("contentModal").visibility = 'collapsed';
            contentPreviewModalActive = false
            resolve(false)
        }
    })
}

function loadImages(height){
    let images = []
    images.push(
        {
            contentIndex: 1,
            contentImage: "~/images/temp.png",
            height: height + "px",
            contentName: "Hair wash and colouring with Tiffany Alexis "
        },
        {
            contentIndex: 1,
            contentImage: "~/images/temp2.png",
            height: height + "px",
            contentName: "Another style with another person "
        },
        {
            contentIndex: 1,
            contentImage: "~/images/temp3.png",
            height: height + "px",
            contentName: "One more style with one more person"
        },
        {
            contentIndex: 1,
            contentImage: "~/images/temp4.png",
            height: height + "px",
            contentName: "Hair wash and colouring with Tiffany Alexis "
        },
        {
            contentIndex: 1,
            contentImage: "~/images/temp5.png",
            height: height + "px",
            contentName: "Another style with another person "
        },
        {
            contentIndex: 1,
            contentImage: "~/images/temp6.png",
            height: height + "px",
            contentName: "One more style with one more person"
        },
    )
    //format photos when uploading
    var listview = pageObject.getViewById("contentGalleryList");
    listview.items = images;
}

exports.viewContent = (args) => {
    const mainView = args.object;
    const context = ""
    if (application.android) {
        application.android.on(application.AndroidApplication.activityBackPressedEvent, removeBackEvent);
    }
    navigation.navigateToModal(context, mainView, 19, true).then(function (result) {
        console.log(result)
    })
}

function removeBackEvent(){

}