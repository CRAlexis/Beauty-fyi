const navigation = require("~/controllers/navigationController")
exports.homeLoaded = function(args){ // am not able to get page object
    const page = args.object.page
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
    const mainView = args.object;
    const context = ""
    navigation.navigateToModal(context, mainView, 8, false).then(function (result) {
        console.log(result)
    })
});

