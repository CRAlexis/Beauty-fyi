let closeCallback;

exports.onShownModally = function (args) {
    const context = args.context;
    closeCallback = args.closeCallback;
    const page = args.object;
    page.bindingContext;
}

exports.loaded = function(args){
    
}

exports.goBack = (args) => {
    // Would send http request in here to update the information
    closeCallback();
}
