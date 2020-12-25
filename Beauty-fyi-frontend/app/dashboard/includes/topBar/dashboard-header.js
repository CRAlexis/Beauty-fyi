const navigation = require("~/controllers/navigationController");
const animation = require("~/controllers/animationController").loadAnimation;
exports.load = function(args){
    const includeObject = args.object;
    const page = includeObject.page;
    const header = includeObject.header
    

    page.on('refresh', (args) => {
        console.log(args)
        page.getViewById("title").text = args.header;
    })
}

exports.goToSettings = function (args) {
    const mainView = args.object;
    const context = ""

    animation(args.object, "nudge up").then(function () {
        navigation.navigateToModal(context, mainView, 13, true).then(function (result) {
            console.log(result)
        })
    })
}
