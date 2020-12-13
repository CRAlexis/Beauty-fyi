const Observable = require("tns-core-modules/data/observable").Observable;
const navigation = require("~/controllers/navigationController")

const source = new Observable();
let closeCallback;
let servicesTapped = []
let addonsTapped = [];
console.log("is this page getting refreshed or something?")
exports.onShownModally = function (args) {
    initVariables()
    const context = args.context;
    closeCallback = args.closeCallback;
    const page = args.object;
    //page.bindingContext = observableModule.fromObject(context);
    loadServices(page)
}

function initVariables(){
    servicesTapped = []
}

function loadServices(page) {
    var options = [];
    options.push(
        {
            serviceId: 1,
            serviceName: "Wash, Haircut & Rough Dry",
            serviceDuration: "45 minutes",
            servicePrice: "£30",
            addonId: [0, 1, 2, ,3 ,4 ], 
            addonText: ["24 inch hair", "28 inch hair", "32 inch hair", "36 inch hair", "Up to five addons"],
            addonVisibility: ["visible", "visible", "visible", "visible", "visible", ],
        },
        {
            serviceId: 2,
            serviceName: "Wash && Detox",
            serviceDuration: "60 minutes",
            servicePrice: "£70",
            addonId: [0, 1, 2, , 3, 4],
            addonText: ["24 inch hair", "28 inch hair", "32 inch hair", "36 inch hair", "Up to five addons"],
            addonVisibility: ["visible", "visible", "visible", "visible", "visible",],
        },
        {
            serviceId: 3,
            serviceName: "Braid Installation",
            serviceDuration: "20 minutes",
            servicePrice: "£50",
            addonId: [0, 1, 2, , 3, 4],
            addonText: ["24 inch hair", "28 inch hair", "32 inch hair", "36 inch hair", "Up to five addons"],
            addonVisibility: ["visible", "visible", "visible", "visible", "visible",],
        },
        {
            serviceId: 4,
            serviceName: "Hair Cut",
            serviceDuration: "50 minutes",
            servicePrice: "£35",
            addonId: [0, 1, 2, , 3, 4],
            addonText: ["24 inch hair", "28 inch hair", "32 inch hair", "36 inch hair", "Up to five addons"],
            addonVisibility: ["visible", "visible", "visible", "visible", "visible",],
        },
    )

    //format photos when uploading
    var optionRadList = page.getViewById("serviceList");
    optionRadList.items = options;
}

exports.checkAvailibilityOnService = function(args){
    if (servicesTapped.length > 0){
        const page = args.object.page;
        const mainView = args.object;
       
        const context =  {
                servicesTapped: servicesTapped,
                addonsTapped: addonsTapped
            }
        navigation.navigateToModal(context, mainView, 3, true).then(function (result) {
            console.log(result)
        })
    }
}

exports.serviceTapped = function(args){
    const object = args.object;
    const page = object.page
    const serviceId = object.serviceId;
    console.log(object.parent)
    try {
        if (object.getChildAt(1).visibility == "visible") {
            object.getChildAt(1).visibility = "collapsed" //plus
            object.getChildAt(2).visibility = "visible" //tick
            object.parent.getChildAt(3).visibility = "visible" // addons
            servicesTapped.push({
                serviceId: serviceId
            })
        } else {
            object.getChildAt(1).visibility = "visible"
            object.getChildAt(2).visibility = "collapsed"
            setTimeout(function(){
                object.parent.getChildAt(3).visibility = "collapsed"// Just so that page does not jump
            }, 250)
            Object.keys(servicesTapped).forEach(key => {
                if (servicesTapped[key].serviceId == serviceId) {
                    servicesTapped.splice(key, 1)
                }
            });
        }  
    } catch (error) {
        console.log(error)
    }
    const button = page.getViewById("checkAvailabilityButton")
    if (servicesTapped.length > 0){
        button.visibility = "visible"
        animation(button, "fade in").then(function(){
            button.text = "Check Availability (" + servicesTapped.length + ")"
        })
    }else{
        animation(button, "fade out").then(function(){
            button.visibility = "collapsed"
            
        })
    }   
}

exports.addonTapped = function(args){
    setTimeout(function(){
        const addonId = args.object.addonId
        const serviceId = args.object.serviceId
        args.object.checked ? 
            addonsTapped.push({ addonId: addonId, serviceId: serviceId })  : 
            Object.keys(addonsTapped).forEach(key => {
                if (addonsTapped[key].addonId == addonId) {
                    addonsTapped.splice(key, 1)
                }
            });
    }, 250)
}