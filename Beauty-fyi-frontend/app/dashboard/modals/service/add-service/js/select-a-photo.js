exports.openGallery = (args, sourceForm, source) => {
    return new Promise((resolve, reject) => {
        const animation = require("~/controllers/animationController").loadAnimation;
        const mPicker = require("nativescript-mediafilepicker");
        const mediafilepicker = new mPicker.Mediafilepicker();
        const page = args.object.page
        let options = {
            android: {
                isCaptureMood: false, // if true then camera will open directly.
                isNeedCamera: true,
                maxNumberFiles: 1,
                isNeedFolderList: true
            }, ios: {
                isCaptureMood: false, // if true then camera will open directly.
                isNeedCamera: true,
                maxNumberFiles: 1
            }
        };

        mediafilepicker.openImagePicker(options);
        mediafilepicker.on("getFiles", function (res) {
                let results = res.object.get('results');
                source.set("serviceImage", results[0].file)
                sourceForm.set("serviceImage", results[0].file)
                animation(page.getViewById("uploadImageContainer"), "fade out").then(function () {
                })
                animation(page.getViewById("serviceImageComponent"), "fade in").then(function () {
                })
            resolve()
        })
        
    })
}