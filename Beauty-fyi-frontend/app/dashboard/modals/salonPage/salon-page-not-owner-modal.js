const Observable = require("tns-core-modules/data/observable").Observable;
const bookServiceController = "~/dashboard/modals/salonPage/bookService/book-service-controller";

const source = new Observable();
let closeCallback;
let servicesTapped = []

exports.onShownModally = function (args) {
    const context = args.context;
    closeCallback = args.closeCallback;
    const page = args.object;
    //page.bindingContext = observableModule.fromObject(context);
    loadServices(page)
}

function loadServices(page) {
    var options = [];
    options.push(
        {
            serviceId: 1,
            serviceName: "Wash, Haircut & Rough Dry",
            serviceDuration: "45 minutes",
            servicePrice: "£30"
        },
        {
            serviceId: 2,
            serviceName: "Wash && Detox",
            serviceDuration: "60 minutes",
            servicePrice: "£70"
        },
        {
            serviceId: 3,
            serviceName: "Braid Installation",
            serviceDuration: "20 minutes",
            servicePrice: "£50"
        },
        {
            serviceId: 4,
            serviceName: "Hair Cut",
            serviceDuration: "50 minutes",
            servicePrice: "£35"
        },
    )

    //format photos when uploading
    var optionRadList = page.getViewById("serviceList");
    optionRadList.items = options;
}

exports.checkAvailibilityOnService = function(args){
    console.log("here")
    const page = args.object.page;
    const mainView = args.object;
    const option = {
        // Gona need to send a http request to JJ to get client information
        context: {
            
        },
        closeCallback: () => {
            // Receive data from the modal view. e.g. username & password
            //alert(`Username: ${username} : Password: ${password}`);
        },
        fullscreen: true
    };
    mainView.showModal(bookServiceController, option);
}

exports.serviceTapped = function(args){
    const object = args.object;
    const serviceId = object.serviceId;
    try {
        if (object.getChildAt(1).visibility == "visible") {
            object.getChildAt(1).visibility = "collapsed"
            object.getChildAt(2).visibility = "visible"
            servicesTapped.push({
                serviceId: serviceId
            })
        } else {
            object.getChildAt(1).visibility = "visible"
            object.getChildAt(2).visibility = "collapsed"
            Object.keys(servicesTapped).forEach(key => {
                if (servicesTapped[key].serviceId == serviceId) {
                    servicesTapped.splice(key, 1)
                }
            });
        }  
    } catch (error) {
        console.log(error)
    }
}