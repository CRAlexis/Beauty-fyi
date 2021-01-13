let images = []
let height;

exports.initSlide = (args) => {
    const page = args.object.page
    console.log("cleared images")
    images = []
    setTimeout(function () {
        height = (page.getMeasuredWidth() / 3)
    }, 500)
}

exports.openGallery = (args, sourceForm) => {
    console.log(images)
    return new Promise((resolve, reject) => {
        const animation = require("~/controllers/animationController").loadAnimation;
        const mPicker = require("nativescript-mediafilepicker");
        const mediafilepicker = new mPicker.Mediafilepicker();
        const page = args.object.page
        
        
        let maxNumberFiles = 6 - images.length
        let options = {
            android: {
                isCaptureMood: false, // if true then camera will open directly.
                isNeedCamera: true,
                maxNumberFiles: maxNumberFiles,
                isNeedFolderList: true
            }, ios: {
                isCaptureMood: false, // if true then camera will open directly.
                isNeedCamera: true,
                maxNumberFiles: maxNumberFiles
            }
        };

        if (images.length < 6) { mediafilepicker.openImagePicker(options); }

        mediafilepicker.on("getFiles", function (res) {

            let i = 0;
            let results = res.object.get('results');
            results.forEach(element => {
                images.push({
                    image: element.file,
                    height: height + "px",
                    index: i,
                })
                i++
            });
            page.getViewById("servicePhotosList").items = []
            page.getViewById("servicePhotosList").items = images;
            sourceForm.set("serviceImages", images)
        })
        if (images.length == 6) { page.getViewById("uploadImageContainer").visibility = "collapsed" } else { page.getViewById("uploadImageContainer").visibility = "visible" }
        resolve()
    })
}

exports.removeImage = (args, sourceForm) => {
    return new Promise((resolve, reject) => {
        const { areYouSure } = require("~/controllers/notifications/inApp/notification-alert");
        const page = args.object.page
        areYouSure("Are you sure?", "Do you want to delete this image").then((result) => {
            images.splice(args.object.index, 1);
            page.getViewById("servicePhotosList").items = []
            page.getViewById("servicePhotosList").items = images;
            sourceForm.set("serviceImages", images)
            if (images.length == 0) {
                reject()
            }
        })
    })
}

exports.onItemReorderService = (args, sourceForm) => {
    const page = args.object.page
    const items = page.getViewById("servicePhotosList").items
    images = []
    let i = 0;
    items.forEach(element =>{
        images.push({
            image: element.image,
            height: height + "px",
            index: i,
        })
        i++
    })
    page.getViewById("servicePhotosList").items = []
    page.getViewById("servicePhotosList").items = images
    sourceForm.set("serviceImages", images)

    console.log(images)
}