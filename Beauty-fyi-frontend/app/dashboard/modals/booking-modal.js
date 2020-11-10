const observableModule = require("tns-core-modules/data/observable");
let closeCallback;

exports.onShownModally = function(args) {
    const context = args.context;
    closeCallback = args.closeCallback;
    const page = args.object;
    page.bindingContext = observableModule.fromObject(context);
}

exports.onLoginButtonTap = function(args) {
    const page = args.object.page;
    const bindingContext = page.bindingContext;
    const username = bindingContext.get("username");
    const password = bindingContext.get("password");
    closeCallback(username, password);
}

//cancel booking
//message person
//View profile
