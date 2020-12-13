const Observable = require("tns-core-modules/data/observable").Observable;
const clientGalleryModal = "~/dashboard/modals/clientTab/client-gallery-modal";
const navigation = require("~/controllers/navigationController")

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
    closeCallback = args.closeCallback;
    const page = args.object;
    //page.bindingContext = observableModule.fromObject(context); For context information
    page.bindingContext = source
    
    

    //hairTypeRadList = {
    //    hairPattern: "Locked",
    //    hairThickness: "Coarse",
    //    hairDensity: "Dense",
    //    hairLength: "Waist",
    //    hairColor: "Bleached",
    //    hairSebum: "Very Oily",
    //    hairPorosity: "Retains moisture well"
    //};
//
    //source.set("hairTypeRadList", hairTypeRadList);
}

exports.onPageLoaded = function (args) {
    const page = args.object.page; //edited
    page.bindingContext = source
    setTimeout(function () {
        source.set("height", (page.getMeasuredWidth() / 3))
        loadImages(page)
        loadAppointments(page)
        const clientInfoSection = page.getViewById("clientInfoSection");
        console.log(clientInfoSection.getMeasuredHeight())
    }, 1000)
    
}

function loadImages(page) {
    let images = []
    images.push(
        {
            image: "~/images/temp.png",
            height: source.get("height") + "px",
            index: 1,
            date: "19th November 2020"
        },
        {
            image: "~/images/temp5.png",
            height: source.get("height") + "px",
            index: 2,
            date: "20th November 2020"
        },
        {
            image: "~/images/temp6.png",
            height: source.get("height") + "px",
            index: 3,
            date: "21th November 2020"
        },
    )
    //format photos when uploading
    var listview = page.getViewById("clientGalleryList");
    listview.items = images;
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
    closeCallback();
}


source.set("openClientGallery", function (args){
    const mainView = args.object;
    const context =  {
            
        }
    navigation.navigateToModal(context, mainView, 2, true).then(function (result) {
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
    switch (parseInt(selectedIndex)) {
        case 0:
            resizeContainer(0, args).then(function(){
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


