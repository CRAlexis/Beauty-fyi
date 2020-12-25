const navigation = require("~/controllers/navigationController")
const appointmentServiceModal = require("~/dashboard/modals/appointments/viewAppointment/appointment-modal")
const contentPreviewModal = require("~/dashboard/modals/content/preview-content-modal")
const application = require('application');
let appointmentModalActive = false;
let contentPreviewModalActive = false
exports.homeLoaded = function(args){ // am not able to get page object
    const page = args.object.page
    page.bindingContext = source;
    const notifications = [];
    notifications.push(
        {
            clientImage: "~/images/temp.png",
            clientName: "Tiffany",
            service: "Washing hair and style",
            time: "2 hours",
            id: "1"
        },
        {
            clientImage: "~/images/temp.png",
            clientName: "Phoebe",
            service: "Styling and treatment",
            time: "4 hours",
            id: "2"
        },
        {
            clientImage: "~/images/temp.png",
            clientName: "Amie",
            service: "Massage",
            time: "10 hours",
            id: "3"
        },
    )

    var listview = page.getViewById("bookingList");
    listview.items = notifications;
    craeteGrapth(page)
    setTimeout(function () {
        source.set("height", (page.getMeasuredWidth() / 3) - 80)
        loadImages(page)
    }, 500)
}


function craeteGrapth(page){
    //const page = args.object.page
    let data = []
    data.push({
            date: 'March',
            value: 100,
        },
        {
            date: 'April',
            value: 300
        },
        {
            date: 'May',
            value: 150
        },
        {
            date: 'June',
            value: 200
        },
    )
    let data2 = []
    data2.push({
        date: 'March',
        value: 13,
    },
        {
            date: 'April',
            value: 20
        },
        {
            date: 'May',
            value: 16
        },
        {
            date: 'June',
            value: 10
        },
    )

    const chart = page.getViewById("barChart");
    const chart2 = page.getViewById("barChart2");
    chart.items = data
    chart2.items = data2
}

function loadImages(page) { // am not able to get page object
    let images = []
    images.push(
        {
            image: "~/images/temp.png",
            height: source.get("height") + "px",
            index: 1,
            date: "19th November 2020"
        },
        {
            image: "~/images/temp4.png",
            height: source.get("height") + "px",
            index: 2,
            date: "20th November 2020"
        },
        {
            image: "~/images/temp1.png",
            height: source.get("height") + "px",
            index: 3,
            date: "21th November 2020"
        },
    )
    //format photos when uploading
    var listview = page.getViewById("contentList");
    listview.items = images;
}


exports.appointmentTapped = (args) => {
    appointmentServiceModal.openService(args).then((result) => {
        if (application.android) {
            application.android.on(application.AndroidApplication.activityBackPressedEvent, closeModal);
        }
        appointmentModalActive = result
    })
}

exports.viewPreviewContent = (args) => {
    contentPreviewModal.openModal(args).then((result) => {
        if (application.android) {
            application.android.on(application.AndroidApplication.activityBackPressedEvent, closeModal);
        }
        contentPreviewModalActive = result
    })
}

exports.onPageScroll = (args) => {
    closeModal(args)
}

function closeModal(args) {
    args.cancel = true;
    appointmentServiceModal.closeAppointmentModal(args).then((result) => {
        if (application.android) {
            application.android.off(application.AndroidApplication.activityBackPressedEvent, closeModal);
        }
        appointmentModalActive = result
    })
    contentPreviewModal.closeModal(args).then((result) => {
        if (application.android) {
            application.android.off(application.AndroidApplication.activityBackPressedEvent, closeModal);
        }
        contentPreviewModalActive = result
    })
}


exports.pageClicked = (args) => {
    if (appointmentModalActive) {
        appointmentServiceModal.closeAppointmentModal(args).then((result) => {
            if (application.android) {
                application.android.off(application.AndroidApplication.activityBackPressedEvent, closeModal);
            }
            appointmentModalActive = result
        })
    }
    if (contentPreviewModalActive) {
        contentPreviewModal.closeModal(args).then((result) => {
            if (application.android) {
                application.android.off(application.AndroidApplication.activityBackPressedEvent, closeModal);
            }
            contentPreviewModalActive = result
        })
    }
}