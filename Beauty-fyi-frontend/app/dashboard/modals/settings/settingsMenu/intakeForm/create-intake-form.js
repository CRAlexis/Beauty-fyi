const navigation = require("~/controllers/navigationController");
const application = require('application');
const animation = require("~/controllers/animationController").loadAnimation;
const { errorMessage } = require("~/controllers/notifications/inApp/notification-alert");
const { sendHTTP } = require("~/controllers/HTTPControllers/sendHTTP");
const { Observable } = require("@nativescript/core");
const { SecureStorage } = require("nativescript-secure-storage");
let secureStorage = new SecureStorage;
let source = new Observable;
let questions = [];
let pageStateChanged;
let serviceListView = []
let applyToServiceArray = []
let i = 0;
let serviceFormID;
let ejectOnPageClick = false
exports.onShownModally = function (args) {
    const context = args.context;
    const page = args.object;
    page.bindingContext = source;
    closeCallback = args.closeCallback;
    page.getViewById("menuHeader").header = "new title"

    if (context.state == "edit") {
        loadDatabaseData(args)
        const evtData = {
            eventName: 'refresh',
            header: 'Edit intake form',
        };
        args.object.page.notify(evtData)
    } else {
        // dont load the data in
        const evtData = {
            eventName: 'refresh',
            header: 'Create intake form',
        };
        args.object.page.notify(evtData)
    }
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
}

function backEvent(args) { // This event is a bit funny  
    if (i == 0) {
        args.cancel = true;
        if (application.android) {
            application.android.off(application.AndroidApplication.activityBackPressedEvent, backEvent);
        }
        closeCallback();
    }
    i++
}

exports.saveForm = async (args) => {
    try {
        const page = args.object.page
        const listview = page.getViewById("addFormListView")
        if (questions.length > 0) {
            listview.items ? listview.items.forEach(element => {
                if (element.key != 2) {
                    if (!element.question) {
                        errorMessage("Please fill in the form");
                        throw "Please fill in the form"
                    }
                } else {
                    if (!element.question || !element.options) {
                        errorMessage("Please fill in the form");
                        throw "Please fill in the form"
                    }
                }
            }) : false
            page.getViewById("saveAsModal").visibility = 'visible'
            await animation(page.getViewById("pageContainer"), "fade out", { opacity: 0.2 })
            await animation(page.getViewById("saveAsModal"), 'fade in');
        }
    } catch (error) {

    }
}

exports.saveFormFinal = async (args) => {
    const page = args.object.page
    const listview = page.getViewById("addFormListView")
    const object = args.object
    const formName = object.parent.getChildAt(1).text;
    if (!formName) {//check the name
        errorMessage("Please write a name")
        return
    }
    try {
        object.isEnabled = false
        let formQuestions = []
        listview.items ? listview.items.forEach(element => {
            if (element.key != 2) {
                formQuestions.push({
                    index: element.index,
                    id: element.id,
                    key: element.key,
                    questionType: element.questionType,
                    question: page.getViewById(element.id).text,
                })
            } else {
                formQuestions.push({
                    index: element.index,
                    id: element.id,
                    key: element.key,
                    questionType: element.questionType,
                    question: page.getViewById(element.id).text.replace(/\?/gi, ""),
                    options: element.options
                })
            }
        }) : false

        const content = {
            formQuestion: formQuestions,
            formName: formName
        }
        const httpParameters = {
            url: 'addform',
            method: 'POST',
            content: content,
        }
        sendHTTP(httpParameters)
            .then((response) => {
                if (response.JSON.status == "success") {
                    serviceFormID = response.JSON.serviceFormID
                    attachFormToService(args, response.JSON.serviceFormID)
                    object.isEnabled = true
                    ejectOnPageClick = true
                } else {
                    errorMessage("Unable to create your intake form. Please try again later.")
                    object.isEnabled = true
                }

            }, (e) => {
                console.log(e)
            })
    } catch (error) {

    }
}

async function attachFormToService(args) {
    try {
        const page = args.object.page
        await animation(page.getViewById("saveSlide"), "fade out"); page.getViewById("saveSlide").visibility = "collapsed"
        getServiceData(args).then(() => {
            console.log("resolved")
            animation(page.getViewById("attatchToFormSlide"), "fade in"); page.getViewById("attatchToFormSlide").visibility = "visible"
        }, (e) => {
            console.log("rejected")
            closeCallback()
        }).finally(() => {
            console.log("finally")
        })
    } catch (error) {
        console.log(error)
    }

}

function getServiceData(args, row = 1) {
    return new Promise(async (resolve, reject) => {
        const page = args.object.page
        let repeater = page.getViewById("servicesList")
        let serviceData;
        let sendRequests = true
        let Reject = false
        const httpParameters = {
            url: 'servicegetdata',
            method: 'POST',
            content: { userID: await secureStorage.get({ key: "userID" }), row: row },
        }

        sendHTTP(httpParameters, { display: false }, { display: false, title: null, message: "Successfully created your new form" }).then((result) => {
            let processedImages = 0
            sendRequests = result.JSON.continueRequests
            serviceData = result.JSON.service
            console.log("Amonut of services got: " + serviceData.length)
            if (serviceData.length > 0) {
                serviceData.forEach(async element => {
                    serviceListView.push({
                        serviceIndex: element.id,
                        serviceName: element.name,
                    })
                    source.set("serviceList", serviceListView)
                    repeater.refresh()
                    processedImages++
                    if (processedImages == serviceData.length) {
                        if (sendRequests) {
                            row++
                            console.log("going for another round")
                            resolve()
                            getServiceData(args, row)
                        }
                    }
                })
            } else {
                reject()
            }
        })
    })

}

exports.selectThisService = (args) => {
    const object = args.object
    const page = object.page
    if (object.isEnabled) {
        object.isEnabled = false
        const serviceID = object.serviceIndex
        setTimeout(async () => {
            if (!object.checked) {
                applyToServiceArray.push({
                    serviceID: serviceID
                })
            } else {
                let index = 0;
                applyToServiceArray.forEach(element => {
                    if (element.serviceID == serviceID) {
                        applyToServiceArray.splice(index, 1);
                    }
                    index++
                })
            }
            object.isEnabled = true
            object.checked = !object.checked
            if (applyToServiceArray.length > 0) {
                animation(page.getViewById("skipLabel"), "fade out"); page.getViewById("skipLabel").visibility = "collapsed"
                animation(page.getViewById("applyToServicesButton"), "fade in"); page.getViewById("applyToServicesButton").visibility = "visible"
            } else {
                animation(page.getViewById("applyToServicesButton"), "fade out"); page.getViewById("applyToServicesButton").visibility = "collapsed"
                animation(page.getViewById("skipLabel"), "fade in"); page.getViewById("skipLabel").visibility = "visible"
            }
        }, 125)
    }
}

exports.applyToServices = (args) => {
    const page = args.object.page
    const content = {
        serviceIDs: applyToServiceArray,
        serviceFormID: serviceFormID
    }
    const httpParameters = {
        url: 'connectformtoservice',
        method: 'POST',
        content: content,
    }
    sendHTTP(httpParameters)
        .then((response) => {
            //success
            console.log("we are here")
            closeCallback()
        }, (e) => {
            console.log(e)
        })
}

exports.skipApplyToService = (args) => {
    closeCallback()
}

exports.pageClicked = async (args) => {
    const page = args.object.page
    if (!ejectOnPageClick) {
        if (page.getViewById("saveAsModal").visibility == 'visible') {
            await animation(page.getViewById("pageContainer"), "fade in")
            await animation(page.getViewById("saveAsModal"), 'fade out');
            page.getViewById("saveAsModal").visibility = 'collapsed'
        }
    }
}

exports.pageBlocker = (args) => {
    //Blocked
}

exports.addQuestion = (args) => {
    const mainView = args.object;
    let context = mainView.optionContext.split(",")
    pageStateChanged = false;
    navigation.navigateToModal(context, mainView, 4, false).then(function (result) {
        if (result.localeCompare("Textbox") == '0') { createQuestion(args, 1) }
        if (result.localeCompare("Drop down list") == '0') { createQuestion(args, 2) }
        if (result.localeCompare("Yes/No choice") == '0') { createQuestion(args, 3) }
    })
}

exports.removeQuestion = (args) => {
    const page = args.object.page
    var listview = page.getViewById("addFormListView")
    const length = listview.items.length
    const index = args.object.index
    if (length > 0) {
        questions.splice(index - 1, 1)
        let questionsHolder = questions
        questions = []
        let i = 1;
        questionsHolder.forEach(element => {
            questions.push({
                index: i,
                id: element.id,
                id2: element.id2,
                questionType: element.questionType,
                text: page.getViewById(element.id).text,
                textViewText: page.getViewById(element.id2).text,
                visibilityDropDown: element.visibilityDropDown
            })
            i++
        });
    }
    listview.items = [];
    listview.items = questions;
}


exports.templateSelector = (item, index, items) => {
    return questions[index].key.toString()
}

exports.onItemReorderEvent = (args) => {
    const page = args.object.page
    const listView = page.getViewById("addFormListView")
    questions = []
    let i = 0;
    listView.items.forEach(element => {
        questions.push({
            index: id,
            id: element.id,
            key: type,
            questionType: element.questionType,
            text: page.getViewById(element.id).text,
        })
        i++
    })
    listView.items = []
    listView.items = questions
}

function createQuestion(args, type) {
    try {
        const page = args.object.page
        var listview = page.getViewById("addFormListView")
        let id = listview.items ? listview.items.length : 0

        listview.items ? listview.items.forEach(element => {
            if (element.key != 2) {
                if (!element.question) {
                    errorMessage("Please fill in the form");
                    throw "Fill in the form";
                }
            } else {
                if (!element.question || !element.options) {
                    errorMessage("Please fill in the form");
                    throw "Fill in the form";
                }
            }
        }) : false

        questions = []
        listview.items ? listview.items.forEach(element => {
            if (element.key != 2) {
                questions.push({
                    index: element.index,
                    id: element.id,
                    key: element.key,
                    questionType: element.questionType,
                    question: page.getViewById(element.id).text,
                })
            } else {
                questions.push({
                    index: element.index,
                    id: element.id,
                    key: element.key,
                    questionType: element.questionType,
                    question: page.getViewById(element.id).text,
                    options: element.options
                })
            }

        }) : false

        switch (type) {
            case 1:
                questions.push(
                    {
                        index: id,
                        id: "addFormListView" + id,
                        questionType: 'textbox',
                        question: '',
                        key: type,
                    },
                )
                break;
            case 2:
                questions.push(
                    {
                        index: id,
                        id: "addFormListView" + id,
                        questionType: 'dropdown',
                        question: '',
                        options: '',
                        key: type,
                    },
                )
                break;
            case 3:
                questions.push(
                    {
                        index: id,
                        id: "addFormListView" + id,
                        questionType: 'checkbox',
                        question: '',
                        key: type,
                    },
                )
                break;
        }


        listview.items = [];
        listview.items = questions;
    } catch (error) {

    }
}