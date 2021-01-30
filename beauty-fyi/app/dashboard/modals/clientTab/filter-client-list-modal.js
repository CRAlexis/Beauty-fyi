const observableModule = require("tns-core-modules/data/observable");
const Observable = require("tns-core-modules/data/observable").Observable;
const source = new Observable();
let closeCallback;
let context;
source.set('sortByName', false)
exports.onShownModally = function(args) {
    context = args.context;
    closeCallback = args.closeCallback;

    const page = args.object;
    page.bindingContext = source
}

source.set('sortByNameClicked', function(args){
    source.get('sortByName') ? source.set('sortByName', false) : source.set('sortByName', true)
})

source.set('initSorting', function(args){
    if(source.get('sortByName')){
        sortArray(context.clients, 'clientName', false).then(function (result) {
            context.listview.items = [];
            context.listview.items = result;
        })
    }  
    closeCallback();
})

exports.sortByThis = function(args){
    
}


exports.onLoginButtonTap = function(args) {

    
}
