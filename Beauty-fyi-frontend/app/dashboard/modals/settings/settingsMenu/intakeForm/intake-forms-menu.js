const Observable = require("tns-core-modules/data/observable").Observable;
const animation = require("~/controllers/animationController").loadAnimation;
const sendHTTP = require("~/controllers/HTTPControllers/sendHTTP").sendHTTP;
const formModal = require("~/dashboard/modals/settings/settingsMenu/intakeForm/intake-form-modal")
const application = require('application');
let closeCallback;
let formModalActive;

exports.onShownModally = function (args) {
    const context = args.context;
    closeCallback = args.closeCallback;
    const page = args.object;
    page.bindingContext;
}

exports.loaded = (args) => {
    const page = args.object.page
    page.on('goBack', () => {
        backEvent(args)
    })
    if (application.android) {
        application.android.on(application.AndroidApplication.activityBackPressedEvent, backEvent);
    }
    pageStateChanged = false;
    createList(args)
}


exports.viewForm = (args) => {
    formModal.openModal(args).then((result) => {
        if (application.android) {
            application.android.off(application.AndroidApplication.activityBackPressedEvent, backEvent);
            application.android.on(application.AndroidApplication.activityBackPressedEvent, closeModal);
        }
        const evtData = {
            eventName: 'formModalOpened',
            formId: 1 
        };
        args.object.page.notify(evtData)
        formModalActive = result
    })    
}

exports.onPageScroll = (args) => {
    closeModal(args)
}

exports.modifyBackEvent = (turnOn) => {
    if(turnOn){
        application.android.on(application.AndroidApplication.activityBackPressedEvent, closeModal);
    }else{
        application.android.off(application.AndroidApplication.activityBackPressedEvent, closeModal);
    }
}

function closeModal(args) {
    console.log("close the modal")
    args.cancel = true;
    formModal.closeModal(args).then((result) => {
        if (application.android) {
            application.android.off(application.AndroidApplication.activityBackPressedEvent, closeModal);
            application.android.on(application.AndroidApplication.activityBackPressedEvent, backEvent);
        }

        formModalActive = result
    })
}


exports.pageClicked = (args) => {
    if (formModalActive) {
        formModal.closeModal(args).then((result) => {
            if (application.android) {
                application.android.off(application.AndroidApplication.activityBackPressedEvent, closeModal);
            }
            formModalActive = result
        })
    }
}

exports.modalShield = (args) => {
}

function backEvent(args) { // This event is a bit funny
    console.log("close the page")
    args.cancel = true;
    if (application.android) {
        application.android.off(application.AndroidApplication.activityBackPressedEvent, backEvent);
    }
    closeCallback();
}

function createList(args){
    const page = args.object.page
    let forms = []
    forms.push(
        {
            intakeFormName: "Form for washing",
        },
        {
            intakeFormName: "Form for Styling",
        },

    )
    //format photos when uploading
    var listview = page.getViewById("intakeFormListView");
    listview.items = forms;
}


