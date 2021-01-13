const { areYouSure } = require("~/controllers/notifications/inApp/notification-alert");

let uploadedImageArray = []
let uploadedImageIndex = 0;
exports.initialise = (args) => {
    createForm(args)
}

function createForm(args){
    const page = args.object.page
    const listView = page.getViewById("consultationPageForm");
    let form = []
    form.push(
        {
            question: 'What type of hair do you have?',
            isTextField: true,
            isDropDown: false,
            isCheckBox: false,
            optionContext: '',
        },
        {
            question: 'How would you describe the health of your hair?',
            isTextField: false,
            isDropDown: true,
            isCheckBox: false,
            optionContext: 'option1,option2,option3,option4',
        },
        {
            question: 'Would you like to listen to music?',
            isTextField: false,
            isDropDown: false,
            isCheckBox: true,
            optionContext: '',
        },
    )

    listView.items = form
}

exports.uploadeReferenceImage = (args) =>{
    const mPicker = require("nativescript-mediafilepicker");
    const mediafilepicker = new mPicker.Mediafilepicker();
    const page = args.object.page
    const listview = page.getViewById("uploadedImageList");
    const height = (page.getMeasuredWidth() / 3)
    
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
                    height: height + "px",
                    index: uploadedImageIndex,
                },
            )
            uploadedImageIndex++
        });
        //format photos when uploading
        listview.items = []
        listview.items = uploadedImageArray;
        if (uploadedImageIndex == 3) { page.getViewById("uploadReferenceImageButton").visibility = "collapsed" }
    });

    
}

exports.referenceimageTapped = (args) => {
    const page = args.object.page
    const id = args.object.id
    const listview = page.getViewById("uploadedImageList");
    areYouSure("Do you want to remove this image?").then(function (result) {
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
        if (uploadedImageIndex < 3) { page.getViewById("uploadReferenceImageButton").visibility = "visible" }
    })
    
}

