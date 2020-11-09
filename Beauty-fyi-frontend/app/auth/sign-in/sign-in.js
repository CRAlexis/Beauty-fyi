const Observable = require("tns-core-modules/data/observable").Observable;
const appSettings = require("tns-core-modules/application-settings");
const httpModule = require("tns-core-modules/http");
const source = new Observable();
source.set("email", "")
source.set("password", "")

function onNavigatingTo(args) {
    const page = args.object;
    page.bindingContext = source;
}

source.set("navigateToSignUpPage", function (args) {
    const button = args.object;
    const page = button.page;
    page.frame.navigate("~/auth/sign-up/sign-up");
});

source.set("signInTapped", function (args) {
    const button = args.object;
    const page = button.page;
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
    console.log("device " + appSettings.getString("deviceID"))
    console.log("key " + appSettings.getString("plainKey"))
    //httpModule.request({
    //    url: "http://192.168.1.12:3333/login",
    //    method: "POST",
    //    headers: { "Content-Type": "application/json" },
    //    content: JSON.stringify({
    //        email: source.get("email"),
    //        password: source.get("password"),
    //        deviceID: appSettings.getString("deviceID"),
    //        plainKey: appSettings.getString("plainKey")
    //    })
    //}).then((response) => {
    //    const str = response.content.toString();
    //    console.log(str)
    //    
    //}, (e) => {
    //    console.log(e)
    //});
});

exports.onNavigatingTo = onNavigatingTo