const Sqlite = require("nativescript-sqlite");
configureDatabases()
//const { newAppointment } = require("~/controllers/notifications/outsideApp/localNotificationController")
//newAppointment()
/*const statusBar = require("nativescript-status-bar");
statusBar.hide();*/

function configureDatabases(){
    Sqlite.deleteDatabase("beauty-fyi.db")
    new Sqlite("beauty-fyi.db").then(async db => {
        db.execSQL("CREATE TABLE IF NOT EXISTS http_requests_made (id INTEGER PRIMARY KEY AUTOINCREMENT, function TEXT,  loaded INTEGER DEFAULT 0)").then(id => {
            createDefaultDataHttpRequests(db)
        }, error => {
            console.log("CREATE TABLE ERROR", error);
        });
    }, error => {
        console.log("OPEN DB ERROR", error);
    });
}

function createDefaultDataHttpRequests(db){
    db.execSQL("INSERT INTO http_requests_made (function, loaded) VALUES (?,?)", ["client function", "0"]).then(id => { 
    }, error => {
        console.log("INSERT ERROR", error);
    });
}

function readFromDB(db){
    db.all("SELECT id, function, loaded FROM http_requests_made").then(rows => {
        for (var row in rows) {
            console.log("id: " + rows[row][0], "function: " + rows[row][1], "loaded: " + rows[row][2])
        }
    }, error => {
        console.log("SELECT ERROR", error);
    });
}