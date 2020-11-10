const bookingModal = "~/dashboard/modals/booking-modal";
exports.loadNotifications = function(page){ // am not able to get page object
    page.bindingContext = source;
    const notifications = [];
    notifications.push(
        {
            clientImage: "~/temp.png",
            clientName: "Tiffany",
            service: "Washing hair and style",
            time: "2 hours",
            id: "1"
        },
        {
            clientImage: "res://logo",
            clientName: "Phoebe",
            service: "Styling and treatment",
            time: "4 hours",
            id: "2"
        },
        {
            clientImage: "res://logo",
            clientName: "Amie",
            service: "Massage",
            time: "10 hours",
            id: "3"
        },
    )

    var listview = page.getViewById("bookingList");
    listview.items = notifications;
}

source.set("ontest", function (args){
    console.log(args.object.id);
    const mainView = args.object;
    const option = {
        context: { username: "test_username", password: "test" },
        closeCallback: (username, password) => {
            // Receive data from the modal view. e.g. username & password
            //alert(`Username: ${username} : Password: ${password}`);
        },
        fullscreen: false
    };
    mainView.showModal(bookingModal, option);
});