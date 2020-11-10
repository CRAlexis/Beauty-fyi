const Observable = require("tns-core-modules/data/observable").Observable;
enums = require("tns-core-modules/ui/enums");
animation = require("~/animations").loadAnimation;
navigation = require("~/navigation/navigation")
source = new Observable();

exports.onNavigatedTo = function (args) {
    page = args.object;
    //const navigationContext = page.navigationContext;
    //for (let i = 0; i < Object.keys(navigationContext).length; i++) {
    //    source.set(Object.keys(navigationContext)[i], Object.values(navigationContext)[i])
    //}
    const loadNotifications = require("~/dashboard/tabs/home")
    loadNotifications.loadNotifications(page);
    console.log("page: " + page)
    
}
exports.onLoaded = function() {
    return true;
}
exports.onSelectedIndexChanged = function () {
    return true;
}

exports.onPageLoaded = function (args) {
    //console.log("Page Loaded!");
    const page = args.object;
    //console.log("Page reference from loaded event: ", page);
    
   
}