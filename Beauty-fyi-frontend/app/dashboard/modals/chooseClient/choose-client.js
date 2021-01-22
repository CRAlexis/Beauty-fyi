
const Observable = require("tns-core-modules/data/observable").Observable;
const navigation = require("~/controllers/navigationController")
const slideTransition = require("~/controllers/slide-transitionController");
const {sendHTTP} = require("~/controllers/HTTPControllers/sendHTTP");
const application = require('application');
source = new Observable();
let closeCallback;
let image;

exports.onShownModally = function (args) {
    const context = args.context;
    closeCallback = args.closeCallback;
    const page = args.object;
    page.bindingContext = source
    if (application.android) {
        application.android.on(application.AndroidApplication.activityBackPressedEvent, backEvent);
    }
    initChooseClientPage(args)
}

function backEvent(args) { // This event is a bit funny
    args.cancel = true;
    if (application.android) {
        application.android.off(application.AndroidApplication.activityBackPressedEvent, backEvent);
    }
    closeCallback();
}

exports.selectClient = (args) => {
    closeCallback(args.object.id)
}

exports.addNewClient = async (args) => {
    const mainView = args.object;
    const context = ""
    navigation.navigateToModal(context, mainView, 26, true).then(function (result) {
        if (application.android) {
            application.android.off(application.AndroidApplication.activityBackPressedEvent, backEvent);
        }
        console.log("UserID in choose client: " + result)
        closeCallback(result)
    })
}

exports.selectPhoto = (args) => {
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
        image = results[0].file
        console.log(results)
        console.log(image)
        page.getViewById("clientImage").src = image
        page.getViewById("clientImage").visibility = "visible"
        page.getViewById("clientImageAvatar").visibility = "collapsed"
    })
}

exports.createClient = (args) => {
    
    const page = args.object.page
    
    const firstName = page.getViewById("firstName").text
    const lastName = page.getViewById("lastName").text
    const emailAddress = page.getViewById("emailAddress").text
    const phoneNumber = page.getViewById("phoneNumber").text // get data
    const clientNotes = page.getViewById("clientNotes").text // get data

    if (!firstName.length > 3 && !lastName.length > 3 && !emailAddress.length > 6) { // validate data
        //say that information aint filled correctly
        //reg ex on email
        return;
    }

    return new Promise((resolve, reject) => {
        let files = [
            {
                name: "photo[]",
                filename: image,
                mimeType: "image/jpeg"
            }
        ]
        const httpParametersPicture = {
            url: "addclient",
            method: 'POST',
            description: "Adding client",
            file: files,
            content: {
                firstName: firstName,
                lastName: lastName,
                emailAddress: emailAddress,
                phoneNumber: phoneNumber,
                clientNotes: clientNotes,

            }
        }
        sendHTTPFile(httpParametersPicture).then((result) => {
            resolve()
            //closeCallback(1) userID
        }, (error) => {
            reject()
        })
    })
    
}

exports.exit = async (args) => {
    const page = args.object.page
    let slides = [page.getViewById("chooseClientSlide"), page.getViewById("addClientSlide")]
    await slideTransition.goToCustomSlide(args, 1, 0, null, slides)
}

function initChooseClientPage(args) {
    const page = args.object.page
    clients = []
    clients.push(
        {
            clientImage: "~/images/temp.png",
            clientName: "Chiedza Kamabarami",
            id: "1"
        },
        {
            clientImage: "~/images/temp1.png",
            clientName: "Tiffany Alexis",
            id: "2"
        },
    )
    //format photos when uploading
    var listview = page.getViewById("addClientList");
    listview.items = clients;
}