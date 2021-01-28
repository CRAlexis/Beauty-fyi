const navigation = require("~/controllers/navigationController");
const animation = require("~/controllers/animationController").loadAnimation;
let transitioning = false
exports.load = function(args){
    const includeObject = args.object;
    const page = includeObject.page;
    const header = includeObject.header
    

    page.on('refresh', (args) => {
        console.log(args)
        page.getViewById("title").text = args.header;
    })
}

exports.goToSettings = function (args) {
    if (!transitioning){
        transitioning = true
        const mainView = args.object;
        const context = ""

        animation(args.object, "nudge up").then(function () {
            navigation.navigateToModal(context, mainView, 13, true).then(function (result) {
                transitioning = false
            })
        })
    }
    
}

exports.goToMessages = (args) => {
    const mainView = args.object;
    const context = ""

    animation(args.object, "nudge up").then(function () {
        navigation.navigateToModal(context, mainView, 23, true).then(function (result) {
            console.log(result)
        })
    })
}

exports.headerBarClicked = (args) => {
    const evtData = {
        eventName: 'headerBarClicked',
    };
    args.object.page.notify(evtData)
}