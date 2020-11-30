const jjPage = "~/dashboard/jjPage";
exports.goToJJPage = function(args){
    const page = args.object.page;
    const mainView = args.object;
    const option = {
        // Gona need to send a http request to JJ to get client information
        context: {
            
        },
        closeCallback: () => {
            // Receive data from the modal view. e.g. username & password
            //alert(`Username: ${username} : Password: ${password}`);
        },
        fullscreen: true
    };
    mainView.showModal(jjPage, option);
}