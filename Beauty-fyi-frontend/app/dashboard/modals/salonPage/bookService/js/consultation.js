const { areYouSure } = require("~/controllers/notifications/inApp/notification-alert");

let uploadedImageArray = []
let uploadedImageIndex = 0;
let form = []
exports.initialise = (args) => {
    createForm(args)
}

function createForm(args){
    const page = args.object.page
    const listView = page.getViewById("consultationPageForm");
    
    form.push(
        {
            id: "consultationQuestion" + 0,
            key: 0,
            question: 'What type of hair do you have?',
            isTextField: true,
            isDropDown: false,
            isCheckBox: false,
            optionContext: '',
        },
        {
            id: "consultationQuestion" + 1,
            key: 1,
            question: 'How would you describe the health of your hair?',
            isTextField: false,
            isDropDown: true,
            isCheckBox: false,
            optionContext: 'option1,option2,option3,option4',
        },
        {
            id: "consultationQuestion" + 2,
            key: 2,
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

exports.templateSelector = (item, index, items) =>{
    return form[index].key.toString()
}

exports.validateConsultationPage = (args) => {
    return new Promise((resolve, reject) => {
        let page = args.object.page
        let formAraryId = []
        let currentState = true
        setTimeout(async ()=>{
            form.forEach(element => {
                console.log(element.id)
                if (element.key == 2) {
                    formAraryId.push(page.getViewById(element.id).checked)
                } else {
                    formAraryId.push(page.getViewById(element.id).text)
                }
            });
            console.log(formAraryId)
            let index = 0
            await formAraryId.forEach(element => {
                console.log("key: " + form[index].key)
                if (form[index].key != 2 && !element) {
                    currentState = false           
                }
                index++
            });
            if (currentState){
                console.log("resolved")
                resolve()
            }else{
                console.log("Rejecte")
                reject()
            }
        }, 125)
        //validate 
    })
}

exports.getData = (args, sourceForm) => {
    const page = args.object.page
    let sourceFormArray = []
    let images = []
    form.forEach(element => {
        if (element.key == 2) {
            sourceFormArray.push(page.getViewById(element.id).checked)
        } else {
            sourceFormArray.push(page.getViewById(element.id).text)
        }
    });

    uploadedImageArray.forEach(element => {
        images.push(element.image)
    });
    sourceForm.set("images", images)
    sourceForm.set("consultationAnswers", sourceFormArray)
    sourceForm.set("appointmentNotes", page.getViewById("appointmentNotes").text)

    
}