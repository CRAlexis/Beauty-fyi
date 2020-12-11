const Observable = require("tns-core-modules/data/observable").Observable;
let closeCallback;

exports.onShownModally = (args) => {
    const context = args.context;
    closeCallback = args.closeCallback;
    const page = args.object;
    page.bindingContext;
}

exports.loaded = (args) => {
    
}
