exports.navigateToPage = function (context, page, index, clearHistory){
    return new Promise((resolve, reject) => {
        let destination;
        switch (index) {
            case 1:
                destination = "~/dashboard/modals/content/share-content";
                break;
            case 2:
                destination = "~/dashboard/dashboard";
                break;
            case 3:
                destination = "~/auth/landing/landing-page";
                break;
            case 4:
                destination = "~/auth/log-in/log-in";
                break;
            case 5:
                destination = "~/auth/sign-up/pro/sign-up-stylist";
                break;
            case 6:
                destination = "~/auth/sign-up/pro/exsisting-user/sign-up-professional-form-client-page";
                break;
            case 7:
                destination = "~/auth/sign-up/pro/sign-up-professional-landing-page";
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
            console.log(page.frame)
            page.frame.navigate(navEntryWithContext);
            resolve()
        } catch (error) {
            console.log(error)
            reject(error)
        }     
    })
}

exports.navigateToModal = function (context, page, index, fullScreen){ // For modal
    return new Promise((resolve, reject) => {
        let destination;
        switch (index) {
            case 1:
                destination = "";
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
                break;
            case 18:
                destination = "~/dashboard/modals/settings/settingsMenu/notification-details"
                break;
            case 19:
                destination = "~/dashboard/modals/content/share-content"
                break;
            case 20:
                destination = "~/dashboard/modals/clientTab/client-gallery-modal"
                break;
            case 21:
                destination = "~/dashboard/modals/settings/settingsMenu/intakeForm/intake-forms-menu"
                break;
            case 22:
                destination = "~/dashboard/modals/settings/settingsMenu/intakeForm/create-intake-form"
                break;
            case 23:
                destination = "~/dashboard/modals/directMessages/holder"
                break;
            case 24:
                destination = "~/dashboard/modals/chooseClient/choose-client"
                break;
            case 25:
                destination = "~/dashboard/modals/settings/settingsMenu/card-details"
                break;
            case 26:
                destination = "~/dashboard/modals/settings/settingsMenu/add-client"
                break;
            case 27:
                destination = "~/dashboard/modals/settings/settingsMenu/import-clients"
                break;
            case 28: 
                destination = "~/dashboard/modals/salonPage/previewService/preview-service-modal"
        }
        
        const option = {
            context: context,
            closeCallback: (result) => {
                resolve(result)
            },
            fullscreen: fullScreen,
            animated: true,
            // Set up a transition property on page navigation.
            transition: {
                name: "slide",
                duration: 380,
                curve: "easeIn"
            }
        };
        try {
            page.showModal(destination, option);
        } catch (error) {
            console.log(error)
        }
        
    })
}