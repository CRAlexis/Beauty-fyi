let uploadedImageArray = []
let uploadedImageIndex = 0;
exports.initialise = (args) => {
    //createForm(args)
}

function createForm(args){
    const page = args.object.page
    const listView = page.getViewById("consultationPageForm");
    let form = {
        //questionType = ""
    }

    listView.items = form

}

exports.uploadeReferenceImage = (args) =>{
    const mPicker = require("nativescript-mediafilepicker");
    const mediafilepicker = new mPicker.Mediafilepicker();
    const page = args.object.page
    const listview = page.getViewById("uploadedImageList");
    
    try { 
        uploadedImageIndex = listview.items.length
        uploadedimagesObject = listview.items
    } catch (error) {   }

    let options = {
        android: {
            isCaptureMood: false, // if true then camera will open directly.
            isNeedCamera: true,
            maxNumberFiles: 3 - uploadedImageIndex,
            isNeedFolderList: true
        }, ios: {
            isCaptureMood: false, // if true then camera will open directly.
            isNeedCamera: true,
            maxNumberFiles: 3 - uploadedImageIndex
        }
    };

    if (uploadedImageIndex < 3) { mediafilepicker.openImagePicker(options); }
    mediafilepicker.on("getFiles", function (res) {
        let results = res.object.get('results');
        Object.keys(results).forEach(key => {
            uploadedImageArray.push(
                {
                    image: results[key].file,
                    height: source.get("height") + "px",
                    index: uploadedImageIndex,
                },
            )
            uploadedImageIndex++
        });
        //format photos when uploading
        listview.items = []
        listview.items = uploadedImageArray;

    });
}

exports.referenceimageTapped = (args) => {
    const page = args.object.page
    const id = args.object.id
    const listview = page.getViewById("uploadedImageList");
    inAppNotifiationAlert.areYouSure("Do you want to remove this image?").then(function (result) {
        uploadedImageArray.splice(id, 1)
        uploadedImageIndex--
        let indexReal = 0;
        for (let index = 0; index < uploadedImageArray.length; index++) {
            try {
                uploadedImageArray[index].index = indexReal
                indexReal++
            } catch (error) {

            }
        }
        listview.items = []
        listview.items = uploadedImageArray;
    })
}

