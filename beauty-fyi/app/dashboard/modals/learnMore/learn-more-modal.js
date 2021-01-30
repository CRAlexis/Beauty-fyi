const Observable = require("tns-core-modules/data/observable").Observable;
source = new Observable();

exports.onShownModally = function (args) {
    const context = args.context;
    closeCallback = args.closeCallback;
    const page = args.object;
    page.bindingContext = source
    if (context.textOne) { source.set("textOne", context.textOne) }
    if (context.textTwo) { source.set("textTwo", context.textTwo) }
    if (context.textThree) { source.set("textThree", context.textThree) }
    if (context.textFour) { source.set("textFour", context.textFour) }
    if (context.textFive) { source.set("textFive", context.textFive) }
    
}
