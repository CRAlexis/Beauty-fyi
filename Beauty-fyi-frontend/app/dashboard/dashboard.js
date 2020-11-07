const Observable = require("tns-core-modules/data/observable").Observable;
enums = require("tns-core-modules/ui/enums");
animation = require("~/animations").loadAnimation;
source = new Observable();

function onNavigatedTo(args) {
    page = args.object;
    const navigationContext = page.navigationContext;
    for (let i = 0; i < Object.keys(navigationContext).length; i++) {
        source.set(Object.keys(navigationContext)[i], Object.values(navigationContext)[i])
    }
    page.bindingContext = source;
}
function onLoaded() {
    return true;
}
function onSelectedIndexChanged() {
    return true;
}

function onPageLoaded(args) {
    console.log("Page Loaded!");
    const page = args.object;
    console.log("Page reference from loaded event: ", page);
}

    

exports.onPageLoaded = onPageLoaded;
exports.onLoaded = onLoaded
exports.onSelectedIndexChanged = onSelectedIndexChanged
exports.onNavigatedTo = onNavigatedTo;