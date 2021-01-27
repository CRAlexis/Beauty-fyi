const SocialShare = require("nativescript-social-share");
const { loadAnimation } = require("~/controllers/animationController");
const { sendHTTP, getHttpFile } = require("~/controllers/HTTPControllers/sendHTTP");
const navigation = require("~/controllers/navigationController")
const Sqlite = require("nativescript-sqlite");
var clients = [];
let row = 1;
let sendRequests = true


exports.clientPageLoaded = async (args, row = 1) => {
    const page = args.object.page
    page.on('loadClients', () => {
        //readFromDB().then((result) => {
            addToDB()
            this.loadClients(args)

        //}, (e) => {
            console.log("clients already loaded")
        //})

    })
}

exports.loadClients = (args) => {
    const page = args.object.page
    let processesedRequests = 0;
    const listView = page.getViewById("clientList");
    console.log(listView)
    const httpParameters = { url: 'clientsget', method: 'POST', content: { row: row }, }
    if (sendRequests) {
        sendHTTP(httpParameters, { display: false }, { display: false }, { display: false }).then((response) => {
            if (response.JSON.status == "success") {
                const clientsArray = response.JSON.clients
                sendRequests = response.JSON.continueRequests
                console.log("continue?: " + sendRequests)
                clientsArray.forEach(element => {
                    getClientImages(element).then((result) => {

                        if (element.lastName.includes("unknown_")) {
                            clients.push(
                                {
                                    clientImage: result,
                                    clientName: element.firstName,
                                    clientID: element.clientID
                                },
                            )
                        } else {
                            clients.push(
                                {
                                    clientImage: result,
                                    clientName: element.firstName + " " + element.lastName,
                                    clientID: element.clientID
                                },
                            )
                        }
                        listView.items = [];
                        listView.items = clients;
                        processesedRequests++
                        if (processesedRequests == clientsArray.length) {
                            if (sendRequests) {
                                row++
                                listView.notifyAppendItemsOnDemandFinished(0, false);
                                /*console.log("sending next request")
                                try {
                                    this.loadClients(args, row)
                                } catch (error) {
                                    console.log(error)
                                }*/

                            }else{
                                listView.notifyAppendItemsOnDemandFinished(0, true);
                            }
                        }
                    })
                })
            } else {
            }
        }, (e) => {
            console.log(e)
        })
    } else {
        listView.notifyAppendItemsOnDemandFinished(0, true);
    }

}

function getClientImages(client) {
    return new Promise((resolve, reject) => {
        const httpParametersImages = {
            url: 'clientgetimage',
            method: 'POST',
            content: { clientID: client.clientID },
        }
        getHttpFile(httpParametersImages, { display: false }, { display: false }, { display: false }).then((result) => {
            resolve(result ? result._path : false)
        }, (e) => {
            resolve(false)
        })
    })
}

function addToDB() {
    new Sqlite("beauty-fyi.db").then(async db => {
        db.execSQL('DELETE FROM http_requests_made WHERE id=1').then(() => {
            db.execSQL('INSERT into http_requests_made (function, loaded) VALUES (?,?)', ["client function", "1"]).then(id => {
                console.log("Created ID: " + id)
                //readFromDB(db)
            }, error => {
                console.log("INSERT ERROR", error);
            });
        })
    })
}

function readFromDB(db) {
    return new Promise((resolve, reject) => {
        new Sqlite("beauty-fyi.db").then(async db => {
            db.get('SELECT * from http_requests_made where function=?', 'client function').then(row => {
                console.log(row)
                let index = row[2]
                console.log("index: " + index)
                if (index == 0) {
                    resolve()
                } else {
                    reject()
                }
            }, error => {
                console.log("SELECT ERROR", error);
                resolve()
            });
        });
    })

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


exports.viewClientProfile = (args) => {
    const mainView = args.object;
    const clientID = args.object.clientID
    const context = { clientID: clientID}
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

exports.addNewClient = (args) => {
    const mainView = args.object
    const context = ""
    navigation.navigateToModal(context, mainView, 26, true).then((result) => {
        
    })
}