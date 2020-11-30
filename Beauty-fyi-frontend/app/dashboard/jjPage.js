const Observable = require("tns-core-modules/data/observable").Observable; // This is so you can do '{{ myFunction }}' on the xml page
const source = new Observable();

//Everything in here is javascript
exports.onShownModally = function (args) { // This is called when your modal is loaded - you can ignore this for now
    const context = args.context;
    closeCallback = args.closeCallback;
    const page = args.object;
    page.bindingContext = source
}

exports.loaded = function (args) { //This is called when the page is loaded
    // You can do what you want here
    console.log("Tapped")
}

source.set("goToCamera", function(args){
    // inside args you can get the...
    const object = args.object //element or component that triggered the function
    const page = args.object // The page the element is in
    // When you have the object and the page you can do anything you need bassicaly

})

exports.goToVideo = function(args){
    const object = args.object
}