const Observable = require("tns-core-modules/data/observable").Observable;
const slideTransition = require("~/controllers/slide-transitionController");
const navigation = require("~/controllers/navigationController");
const animation = require("~/controllers/animationController").loadAnimation;
const application = require("tns-core-modules/application");

source = new Observable();
slideIndex = 0
slides = []

application.on(application.launchEvent, (args) => {
    if (args.android) {

    } else if (args.ios !== undefined) {
        // For iOS applications, args.ios is NSDictionary (launchOptions).
        console.log("Launched iOS application with options: " + args.ios);
    }
});
exports.onNavigatedTo = function (args) {
    const page = args.object.page;
    currentTab = page.getViewById("tab0")
    slides = [page.getViewById("homeTab"), page.getViewById("clientsTab"), page.getViewById("scheduleTab"), page.getViewById("profileTab"),]
    //for (let i = 0; i < Object.keys(navigationContext).length; i++) {
    //    source.set(Object.keys(navigationContext)[i], Object.values(navigationContext)[i])
    //}    
}

exports.onPageLoaded = function (args) {
    
    //const container = page.getViewById("tab0");
    //const tabIndex = 0
    //const icon = container.getChildAt(0);
    //const text = container.getChildAt(1);
//
//    //icon.color = 'black'
    //text.color = 'black'
//
//    //slideTransition.goToCustomSlide(args, slideIndex, tabIndex, source, slides).then(function (result) {
    //    slideIndex = result
    //})
    
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
            const evtData = {
                eventName: 'refresh',
                header: 'Beauty-fyi'//Will change this to the title of the brand
            };
            args.object.page.notify(evtData)
            break;
    }
}


