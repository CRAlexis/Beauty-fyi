const navigation = require("~/controllers/navigationController");
const application = require('application');
const animation = require("~/controllers/animationController").loadAnimation;
let questions = [];
let pageStateChanged;
let i = 0;
exports.onShownModally = function (args) {
    const context = args.context;
    console.log(context)
    closeCallback = args.closeCallback;
    const page = args.object;

    page.getViewById("menuHeader").header = "new title"
    
    if (context.state == "edit"){
        loadDatabaseData(args)
        const evtData = {
            eventName: 'refresh',
            header: 'Edit intake form',
        };
        args.object.page.notify(evtData)
    }else{
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
    if (i == 0){
        args.cancel = true;
        if (application.android) {
            application.android.off(application.AndroidApplication.activityBackPressedEvent, backEvent);
        }
        closeCallback();
    }
    i++
}

exports.saveForm = async (args) => {
    const page = args.object.page
    page.getViewById("saveAsModal").visibility = 'visible'
    await animation(page.getViewById("pageContainer"), "fade out", { opacity: 0.2 })
    await animation(page.getViewById("saveAsModal"), 'fade in');
}

exports.saveFormFinal = async (args) => {
    const object = args.object
    let alertObject;
    
    let text = object.parent.getChildAt(1).text;
    if (!text) {//check the name
        //alert - please write a name
        return
    }
    //send http request
   
    
    //success
    //close the page
    //else
    //Unable to save try again later -> We will try again later ( maybe try and save in mobile phone database)
    

}

exports.pageClicked = async (args) => {
    const page = args.object.page
    if (page.getViewById("saveAsModal").visibility == 'visible'){
        await animation(page.getViewById("pageContainer"), "fade in")
        await animation(page.getViewById("saveAsModal"), 'fade out');
        page.getViewById("saveAsModal").visibility = 'collapsed'
    }
}

exports.addQuestion = (args) => {
    const mainView = args.object;
    let context = mainView.optionContext.split(",")

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

function loadDatabaseData(args){
    //http request
}

function createQuestion(args, type) {
    const page = args.object.page
    var listview = page.getViewById("addFormListView")
    let id = 1
    try { id = listview.items.length + 1 } catch (error) { }

    questions = []
    try {
        listview.items.forEach(element => {
            questions.push({
                index: element.index,
                id: element.id,
                id2: element.id2,
                questionType: element.questionType,
                text: page.getViewById(element.id).text,
                textViewText: page.getViewById(element.id2).text,
                visibilityDropDown: element.visibilityDropDown
            })
        });

    } catch (error) { }


    switch (type) {
        case 1:
            questions.push(
                {
                    index: id,
                    id: "addFormListView" + id,
                    id2: "addFormListView2" + id,
                    questionType: 'textbox',
                    text: '',
                    textViewText: '',
                    visibilityDropDown: 'collapsed'
                },
            )
            break;
        case 2:
            questions.push(
                {
                    index: id,
                    id: "addFormListView" + id,
                    id2: "addFormListView2" + id,
                    questionType: 'dropdown',
                    text: '',
                    textViewText: '',
                    visibilityDropDown: 'visible'
                },
            )
            break;
        case 3:
            questions.push(
                {
                    index: id,
                    id: "addFormListView" + id,
                    id2: "addFormListView2" + id,
                    questionType: 'checkbox',
                    text: '',
                    textViewText: '',
                    visibilityDropDown: 'collapsed'
                },
            )
            break;
        default:
            break;
    }

    try {
        listview.items = [];
        listview.items = questions;
    } catch (error) {

    }
}