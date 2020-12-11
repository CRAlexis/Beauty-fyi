let closeCallback;

exports.onShownModally = function (args) {
    const context = args.context;
    closeCallback = args.closeCallback;
    const page = args.object;
    page.bindingContext;
}

exports.colorTapped = (args) => {
    closeCallback({backgroundColor: args.object.backgroundColor, colorId: args.object.colorId})
}