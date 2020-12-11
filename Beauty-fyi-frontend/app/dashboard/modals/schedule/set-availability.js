const Observable = require("tns-core-modules/data/observable").Observable;
const navigation = require("~/controllers/navigationController")
let source = new Observable();

let closeCallback;
let lastOpenedContainer;

source.set("mondayTimeOne", '09:00')
source.set("mondayTimeTwo", '15:00')

exports.onShownModally = function (args) {
    const context = args.context;
    closeCallback = args.closeCallback;
    const page = args.object;
    page.bindingContext = source
}




exports.goBack = (args) => {
    // Would send http request in here to update the information
}

exports.dayTapped = function(args){
    const object = args.object
    const parentContainer = object.parent.parent.parent;
    const visibilityContainer = parentContainer.getChildAt(2)
    const checkBox = parentContainer.getChildAt(0).getChildAt(0).getChildAt(1);
    // Check if checkbox is ticked

    console.log("checked: " + checkBox.checked)
    setTimeout(function () {
        if (checkBox.checked) {
            if (visibilityContainer.height == 1){
                if (lastOpenedContainer) {
                    animation(lastOpenedContainer, "reduce section down", { height: 1 })
                }
                lastOpenedContainer = visibilityContainer
                animation(visibilityContainer, "expand section down", { height: 230 })
            }  else {
                lastOpenedContainer = null
                animation(visibilityContainer, "reduce section down", { height: 1 })
            }
        }
    }, 100)
}

let functionIsRunningcheckBoxTapped = false
exports.checkBoxTapped = function(args){
    const object = args.object
    const parentContainer = object.parent.parent.parent;
    const visibilityContainer = parentContainer.getChildAt(2)
    const adjacentText = parentContainer.getChildAt(0).getChildAt(0).getChildAt(0).getChildAt(1);
    //Close column if checkbox is no longer ticked
    //Show text if textbox is clicked
    if (!functionIsRunningcheckBoxTapped){
        functionIsRunningcheckBoxTapped = true
        setTimeout(function () {
            if (object.checked) {
                adjacentText.visibility = 'visible'
            } else {
                adjacentText.visibility = 'collapsed'
                if (visibilityContainer.visibility == 'visible') {
                    animation(visibilityContainer, "reduce section down", { height: 1 })
                }
            }
            functionIsRunningcheckBoxTapped = false
        }, 500)    
    }
}

// Time modal
exports.openTimeModal = function (args) {
    const day = args.object.parent.parent.getChildAt(0).day
    const mainView = args.object;

    switch (day) {
        case 'monday':
            const context =  { mondayTimeOne: source.get("mondayTimeOne"), mondayTimeTwo: source.get("mondayTimeTwo") }
            navigation.navigateToModal(context, mainView, 5, false).then(function (result) {
                if (timeOne) { source.set("mondayTimeOne", timeOne) }
                if (timeTwo) { source.set("mondayTimeTwo", timeTwo) }
            })  
            break;
        default:
            break;
    }
}

exports.applyThisToDay = function(args){
    const object = args.object;
    const dayToApplyTo = object.text;
    const parentDay = object.parent.parent.parent.getChildAt(0).day
    object.color = "#9900ff"
}
// Apply these setting to other dates