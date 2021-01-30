const { areYouSure } = require("~/controllers/notifications/inApp/notification-alert");

let uploadedImageArray = []
let uploadedImageIndex = 0;
let formFormmated = []
exports.initialise = (args, sendHTTP, serviceID) => {
    uploadedImageArray = []
    uploadedImageIndex = 0;
    formFormmated = []
    const httpParameters = { url: 'consultationquestionsget', method: 'POST', content: { serviceID: serviceID }, }
    sendHTTP(httpParameters, { display: false }, { display: false }, { display: false })
        .then((response) => {
            if (response.JSON.status == "success") {
                //console.log(response.JSON.form)
                createForm(args, response.JSON.form)
            } else {
                console.log("failed to get form")
            }
        }, (e) => {
            console.log(e)
        })
}

function createForm(args, form) {
    const page = args.object.page
    const listView = page.getViewById("consultationPageForm");

    form.forEach(element => {
        formFormmated.push(
            {
                id: "consultationQuestion" + element.id,
                mysqlID: element.id,
                key: element.questionTypeIndex,
                question: element.question.trim(),
                optionContext: element.questionOptions,
            },
        )
    })

    listView.items = formFormmated
}

exports.uploadeReferenceImage = (args) => {
    const mPicker = require("nativescript-mediafilepicker");
    const mediafilepicker = new mPicker.Mediafilepicker();
    const page = args.object.page
    const listview = page.getViewById("uploadedImageList");
    const height = (page.getMeasuredWidth() / 3)

    try {
        uploadedImageIndex = listview.items.length
        uploadedimagesObject = listview.items
    } catch (error) { }

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
        page.getViewById("uploadedImageList").visibility = "visible"
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

exports.templateSelector = (item, index, items) => {
    return formFormmated[index].key.toString()
}

exports.validateConsultationPage = (args) => {
    return new Promise((resolve, reject) => {
        const page = args.object.page
        let formAraryId = []
        let currentState = true
        setTimeout(async () => {
            formFormmated.forEach(element => {
                try {
                    console.log(element.id)
                    if (element.key == 3) {
                        formAraryId.push(page.getViewById(element.id).checked)
                    } else {
                        formAraryId.push(page.getViewById(element.id).text)
                    }
                } catch (error) {
                    console.log(error)
                }
            });
            console.log(formAraryId)
            let index = 0
            await formAraryId.forEach(element => {
                console.log("key: " + formFormmated[index].key)
                if (formFormmated[index].key != 3 && !element) {
                    currentState = false
                }
                index++
            });
            if (currentState) {
                console.log("resolved")
                resolve()
            } else {
                console.log("Rejecte")
                reject()
            }
        }, 500)
        //validate 

    })
}

exports.getData = (args, sourceForm) => {
    const page = args.object.page
    let sourceFormArray = []
    let images = []
    formFormmated.forEach(element => {
        if (element.key == 3) {
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