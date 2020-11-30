const salonPageModal = "~/dashboard/modals/salonPage/salon-page-not-owner-modal";

source.set("goToProfile", function(args){
    const mainView = args.object;
    const option = {
        // Gona need to send a http request to JJ to get client information
        context: {},
        closeCallback: () => {
            // Receive data from the modal view. e.g. username & password
            //alert(`Username: ${username} : Password: ${password}`);
        },
        fullscreen: true
    };
    mainView.showModal(salonPageModal, option);
})