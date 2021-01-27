const Observable = require("tns-core-modules/data/observable").Observable;
const sendHTTP = require("~/controllers/HTTPControllers/sendHTTP").sendHTTP;
const application = require('application');
const { loadAnimation } = require("~/controllers/animationController")
const { Builder } = require("@nativescript/core/ui/builder")
const navigation = require("~/controllers/navigationController")
let closeCallback;
let formModalActive;
let lastOpenedContainer;
let lastOpenedButtonSection;
let questionsArray = []
let formData = []

exports.onShownModally = function (args) {
    const context = args.context;
    closeCallback = args.closeCallback;
    const page = args.object;
    page.bindingContext;
}

exports.loaded = (args) => {
    getData(args)
    const page = args.object.page
    page.on('goBack', () => { backEvent(args) })
    if (application.android) { application.android.on(application.AndroidApplication.activityBackPressedEvent, backEvent); }
    pageStateChanged = false;
}

function getData(args) {
    const httpParameters = { url: 'formsget', method: 'POST', content: {}, }
    sendHTTP(httpParameters, { display: true }, { display: false }, { display: false })
        .then((response) => {
            if (response.JSON.status == "success") {
                formData = response.JSON.serviceForms
                createFormsListView(args, response.JSON.serviceForms)
            } else {
                console.log("This user does not have any forms")
            }
        }, (e) => {
            console.log(e)
        })
}


exports.expandSection = async (args) => {
    const object = args.object
    const page = object.page
    const serviceFormID = object.serviceFormID
    const lowerSection = object.parent.getChildAt(1)
    const buttonSection = object.parent.getChildAt(2)

    if (lowerSection.height == 1) {
        if (lastOpenedContainer) {
            loadAnimation(lastOpenedContainer, "reduce section down", { height: 1 })
            loadAnimation(lastOpenedContainer, "fade out")
            await loadAnimation(lastOpenedButtonSection, "fade out"); lastOpenedButtonSection.visibility = "collapsed"
            questionsArray.forEach(element => {
                try {
                    lastOpenedContainer.removeChild(element)
                } catch (error) {
                }
            })
        }
        lastOpenedContainer = lowerSection; lastOpenedButtonSection = buttonSection
        getFormQuestions(serviceFormID).then((result) => {
            result.forEach(element => {
                try {
                    let question = Builder.load({
                        path: "~/dashboard/modals/settings/settingsMenu/intakeForm",
                        name: "form-label-object",
                        attributes: {
                            text: element.question + "?",
                        }
                    });
                    questionsArray.push(question)
                    lowerSection.addChild(question)
                } catch (error) {

                }
            })
        })

        await loadAnimation(lowerSection, "expand section down", { height: 'auto' })
        loadAnimation(lowerSection, "fade in")
        buttonSection.visibility = "visible"
        loadAnimation(buttonSection, "fade in");
    } else {
        loadAnimation(lowerSection, "fade out")
        loadAnimation(lowerSection, "reduce section down", { height: 1 })
        await loadAnimation(buttonSection, "fade out"); buttonSection.visibility = "collapsed"
        try {
            questionsArray.forEach(element => {
                lastOpenedContainer.removeChild(element)
            })
        } catch (error) { }
        lastOpenedContainer = null
        lastOpenedButtonSection = null
    }
}

function getFormQuestions(serviceFormID) {
    return new Promise((resolve, reject) => {
        const httpParameters = { url: 'formquestionsget', method: 'POST', content: { serviceFormID: serviceFormID }, }
        sendHTTP(httpParameters, { display: false }, { display: false }, { display: false })
            .then((response) => {
                if (response.JSON.status == "success") {
                    resolve(response.JSON.serviceFormQuestions)
                } else {
                    console.log("This user does not have any forms")
                }
            }, (e) => {
                console.log(e)
            })
    })

}

exports.editIntakeForm = (args) => {
    if (application.android) { application.android.off(application.AndroidApplication.activityBackPressedEvent, backEvent); }
    const mainView = args.object;
    const context = ""
    navigation.navigateToModal(context, mainView, 22, true).then(function (result) {
        if (application.android) { application.android.on(application.AndroidApplication.activityBackPressedEvent, backEvent); }
    })
}

exports.createNewIntakeForm = (args) => {
    if (application.android) { application.android.off(application.AndroidApplication.activityBackPressedEvent, backEvent); }
    const mainView = args.object;
    const context = ""
    navigation.navigateToModal(context, mainView, 22, true).then(function (result) {
        getData(args)
        if (application.android) { application.android.on(application.AndroidApplication.activityBackPressedEvent, backEvent); }
    })
}

exports.deleteIntakeForm = (args) => {
    const object = args.object
    const page = object.page
    const serviceFormID = object.serviceFormID
    const httpParameters = {
        url: 'deleteform',
        method: 'POST',
        content: {
            serviceFormID: serviceFormID,
        },
    }
    sendHTTP(httpParameters, { display: false }, { display: false }, { display: true }).then((result) => {
        if (result.JSON.status == "success") {
            getData(args)
        }
    }, (e) => {
        console.log(e)
    })
}


function backEvent(args) { // This event is a bit funny
    args.cancel = true;
    if (application.android) {
        application.android.off(application.AndroidApplication.activityBackPressedEvent, backEvent);
    }
    closeCallback();
}

function createFormsListView(args, forms) {
    const page = args.object.page
    let formArray = []
    forms.forEach(element => {
        formArray.push({
            serviceFormID: element.id,
            intakeFormName: element.form_name,
            serviceActive: element.active
        })
    });
    //format photos when uploading
    console.log(formArray)
    var listview = page.getViewById("intakeFormListView");
    listview.items = []
    listview.items = formArray;
}


