const observableModule = require("tns-core-modules/data/observable");

let closeCallback;

exports.onShownModally = function (args) {
    const context = args.context;
    closeCallback = args.closeCallback;
    const page = args.object;
    page.bindingContext = observableModule.fromObject(context);
    loadOptionList(page, page.bindingContext.optionContext, page.bindingContext.id)
}

function loadOptionList(page, context, id){
    var options = [];
    context.forEach(option => {
        options.push(
            {
            id: id,
            optionList: option
            }
        )
    });
    
    //format photos when uploading
    var optionRadList = page.getViewById("optionList");
    optionRadList.items = options;
}

exports.selectedOption = function (args) {
    const option = args.object.text;
    const id = args.object.id
    closeCallback(option, id);
}
