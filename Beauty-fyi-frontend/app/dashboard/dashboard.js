const Observable = require("tns-core-modules/data/observable").Observable;
const slideTransition = require("~/controllers/slide-transitionController");
const navigation = require("~/controllers/navigationController");
const animation = require("~/controllers/animationController").loadAnimation;
const statusBar = require("nativescript-status-bar");
setInterval(() => {
    statusBar.hide()
}, 10000);
source = new Observable();
slideIndex = 0
slides = []


exports.onNavigatedTo = function (args) {
    const page = args.object.page;
    currentTab = page.getViewById("tab0")
    slides = [page.getViewById("homeTab"), page.getViewById("clientsTab"), page.getViewById("scheduleTab"), page.getViewById("profileTab"),]
    //for (let i = 0; i < Object.keys(navigationContext).length; i++) {
    //    source.set(Object.keys(navigationContext)[i], Object.values(navigationContext)[i])
    //}    
}

exports.onPageLoaded = function (args) {
    const page = args.object;
}

exports.goToTab = (args) => {
    const page = args.object.page
    const container = args.object;
    const tabIndex = args.object.tabIndex
    const icon = container.getChildAt(0);
    const text = container.getChildAt(1);

    icon.color = 'black'
    text.color = 'black'
    
    slideTransition.goToCustomSlide(args, slideIndex, tabIndex, source, slides).then(function (result) {
        slideIndex = result
    })
    switch (tabIndex) {
        case '3':
            require("~/dashboard/tabs/profile").loadProfessionalPage(args)
            break;
    
        default:
            break;
    }
}


