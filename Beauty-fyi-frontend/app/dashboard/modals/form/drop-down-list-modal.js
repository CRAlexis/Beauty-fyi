const observableModule = require("tns-core-modules/data/observable");

let closeCallback;

exports.onShownModally = function (args) {
    const context = args.context.context;
    const page = args.object;
    if (args.context.meta){
        const meta = args.context.meta;
        loadOptionListWithMeta(page, context, meta)
    }else {
        loadOptionList(page, context)
    }
    closeCallback = args.closeCallback;
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

function loadOptionListWithMeta(page, context, meta) {
    var options = [];
    let index = 0
    context.forEach(option => {
        options.push(
            {
                optionList: option,
                meta: meta[index]
            }
        )
        index++
    });
    //format photos when uploading
    var optionRadList = page.getViewById("optionList");
    optionRadList.items = options;
}

exports.selectedOption = function (args) {
    const text = args.object.text;
    const meta = args.object.meta
    closeCallback({text: text, meta: meta? meta : null});
}
