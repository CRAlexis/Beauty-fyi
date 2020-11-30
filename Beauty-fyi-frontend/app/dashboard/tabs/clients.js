const clientProfileModal = "~/dashboard/modals/clientTab/client-profile-modal";
const filterClientListModal = "~/dashboard/modals/clientTab/filter-client-list-modal";
var clients = [];
exports.loadClients = async function (page) { // am not able to get page object
    page.bindingContext = source;
    
    clients.push(
        {
            clientImage: "~/temp.png",
            clientName: "Chiedza Kamabarami",
            id: "1"
        },
        {
            clientImage: "~/temp1.png",
            clientName: "Charles Alexis",
            id: "2"
        },
    )
    //format photos when uploading
    var listview = page.getViewById("clientList");
    listview.items = clients;
}

source.set("toggleFilter", async function (args){
    const page = args.object.page;
    var listview = page.getViewById("clientList");
    const mainView = args.object;
    const option = {
        // Gona need to send a http request to JJ to get client information
        context: { listview: listview,
                   clients: clients,            
        },
        closeCallback: () => {
            // Receive data from the modal view. e.g. username & password
            //alert(`Username: ${username} : Password: ${password}`);
        },
        fullscreen: false
    };
    mainView.showModal(filterClientListModal, option);
})

function addMoreItemsFromSource(radListView, chunkSize) {
    //let clientHolder = clients;
    //const newItems = []
    //newItems.push({
    //    clientImage: "~/temp2.png",
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



source.set("viewClientProfile", function (args){
    const mainView = args.object;
    const option = {
        // Gona need to send a http request to JJ to get client information
        context: {  },
        closeCallback: () => {
            // Receive data from the modal view. e.g. username & password
            //alert(`Username: ${username} : Password: ${password}`);
        },
        fullscreen: true
    };
    mainView.showModal(clientProfileModal, option);
});