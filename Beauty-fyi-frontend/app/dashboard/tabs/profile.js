const navigation = require("~/controllers/navigationController")

source.set("goToProfile", function(args){
    const mainView = args.object;
    const context = "";
    navigation.navigateToModal(context, mainView, 12, true).then(function (result) {
        console.log(result)
    })
})