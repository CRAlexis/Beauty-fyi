const observableModule = require("tns-core-modules/data/observable");

let closeCallback;

exports.onShownModally = function (args) {
    const context = args.context;
    closeCallback = args.closeCallback;
    const page = args.object;
    page.bindingContext = context;
    console.log(context)
}

