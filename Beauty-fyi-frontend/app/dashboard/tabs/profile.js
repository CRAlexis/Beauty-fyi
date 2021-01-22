const Observable = require("tns-core-modules/data/observable").Observable;
const animation = require("~/controllers/animationController").loadAnimation
const slideTransition = require("~/controllers/slide-transitionController");
const { SecureStorage } = require("nativescript-secure-storage");
var secureStorage = new SecureStorage();
const navigation = require("~/controllers/navigationController")
const previewServiceModal = require("~/dashboard/modals/salonPage/previewService/preview-service-modal")
const application = require('application');
const { sendHTTP, sendHTTPFile, getHttpFile } = require("~/controllers/HTTPControllers/sendHTTP");
source = new Observable();
let currentlyNavigating = false;
let serviceModalActive = false
let previewServiceContentArray = []
const serviceListView = [];
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
    const object = args.object
    const serviceIndex = object.serviceIndex
    previewServiceModal.openService(args, serviceIndex, previewServiceContentArray, source).then((result) => {
        if (application.android) {
            application.android.on(application.AndroidApplication.activityBackPressedEvent, closeServiceModal);
        }
        serviceModalActive = result
    })
}


function closeServiceModal(args) {
    args.cancel = true;
    previewServiceModal.closeServiceModal(args).then((result) => {
        serviceModalActive = result
    })
}


exports.pageClicked = (args) => {
    if (serviceModalActive) {
        previewServiceModal.closeServiceModal(args).then((result) => {
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
            loadAboutMe(args)
            if (!currentlyScrolled) {
                animation(page.getViewById("profileTopSection"), "expand section down", { height: '00px' }).then(function () {
                    animation(page.getViewById("profileTopSection"), "fade out")
                })
                slideTransition.goToCustomSlide(args, 0, 1, null, slides)
            } else {
                slideTransition.goToCustomSlide(args, 0, 1, null, slides)
            }
            break;
    }
}

async function loadservices(args, height, row = 1) {
    const page = args.object.page

    let sendRequests = true
    console.log("row number: " + row)
    console.log("sending Request")
    const httpParameters = {
        url: 'servicegetdata',
        method: 'POST',
        content: {
            userID: await secureStorage.get({ key: "userID" }),
            row: row
        },
    }
    let serviceData;

    sendHTTP(httpParameters).then((result) => {
        let processedImages = 0
        sendRequests = result.JSON.continueRequests
        serviceData = result.JSON.service
        serviceData.forEach(async element => {
            previewServiceContentArray.push(element)
            let image = await getServiceImage(element.id)
            serviceListView.push({
                serviceIndex: element.id,
                serviceImage: image,
                serviceName: element.name,
                height: height + "px"
            })
            var listview = page.getViewById("profileServicesList");
            listview.items = []
            listview.items = serviceListView;
            processedImages++
            //console.log("procossed " + processedImages + " out of " + serviceData.length)
            if (processedImages == serviceData.length) {
                if (sendRequests) {
                    //console.log("Time to loop")
                    row++
                    //console.log("next row will be: " + row)
                    loadservices(args, height, row)
                }
            }
        })
    })
}

function getServiceImage(id) {
    return new Promise((resolve, reject) => {
        const httpParametersImages = {
            url: 'servicegetimage',
            method: 'POST',
            content: { serviceID: id, index: 0 },
        }
        getHttpFile(httpParametersImages, { display: false }, { display: false }, { display: false }).then((result) => {
            resolve(result ? result._path : "defaultServiceImage.png")
        }, (e) => {
            console.log("e" + e)
        })
    })
}

function loadAboutMe(args) {
    loadBio(args)
    loadOpeningHours(args)
    loadAdvancedBookings(args)
}
async function loadBio(args) {
    const page = args.object.page
    const httpParameters = {
        url: 'bioget', method: 'POST', content: { userID: await secureStorage.get({ key: "userID" }) }
    }
    sendHTTP(httpParameters, { display: false }, { display: false }, { display: false })
        .then((response) => {
            if (response.JSON.status == "success") {
                page.getViewById("profileBio").text = response.JSON.bio
            } else {
                page.getViewById("profileBio").text = "This stylist has no bio."
            }
        }, (e) => {
            console.log(e)
        })
}

async function loadOpeningHours(args) {
    const page = args.object.page
    const hoursListView = [];
    const httpParameters = {
        url: 'setavailabilityget', method: 'POST', content: { userID: await secureStorage.get({ key: "userID" }) }
    }
    sendHTTP(httpParameters, { display: false }, { display: false }, { display: false })
        .then((response) => {
            if (response.JSON.status == "success") {
                response.JSON.schedule.forEach(element => {
                    const day = element.day
                        hoursListView.push(
                            {
                                day: capitalizeFirstLetter(day),
                                hours: !!parseInt(element.active) ? element.start_time.slice(0, -3) + " - " + element.end_time.slice(0, -3)  : 'CLOSED'
                            }
                        )

                })
                source.set("openingHoursList", hoursListView)
                page.getViewById("openingHoursList").refresh()
            } else {
                hoursListView.push(
                    {
                        day: '',
                        hours: 'Unable to get scehdule for this stylist.'
                    })
                source.set("openingHoursList", hoursListView)
                page.getViewById("openingHoursList").refresh()
            }
        }, (e) => {
            hoursListView.push(
                {
                    day: '',
                    hours: 'Unable to get scehdule for this stylist.'
                })
                source.set("openingHoursList", hoursListView)
                page.getViewById("openingHoursList").refresh()
        })
}

async function loadAdvancedBookings(args) {
    const page = args.object.page
    const httpParameters = {
        url: 'schedulelimitget',
        method: 'POST',
        content: { userID: await secureStorage.get({ key: "userID" })},
    }
    sendHTTP(httpParameters, { display: false }, { display: false }, { display: false }).then((response) => {
        if (response.JSON.status == "success") {
            let data = response.JSON.scheduleLimits
            page.getViewById("maximumDaysInAdvance").text = "I take bookings for the next " + data.maximumDaysInAdvance + " days"
            let cancelRescheduleString = "I allow clients to ";
            if (data.rescheduleAppointments){
                cancelRescheduleString += "reschedule "
                if (data.cancelAppointments) { cancelRescheduleString += "and cancel " }
            }else{
                if (data.cancelAppointments) { cancelRescheduleString += " cancel " }
            }
            cancelRescheduleString += "appointments " + data.maximumHoursForReschedule + " hours' in advance";
            page.getViewById("cancelReschedule").text = cancelRescheduleString
        } else { console.log("Unable to get schedule for this user") }
    }, (e) => { console.log(e) })
}



function loadReviews(args) {
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

    if (args.scrollOffset > 150 && currentlyScrolled == false) {
        currentlyScrolled = true;
        scrolledRecently = true
        const page = args.object.page
        await animation(page.getViewById("profileTopSection"), "expand section down", { height: '0px' })
        await animation(page.getViewById("profileTopSection"), "fade out")
        page.getViewById("profileTopSection").visibility = 'collapsed'
        setTimeout(function () { scrolledRecently = false }, 1000)
    }
}

exports.onScrollEnded = async (args) => {
    //closeServiceModal(args)
    if (args.scrollOffset < 10 && currentlyScrolled == true && scrolledRecently == false) {
        const page = args.object.page
        await animation(page.getViewById("profileTopSection"), "expand section down", { height: '240' })
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

exports.setSchedule = (args) => {
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

exports.setSchedulingLimits = (args) => {
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

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}