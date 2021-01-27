const Observable = require("tns-core-modules/data/observable").Observable;
const clientGalleryModal = "~/dashboard/modals/clientTab/client-gallery-modal";
const navigation = require("~/controllers/navigationController")
const animation = require("~/controllers/animationController").loadAnimation
const { sendHTTP, getHttpFile } = require("~/controllers/HTTPControllers/sendHTTP");
const source = new Observable();
source.set("selectedIndex", 0)
source.set("editHairType", false)
source.set("hairTypeContainerVisbility", true)
source.set("hairCareContainerVisbility", false)
source.set("pastAppointmentsContainerVisbility", true)
source.set("futuretAppointmentsContainerVisbility", true)
const hairTypeContainerHeight = '620px'
const hairPreferenceContainerHeight = '533px'
const hairCareContainerHeight = '520px'
source.set("hairType", "")

var services = [];

exports.onShownModally = function (args) {
    const context = args.context;
    const clientID = context.clientID
    closeCallback = args.closeCallback;
    const page = args.object;
    page.bindingContext = source
    getPageData(args, clientID)
    getThumbnail(args, clientID)
}

function getPageData(args, clientID){
    const page = args.object.page
    const httpParameters = { url: 'clientget', method: 'POST', content: { clientID: clientID }, }
    sendHTTP(httpParameters, { display: false }, { display: false }, { display: false })
        .then((response) => {
            console.log(response.JSON.client[0])
            let client = response.JSON.client[0]
            if (response.JSON.status == "success") {
                if (client.lastName.includes("unknown_")) {
                    source.set("clientName", client.firstName)
                } else {
                    source.set("clientName", client.firstName + " " + client.lastName)
                }
                const evtData = {
                    eventName: 'refresh',
                    header: source.get("clientName")
                };
                page.notify(evtData)
            } else {
                console.log("This user does not exsists or you are not allowed to get this user's details")
            }
        }, (e) => {
            console.log(e)
        })
}

function getThumbnail(args, clientID){
    const page = args.object.page
    const httpParametersImages = {
        url: 'clientgetimage',
        method: 'POST',
        content: { clientID: clientID },
    }
    getHttpFile(httpParametersImages, { display: false }, { display: false }, { display: false }).then((result) => {
        console.log("Got client thumbnail")
        page.getViewById("clientThumbnail").src = result._path
    }, (e) => {
        console.log("must be a http error if we are in here")
    })
}

exports.onPageLoaded = function (args) {
    setTimeout(()=>{
        const page = args.object.page; //edited
        let height = page.getMeasuredWidth() / 4
        loadImages(height, page)
        loadAppointments(page)
    }, 1000)
    
}

function loadImages(height, page) {
    let images = []
    images.push(
        {
            contentImage: "~/images/temp.png",
            contentId: "contentImage0",
            height: height + "px",
            isImage: true
        },
        {
            contentImage: "~/images/temp2.png",
            contentId: "contentImage1",
            height: height + "px",
            isImage: true
        },
        {
            contentImage: "~/images/temp3.png",
            contentId: "contentImage2",
            height: height + "px",
            isImage: true
        },
        {
            contentImage: "~/images/temp4.png",
            contentId: "contentImage3",
            height: height + "px",
            isImage: true
        },
        {
            contentImage: "~/images/temp7.png",
            contentId: "contentImage4",
            height: height + "px",
            isImage: true
        },
        {
            contentImage: "~/images/temp8.png",
            contentSource: "~/videos/temp.mp4",
            contentId: "contentImage5",
            height: height + "px",
            isImage: false
        },
        {
            contentImage: "~/images/temp9.png",

            contentId: "contentImage6",
            height: height + "px",
            isImage: true
        },
        {
            contentImage: "~/images/temp10.png",
            contentId: "contentImage7",
            height: height + "px",
            isImage: true
        },
    )
    //format photos when uploading
    const listView = page.getViewById("clientGalleryList");
    listView.items = images;
}

function loadAppointments(page) { // am not able to get page object
    services.push(
        {
            serviceDate: "19.10.2020",
            serviceName: "Wash and styling",
        },
        {
            serviceDate: "25.10.2020",
            serviceName: "Relax and perm",
        },
        {
            serviceDate: "29.10.2020",
            serviceName: "Colouring and wash",
        }
    )
    //format photos when uploading
    var listview = page.getViewById("pastClientAppointmentsFromProView");
    listview.items = services;
    var listview = page.getViewById("futureClientAppointmentsFromProView");
    listview.items = services;
    
}
exports.goBack = (args) => {
    closeCallback("client profile closed");
}


source.set("openClientGallery", function (args){
    const mainView = args.object;
    const context =  {
            
        }
    navigation.navigateToModal(context, mainView, 20, true).then(function (result) {
        console.log(result)
    })
})

source.set("bookClient", function (args) {
    const context =  {
        test: "test",
    }
    navigation.navigateToModal(context, mainView, 3, true).then(function (result) {
        console.log(result)
    })
})

source.set("editClientInformation", function (args) {
    const id =  args.object.id
    var optionContext = [];
    
    //This will need to go into the component itself
    switch (id) {
        case "hairType0":
            optionContext = ['Locked', 'Kinky', 'Coily', 'Curly', 'Wavy', 'Straight'];
            break;
        case "hairType1":
            optionContext = ['Coarse', 'Medium', 'Fine'];
            break;
        case "hairType2":
            optionContext = ['Dense', 'Medium', 'Sparse'];
            break;
        case "hairType3":
            optionContext = ['Waist', 'Armpit', 'Shoulder', 'Chin', 'Ear'];
            break;
        case "hairType4":
            optionContext = ['Bleached', 'Coloured', 'Henna', 'Natural'];
            break;
        case "hairType5":
            optionContext = ['Very Oily', 'Oily', 'balanced', 'little  oil', 'Little to no oil'];
            break;
        case "hairType6":
            optionContext = ['Retains moisture well', 'medium', 'Loses moisture quickly'];
            break;
        case "hairPreference0":
            optionContext = ['Locked', 'Free flow (Natural)', 'Protective Style (free flow)', 'Ext/wigs', 'Relaxed'];
            break;
        case "hairPreference1":
            optionContext = ['Free form locs', 'micro locs', 'Free flow/Wash + Go', 'Sleek', 'Bun/Bantu knots', 'twists/braids/fauxlocs' , 'extensions/wigs'];
            break;
        case "hairPreference2":
            optionContext = ['Straighteners', 'Blow Dryer', 'Extensions', 'Wigs'];
            break;
        case "hairCare0":
            optionContext = ['Locked', 'Free flow (Natural)', 'Protective Style (free flow)', 'Ext/wigs', 'Relaxed'];
            break;
        case "hairCare1":
            optionContext = ['Free form locs', 'micro locs', 'Free flow/Wash + Go', 'Sleek', 'Bun/Bantu knots', 'twists/braids/fauxlocs', 'extensions/wigs'];
            break;
        case "hairCare2":
            optionContext = ['Straighteners', 'Blow Dryer', 'Extensions', 'Wigs'];
            break;
        default:
            break;
    }

    const mainView = args.object;
    const context = {
            id : id,
            optionContext
        }
    navigation.navigateToModal(context, mainView, 4, true).then(function (result) {
        console.log(result)
    })
})


source.set("selectedIndexChangeInformation", async function (args){
    const selectedIndex = args.object.selectedIndex;
    console.log("switching")
    try {
        switch (parseInt(selectedIndex)) {
            case 0:
                resizeContainer(0, args).then(function () {
                    source.set("hairTypeContainerVisbility", true)
                    source.set("hairCareContainerVisbility", false)
                })
                break;
            case 1:
                resizeContainer(1, args).then(function () {
                    source.set("hairTypeContainerVisbility", false)
                    source.set("hairCareContainerVisbility", true)
                })
                break;
        }
    } catch (error) {
        console.log(error)
    }
    
});

source.set("selectedIndexChangeAppointments", async function (args) {
    const selectedIndex = args.object.selectedIndex;
    switch (parseInt(selectedIndex)) {
        case 0:
            source.set("pastAppointmentsContainerVisbility", true)
            source.set("futureAppointmentsContainerVisbility", false)
            break;
        case 1:
            source.set("pastAppointmentsContainerVisbility", false)
            source.set("futureAppointmentsContainerVisbility", true)
            break;
        }
});

async function resizeContainer(index, args){
    return new Promise(resolve => {
        const page = args.object.page
        const clientInfoSection = page.getViewById("clientInfoSection");
        let height;
        switch (index) {
            case 0:
                height = hairTypeContainerHeight
                break;
            case 1:
                height = hairCareContainerHeight
                break;
            default:
                break;
        }
        animation(clientInfoSection, "expand section down", {height: height}).then(function(){
            resolve();
        })
    })
}


