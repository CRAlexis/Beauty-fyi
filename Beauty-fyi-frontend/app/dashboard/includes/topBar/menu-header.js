const { goBack } = require("@nativescript/core/ui/frame/frame-common");

exports.load = function(args){
    const includeObject = args.object;
    const page = includeObject.page;
    const header = includeObject.header
    page.getViewById("title").text = header;
}
