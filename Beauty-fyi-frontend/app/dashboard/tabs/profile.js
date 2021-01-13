const Observable = require("tns-core-modules/data/observable").Observable;
const animation = require("~/controllers/animationController").loadAnimation
const slideTransition = require("~/controllers/slide-transitionController");
const navigation = require("~/controllers/navigationController")
const previewServiceModal = require("~/dashboard/modals/salonPage/previewService/preview-service-modal")
const application = require('application');
source = new Observable();
let currentlyNavigating = false;
let serviceModalActive = false
exports.profilePageLoaded = (args) => {
    
    const page = args.object.page
    source.set("page", page)
    
    setTimeout(function () {
        const height = (page.getMeasuredWidth() / 3)
        loadservices(args, height)
        loadBio(args)
        loadReviews(args)
    }, 500)
}

exports.loadProfessionalPage = (args) => {
    const evtData = {
        eventName: 'refresh',
        header: 'Curly By Nature'//Will change this to the title of the brand
    };
    args.object.page.notify(evtData)

}

exports.serviceTapped = (args) => {
    previewServiceModal.openService(args).then((result) =>{
        if (application.android) {
            application.android.on(application.AndroidApplication.activityBackPressedEvent, closeServiceModal);
        }
        serviceModalActive = result
    })
}


function closeServiceModal(args){
    console.log("here")
    args.cancel = true;
    previewServiceModal.closeServiceModal(args).then((result) => {
        serviceModalActive = result
    })
}


exports.pageClicked = (args) => {
    if (serviceModalActive){
        previewServiceModal.closeServiceModal(args).then((result)=> {
            if (application.android) {
                application.android.off(application.AndroidApplication.activityBackPressedEvent, closeServiceModal);
            }
            serviceModalActive = result
        })
    }   
}

exports.selectedIndexChangeInformation = async (args) => {
    
    const page = args.object.page
    const selectedIndex = args.object.selectedIndex;
    const slides = [page.getViewById("myServicesId"), page.getViewById("aboutMeId")]
    switch (parseInt(selectedIndex)) {
        case 0:
            await animation(page.getViewById("profileTopSection"), "expand section down", { height: '240' })
            await animation(page.getViewById("profileTopSection"), "fade in")
            slideTransition.goToCustomSlide(args, 1, 0, null, slides)
            page.getViewById("profileServicesList").scrollToIndex(0, true)
            break;
        case 1:
            closeServiceModal(args)
            if (!currentlyScrolled){
                animation(page.getViewById("profileTopSection"), "expand section down", { height: '00px' }).then(function () {
                    animation(page.getViewById("profileTopSection"), "fade out")
                })
                slideTransition.goToCustomSlide(args, 0, 1, null, slides)
            }else{
                slideTransition.goToCustomSlide(args, 0, 1, null, slides)
            }  
            break;
    }
}

function loadBio(args) {
    const page = args.object.page
    const hoursListView = [];
    hoursListView.push(
        {
            day: 'Monday',
            hours: 'CLOSED'
        },
        {
            day: 'Tuesday',
            hours: '10:00 - 17:30'
        },
        {
            day: 'Wednesday',
            hours: '10:00 - 16:30'
        },
        {
            day: 'Thursday',
            hours: '11:00 - 12:30'
        },
        {
            day: 'Friday',
            hours: '10:00 - 19:00'
        },
        {
            day: 'Saturday',
            hours: '12:00 - 17:30'
        },
        {
            day: 'Sunday',
            hours: 'CLOSED'
        },
    )
    source.set("openingHoursList", hoursListView)
    //var listview = page.getViewById("openingHoursList");
    //listview.items = serviceListView;
}

function loadservices(args, height) {
    const page = args.object.page
    const serviceListView = [];
    serviceListView.push(
        {
            serviceIndex: 0,
            serviceImage: '~/images/temp4.png',
            serviceName: 'Braided Ponytail/Bun',
            height: height + "px"
        },
        {
            serviceIndex: 0,
            serviceImage: '~/images/temp3.png',
            serviceName: 'Crochet Box Braids',
            height: height + "px"
        },
        {
            serviceIndex: 1,
            serviceImage: '~/images/temp7.png',
            serviceName: 'Scalp Detox',
            height: height + "px"
        },
        {
            serviceIndex: 0,
            serviceImage: '~/images/temp4.png',
            serviceName: 'Braided Ponytail/Bun',
            height: height + "px"
        },
        {
            serviceIndex: 0,
            serviceImage: '~/images/temp3.png',
            serviceName: 'Crochet Box Braids',
            height: height + "px"
        },
        {
            serviceIndex: 1,
            serviceImage: '~/images/temp7.png',
            serviceName: 'Scalp Detox',
            height: height + "px"
        },
        {
            serviceIndex: 0,
            serviceImage: '~/images/temp4.png',
            serviceName: 'Braided Ponytail/Bun',
            height: height + "px"
        },
        {
            serviceIndex: 0,
            serviceImage: '~/images/temp3.png',
            serviceName: 'Crochet Box Braids',
            height: height + "px"
        },
        {
            serviceIndex: 1,
            serviceImage: '~/images/temp7.png',
            serviceName: 'Scalp Detox',
            height: height + "px"
        },
        {
            serviceIndex: 0,
            serviceImage: '~/images/temp4.png',
            serviceName: 'Braided Ponytail/Bun',
            height: height + "px"
        },
        {
            serviceIndex: 0,
            serviceImage: '~/images/temp3.png',
            serviceName: 'Crochet Box Braids',
            height: height + "px"
        },
        {
            serviceIndex: 1,
            serviceImage: '~/images/temp7.png',
            serviceName: 'Scalp Detox',
            height: height + "px"
        },
        {
            serviceIndex: 0,
            serviceImage: '~/images/temp4.png',
            serviceName: 'Braided Ponytail/Bun',
            height: height + "px"
        },
        {
            serviceIndex: 0,
            serviceImage: '~/images/temp3.png',
            serviceName: 'Crochet Box Braids',
            height: height + "px"
        },
        {
            serviceIndex: 1,
            serviceImage: '~/images/temp7.png',
            serviceName: 'Scalp Detox',
            height: height + "px"
        },
    )
        
    var listview = page.getViewById("profileServicesList");
    listview.items = serviceListView;
}

function loadReviews(args){
    const page = args.object.page
    const userReviews = [];
    userReviews.push(
        {
            userImage: '~/images/temp.png',
            userName: 'Tiffany Alexis',
            reviewDate: '29 September 2020',
            reviewService: 'Braided Ponytail/Bun',
            starOne: true,
            starTwo: true,
            starThree: true,
            starFour: true,
            starFive: true,
            userReview: 'This is a great service, very kind workers. Would totally book again!',
        },
        {
            userImage: '~/images/temp3.png',
            userName: 'Naomi Jackson',
            reviewDate: '23 September 2020',
            reviewService: 'Scalp Detox',
            starOne: true,
            starTwo: true,
            starThree: true,
            starFour: true,
            starFive: false,
            userReview: 'Great service, just wish they would play some other type of music...',
        },
    )
    source.set("userReviews", userReviews)
    //var listview = page.getViewById("userReviews");
    //listview.items = userReviews;
}

let currentlyScrolled = false;
let scrolledRecently = false;
exports.onScrolled = async (args) => {

    if (args.scrollOffset > 150 && currentlyScrolled == false){
        currentlyScrolled = true;
        scrolledRecently = true
        const page = args.object.page
        await animation(page.getViewById("profileTopSection"), "expand section down", { height: '0px' })
        await animation(page.getViewById("profileTopSection"), "fade out")
        page.getViewById("profileTopSection").visibility = 'collapsed'
        setTimeout(function(){ scrolledRecently = false}, 1000)
    }
}

exports.onScrollEnded = async (args) => {
    //closeServiceModal(args)
    if (args.scrollOffset < 10 && currentlyScrolled == true && scrolledRecently == false){
        const page = args.object.page
        await animation(page.getViewById("profileTopSection"), "expand section down", { height: '240'})
        page.getViewById("profileTopSection").visibility = 'visible'
        await animation(page.getViewById("profileTopSection"), "fade in")
        
        currentlyScrolled = false;
    }
}


exports.goToAccountDetails = (args) => {
    closeServiceModal(args)
    if (!currentlyNavigating) {
        currentlyNavigating = true
        const mainView = args.object;
        const context = ""
        animation(args.object.getChildAt(0), "nudge up").then(function () {
            navigation.navigateToModal(context, mainView, 15, true).then(function (result) {
                currentlyNavigating = false
            })
        })
    }
}

exports.goToMyBio = (args) => {
    closeServiceModal(args)
    if (!currentlyNavigating) {
        currentlyNavigating = true
        const mainView = args.object;
        const context = ""
        animation(args.object.getChildAt(0), "nudge up").then(function () {
            navigation.navigateToModal(context, mainView, 16, true).then(function (result) {
                currentlyNavigating = false
            })
        })
    }
}

exports.setSchedule =(args) =>{
    closeServiceModal(args)
    if (!currentlyNavigating) {
        currentlyNavigating = true
        const mainView = args.object;
        const context = ""
        animation(args.object.getChildAt(0), "nudge up").then(function () {
            navigation.navigateToModal(context, mainView, 10, true).then(function (result) {
                currentlyNavigating = false
            })
        })
    }
}

exports.setSchedulingLimits =(args) =>{
    closeServiceModal(args)
    if (!currentlyNavigating) {
        currentlyNavigating = true
        const mainView = args.object;
        const context = ""
        animation(args.object.getChildAt(0), "nudge up").then(function () {
            navigation.navigateToModal(context, mainView, 9, true).then(function (result) {
                currentlyNavigating = false
            })
        })
    }
}