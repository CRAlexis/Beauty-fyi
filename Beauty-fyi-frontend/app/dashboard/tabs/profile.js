const animation = require("~/controllers/animationController").loadAnimation
const slideTransition = require("~/controllers/slide-transitionController");
const navigation = require("~/controllers/navigationController")
exports.profilePageLoaded = (args) => {
    const page = args.object.page
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

exports.selectedIndexChangeInformation = (args) => {
    const page = args.object.page
    const selectedIndex = args.object.selectedIndex;
    const slides = [page.getViewById("myServicesId"), page.getViewById("aboutMeId")]
    switch (parseInt(selectedIndex)) {
        case 0:
            slideTransition.goToCustomSlide(args, 1, 0, null, slides).then(function (result) {
                
            })
            break;
        case 1:
            slideTransition.goToCustomSlide(args, 0, 1, null, slides).then(function (result) {

            })
            break;
    }
}

function loadBio(args) {
    const page = args.object.page
    const serviceListView = [];
    serviceListView.push(
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
    var listview = page.getViewById("openingHoursList");
    listview.items = serviceListView;
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
    var listview = page.getViewById("userReviews");
    listview.items = userReviews;
}