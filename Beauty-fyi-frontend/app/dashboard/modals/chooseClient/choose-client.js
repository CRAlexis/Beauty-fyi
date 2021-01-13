
const Observable = require("tns-core-modules/data/observable").Observable;
const navigation = require("~/controllers/navigationController")
const slideTransition = require("~/controllers/slide-transitionController");
const {sendHTTP} = require("~/controllers/HTTPControllers/sendHTTP");
source = new Observable();
let closeCallback;

exports.onShownModally = function (args) {
    const context = args.context;
    closeCallback = args.closeCallback;
    const page = args.object;
    page.bindingContext = source
    initChooseClientPage(args)
}

exports.selectClient = (args) => {
    closeCallback(args.object.id)
}

exports.addNewClient = async (args) => {
    const page = args.object.page
    let slides = [page.getViewById("chooseClientSlide"), page.getViewById("addClientSlide")]
    await slideTransition.goToCustomSlide(args, 0, 1, null, slides)
}

exports.createClient = (args) => {
    closeCallback(1)
    const page = args.object.page
    
    const firstName = page.getViewById("firstName").text
    const lastName = page.getViewById("lastName").text
    const emailAddress = page.getViewById("emailAddress").text
    const phoneNumber = page.getViewById("phoneNumber").text // get data

    if (!firstName.length > 3 && !lastName.length > 3 && !emailAddress.length > 6) { // validate data
        //say that information aint filled correctly
        return;
    }

    //const content = JSON.stringify({
    //    firstName: firstName,
    //    lastName: lastName,
    //    emailAddress: emailAddress,
    //    phoneNumber: phoneNumber,
    //})
    //const httpParameters = {
    //    url: 'http://192.168.1.12:3333/login',
    //    method: 'POST',
    //    content: content,
    //}
    //sendHTTP(httpParameters)
    //    .then((response) => {
    //        
    //    }, (e) => {
    //        
    //    })
    // send http request / create client
    // true: closecallback -> then go to book service with client id
    // false: unlucky son
    
}

exports.exit = async (args) => {
    const page = args.object.page
    let slides = [page.getViewById("chooseClientSlide"), page.getViewById("addClientSlide")]
    await slideTransition.goToCustomSlide(args, 1, 0, null, slides)
}

function initChooseClientPage(args) {
    const page = args.object.page
    clients = []
    clients.push(
        {
            clientImage: "~/images/temp.png",
            clientName: "Chiedza Kamabarami",
            id: "1"
        },
        {
            clientImage: "~/images/temp1.png",
            clientName: "Tiffany Alexis",
            id: "2"
        },
    )
    //format photos when uploading
    var listview = page.getViewById("addClientList");
    listview.items = clients;
}