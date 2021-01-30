const { goBack } = require("@nativescript/core/ui/frame/frame-common");

exports.load = function(args){
    const includeObject = args.object;
    const page = includeObject.page;
    const header = includeObject.header
    page.getViewById("title").text = header;
    if (includeObject.displayInfo == "true"){
        page.getViewById("infoContainer").visibility = "visible"
    }
    page.on('refresh', (args) => {
        page.getViewById("title").text = args.header;
    })
}

exports.goBack = (args) => {
    const evtData = {
        eventName: 'goBack',
    };
    args.object.page.notify(evtData)
}

exports.info = (args) => {
    const evtData = {
        eventName: 'displayInfo',
    };
    args.object.page.notify(evtData)
}

exports.headerBarClicked = (args) => {
    const evtData = {
        eventName: 'headerBarClicked',
    };
    args.object.page.notify(evtData)
}