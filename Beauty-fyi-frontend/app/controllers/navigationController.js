exports.navigateToDashboard =  function (response, page) {
    const navEntryWithContext = {
        moduleName: "~/dashboard/dashboard",
        clearHistory: true,
        context: {
            name: "John",
            age: 25,
            isProgramer: true
        },
    };
    page.frame.navigate(navEntryWithContext);
}
exports.navigateToLandingPage = function (page) {
    const navEntryWithContext = {
        moduleName: "~auth/landing/landing-page",
        clearHistory: false,
    };
    page.frame.navigate(navEntryWithContext);
}

exports.navigateToSignInPage = function (context, page){
    const navEntryWithContext = {
        moduleName: "~/auth/sign-in/sign-in",
        clearHistory: false,
        context: {
            context
        },
    };
    page.frame.navigate(navEntryWithContext);
}

exports.navigateToSignUpPage = function (page) {
    const navEntryWithContext = {
        moduleName: "~/auth/sign-up/pro/sign-up-professional-form-page",
        clearHistory: false,
    };
    page.frame.navigate(navEntryWithContext);
}
exports.navigateToSignInPageAsExsistingUser = function (page) {
    const navEntryWithContext = {
        moduleName: "~/auth/sign-up/pro/exsisting-user/sign-up-professional-form-client-page",
        clearHistory: false,

    };
    page.frame.navigate(navEntryWithContext);
}

exports.navigateToSignUpProfessionalLandingPage = function (page) {
    page.frame.navigate("~/auth/sign-up/pro/sign-up-professional-landing-page");
}

exports.navigateToSchedule = function (context, page) {
    const navEntryWithContext = {
        moduleName: "~/dashboard/schedule/schedule",
        clearHistory: false,
        context: {
            placeholder: "placeholder",
        },
    };
    page.frame.navigate(navEntryWithContext);
}

exports.navigateToPage = function (context, page, index, clearHistory){
    return new Promise((resolve, reject) => {
        let destination;
        switch (index) {
            case 1:
                destination = "~/dashboard/modals/content/share-content";
                break;
            default:
                break;
        }
        const navEntryWithContext = {
            moduleName: destination,
            clearHistory: clearHistory,
            context: {
                context
            },
        };  
        try {
            page.frame.navigate(navEntryWithContext);
            resolve()
        } catch (error) {
            reject(error)
        }     
    })
}

exports.navigateToModal = function (context, page, index, fullScreen){ // For modal
    return new Promise((resolve, reject) => {
        let destination;
        switch (index) {
            case 1:
                destination = "~/dashboard/modals/intakeForm/create-intake-form";
                break;
            case 2:
                destination = "~/dashboard/modals/clientTab/full-gallery-view"
                break;
            case 3:
                destination = "~/dashboard/modals/salonPage/bookService/book-service-controller"
                break;
            case 4: 
                destination = "~/dashboard/modals/form/drop-down-list-modal"
                break;
            case 5:
                destination = "~/dashboard/modals/schedule/modals/time-modal"
                break;
            case 6:
                destination = "~/dashboard/modals/clientTab/filter-client-list-modal"
                break;
            case 7:
                destination = "~/dashboard/modals/clientTab/client-profile-modal"
                break;
            case 8:
                destination = "~/dashboard/modals/appointments/view-booking/booking-modal"
                break;
            case 9:
                destination = "~/dashboard/modals/schedule/schedule-limits"
                break;
            case 10:
                destination = "~/dashboard/modals/schedule/set-availability"
                break;
            case 11:
                destination = "~/dashboard/modals/service/add-service/add-service-controller"
                break;
            case 12:
                destination = "~/dashboard/modals/salonPage/salon-page-not-owner-modal"
                break;
            case 13:
                destination = "dashboard/modals/settings/menu"
                break;
            case 14:
                destination = "~/dashboard/modals/learnMore/learn-more-modal"
                break;
            case 15:
                destination = "~/dashboard/modals/settings/settingsMenu/account-details"
                break;
            case 16:
                destination = "~/dashboard/modals/settings/settingsMenu/my-bio"
                break;
            case 17:
                destination = "~/dashboard/modals/colourPicker/colour-picker.xml"
            case 18:
                destination = "~/dashboard/modals/settings/settingsMenu/notification-details"
            case 19:
                destination = "~/dashboard/modals/content/share-content"
        }
        
        const option = {
            context: context,
            closeCallback: (result) => {
                resolve(result)
            },
            fullscreen: fullScreen
        };
        try {
            page.showModal(destination, option);
        } catch (error) {
            console.log(error)
        }
        
    })
}