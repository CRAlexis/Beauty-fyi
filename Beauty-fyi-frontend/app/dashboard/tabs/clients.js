const SocialShare = require("nativescript-social-share"); 
const navigation = require("~/controllers/navigationController")
var clients = [];
exports.clientPageLoaded = (args) => {
    const page = args.object.page
    clients.push(
        {
            clientImage: "~/images/temp.png",
            clientName: "Chiedza Kamabarami",
            id: "1"
        },
        {
            clientImage: "~/images/temp1.png",
            clientName: "Charles Alexis",
            id: "2"
        },
    )
    //format photos when uploading
    var listview = page.getViewById("clientList");
    listview.items = clients;
}

source.set("toggleFilter", async function (args){
    const mainView = args.object
    navigation.navigateToModal(null, mainView, 6, false).then(function (result) {
        
    })
})

function addMoreItemsFromSource(radListView, chunkSize) {
    //let clientHolder = clients;
    //const newItems = []
    //newItems.push({
    //    clientImage: "~/images/temp2.png",
    //    clientName: "NEw Character",
    //    id: "4"
    //})
    //
//
    //for (let index = 0; index < newItems.length; index++) {
    //    clientHolder.push({
    //        clientImage: newItems[index].clientImage,
    //        clientName: newItems[index].clientName,
    //        id: newItems[index].id
    //    })  
    //}
//
    //radListView.items = []
    //radListView.items = clientHolder;
    return true
}

source.set("onLoadMoreItemsRequested", function (args){
    const radListView = args.object;
    args.returnValue = false;
    if (radListView.items.length > 0) {
        if(addMoreItemsFromSource(radListView, 2)){
            radListView.notifyLoadOnDemandFinished(2);
            args.returnValue = true;
        }         
    } else {
        args.returnValue = false;
        radListView.notifyLoadOnDemandFinished(true);
    }
})

exports.viewClientProfile = (args) => {
    console.log("tapped")
    const mainView = args.object;
    const context = ""
    navigation.navigateToModal(context, mainView, 7, true).then(function (result) {
        console.log(result)
    })
};

exports.inviteClient = (args) => {
    SocialShare.shareUrl("https://www.nativescript.org/", "");
}