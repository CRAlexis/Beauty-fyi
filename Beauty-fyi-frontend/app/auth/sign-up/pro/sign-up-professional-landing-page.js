const Observable = require("tns-core-modules/data/observable").Observable;
const navigation = require("~/navigation/navigation")
const source = new Observable()

exports.onNavigatingTo = function onNavigatingTo(args) {
    const page = args.object;
    page.bindingContext = source;
}

source.set("navigateBack", function (args) {
    const page = args.object.page
    page.frame.goBack();
});

source.set("signUpAsProfessional", function (args) { // dont have an account
    const button = args.object;
    const page = button.page;
    navigation.navigateToSignUpPage(page)
});

source.set("clientRegisterAsPro", function (args) { // already have an accuont
    const button = args.object;
    const page = button.page;
    navigation.navigateToSignInPageAsExsistingUser(page)
});
//clients need to be able to upgrade to professional and have two account bassicaly
// in user database instead of having a role column -> |name | email | client (bool) | proffesional (bool) | etc
