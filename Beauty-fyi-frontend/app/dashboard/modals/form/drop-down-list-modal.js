const observableModule = require("tns-core-modules/data/observable");

let closeCallback;

exports.onShownModally = function (args) {
    const context = args.context;
    closeCallback = args.closeCallback;
    const page = args.object;
    page.bindingContext = context;
    console.log(context)
    loadOptionList(page, context)
}

function loadOptionList(page, context){
    var options = [];
    context.forEach(option => {
        options.push(
            {
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
    closeCallback(option);
}
