const SocialShare = require("nativescript-social-share");
const { loadAnimation } = require("~/controllers/animationController");
const { sendHTTP, getHttpFile } = require("~/controllers/HTTPControllers/sendHTTP");
const navigation = require("~/controllers/navigationController")


var clients = [];
exports.clientPageLoaded = async (args, row = 1) => {
    const page = args.object.page
    let clientQuery = []
    let sendRequests = true
    let processesedRequests = 0;
    var listview = page.getViewById("clientList");
    const httpParameters = { url: 'clientsget', method: 'POST', content: { row: row }, }
    sendHTTP(httpParameters, { display: false }, { display: false }, { display: false }).then((response) => {
        if (response.JSON.status == "success") {
            const clientsArray = response.JSON.clients
            sendRequests = response.JSON.continueRequests
            console.log("continue?: " + sendRequests)
            clientsArray.forEach(element => {
                getClientImages(element).then((result) => {
                    clients.push(
                        {
                            clientImage: result,
                            clientName: element.firstName + " " + element.lastName,
                            id: element.clientID
                        },
                    )
                    listview.items = [];
                    listview.items = clients;
                    processesedRequests++
                    if (processesedRequests == clientsArray.length) {
                        if (sendRequests) {
                            row++
                            console.log("sending next request")
                            try {
                                this.clientPageLoaded(args, row)
                            } catch (error) {
                                console.log(error)
                            }

                        }
                    }
                })
            })
        } else {
        }
    }, (e) => {
        console.log(e)
    })
}

function getClientImages(client) {
    return new Promise((resolve, reject) => {
        const httpParametersImages = {
            url: 'clientgetimage',
            method: 'POST',
            content: { clientID: client.clientID },
        }
        //console.log(client)
        getHttpFile(httpParametersImages, { display: false }, { display: false }, { display: false }).then((result) => {
            resolve(result ? result._path : "defaultServiceImage.png")
        }, (e) => {
            console.log("e" + e)
        })

    })
}

function addToDB() {
    new Sqlite("my.db").then(async db => {
        db.execSQL("INSERT INTO lists (list_name) VALUES (?)", "test text").then(id => {
            console.log("insert---  id: " + id, "list_name " + "test text")
            readFromDB(db)
        }, error => {
            console.log("INSERT ERROR", error);
        });
    })
}

function readFromDB(db) {
    db.all("SELECT id, list_name FROM lists").then(rows => {
        for (var row in rows) {
            console.log("id: " + rows[row][0], "list_name: " + rows[row][1])
        }
    }, error => {
        console.log("SELECT ERROR", error);
    });
}

exports.onPullToRefreshInitiated = (args) => {
    const listView = args.object;
    listView.notifyPullToRefreshFinished();
}

source.set("toggleFilter", async function (args) {
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

source.set("onLoadMoreItemsRequested", function (args) {
    const radListView = args.object;
    args.returnValue = false;
    if (radListView.items.length > 0) {
        if (addMoreItemsFromSource(radListView, 2)) {
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
    //SocialShare.shareUrl("https://www.nativescript.org/", "");
    const mainView = args.object;
    const context = ""
    navigation.navigateToModal(context, mainView, 26, true).then(function (result) {
        if (application.android) { application.android.on(application.AndroidApplication.activityBackPressedEvent, backEvent); }
    })
}