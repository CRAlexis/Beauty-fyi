const httpModule = require("tns-core-modules/http");
const { Http } = require("@klippa/nativescript-http");
const { httpRequestLoading, httpRequestFinished, dismissAlert } = require("~/controllers/notifications/inApp/notification-alert");
const { SecureStorage } = require("nativescript-secure-storage");
var secureStorage = new SecureStorage();
let alertObject;
async function sendHTTP(httpParameters,
    processParameters = { display: false, title: null, message: null },
    successParameters = { display: false, title: null, message: null },
    errorParameters = { display: false, title: null, message: null }) {
    dismissAlert(alertObject)
    //Make a timer if a requests take too long???
    return new Promise(async (resolve, reject) => {
        console.log("deviceID: " + await secureStorage.get({ key: "deviceID" }),
            "plainKey: " + await secureStorage.get({ key: "plainKey" }),
            "userID: " + await secureStorage.get({ key: "userID" }))
        try {
            if (processParameters.display) {
                httpRequestLoading(processParameters.title ? processParameters.title : "Processing...", processParameters.message ? processParameters.message : "Processing your request, please wait.").then((alert) => { alertObject = alert })
            }
            Http.request({
                url: "http://192.168.1.208:3333/" + httpParameters.url,
                method: httpParameters.method,
                headers: {
                    "Content-Type": "application/json"
                },
                content: JSON.stringify({
                    content: httpParameters.content,
                    auth: {
                        deviceID: await secureStorage.get({ key: "deviceID" }),
                        plainKey: await secureStorage.get({ key: "plainKey" }),
                        userID: await secureStorage.get({ key: "userID" }),
                    }
                })
            }).then((response) => {
                dismissAlert(alertObject)
                if (parseInt(response.statusCode) < 300) {
                    if (successParameters.display) {
                        httpRequestFinished(successParameters.title ? successParameters.title : "Success", successParameters.message ? successParameters.message : "Your request was processed successfully").then((alert) => { alertObject = alert })
                    }
                    const responseString = response.content.toString();
                    const reponseJSON = response.content.toJSON()
                    //resolveRequest(reponseJSON, responseString)
                    console.log('successful request')
                    resolve({
                        "JSON": reponseJSON,
                        "String": responseString
                    })
                } else {
                    console.log(response)
                    reject("error")
                }
            }, (e) => {

                dismissAlert(alertObject)
                if (errorParameters.display) {
                    httpRequestFinished(errorParameters.title ? errorParameters.title : "Error", errorParameters.message ? errorParameters.message : "We was unable to process your request. Tap anywhere to exit.").then((alert) => { alertObject = alert })
                }
                // send to database
                //rejectRequest(e)
                console.log("error: " + e)
                reject(e)

            })
        } catch (error) {
            console.log(3)
            dismissAlert(alertObject)
            if (errorParameters.display) {
                httpRequestFinished(errorParameters.title ? errorParameters.title : "Error", errorParameters.message ? errorParameters.message : "We was unable to process your request. Tap anywhere to exit.").then((alert) => { alertObject = alert })
            }
            // send to database
            //rejectRequest(error)
            console.log("error 3: " + error)
            reject(error)
        } finally {

        }
    });
}

async function sendHTTPFile(httpParameters,
    processParameters = { display: false, title: null, message: null },
    successParameters = { display: false, title: null, message: null },
    errorParameters = { display: false, title: null, message: null }) {
    dismissAlert(alertObject)
    var bghttp = require("@nativescript/background-http");

    return new Promise(async (resolve, reject) => {
        console.log("inside http file")
        const session = bghttp.session("video-upload");
        const request = {
            url: "http://192.168.1.208:3333/" + httpParameters.url,
            method: httpParameters.method,
            headers: {
                "Content-Type": "application/octet-stream"
            },
            description: httpParameters.description,
            androidAutoClearNotification: true
        };

        let params = [
            {
                name: 'content',
                value: JSON.stringify(httpParameters.content)
            },
            {
                name: 'auth',
                value: JSON.stringify({
                    deviceID: await secureStorage.get({ key: "deviceID" }),
                    plainKey: await secureStorage.get({ key: "plainKey" }),
                    userID: await secureStorage.get({ key: "userID" }),
                })
            },
            /*{
                name: httpParameters.file2.name,
                filename: httpParameters.file2.filename,
                mimeType: httpParameters.file2.mimeType
            }*/
        ]

        httpParameters.file.forEach(element => {
            params.push({
                name: element.name,
                filename: element.filename,
                mimeType: element.mimeType
            })
        });
        console.log(params)

        try {
            if (processParameters.display) {
                httpRequestLoading(processParameters.title ? processParameters.title : "Processing...", processParameters.message ? processParameters.message : "Processing your request, please wait.").then((alert) => { alertObject = alert })
            }
            const task = session.multipartUpload(params, request);
            task.on("error", errorHandler);
            task.on("responded", respondedHandler);
            task.on("progress", progressHandler);
        } catch (error) {
            if (errorParameters.display) {
                httpRequestFinished(errorParameters.title ? errorParameters.title : "Error", errorParameters.message ? errorParameters.message : "We was unable to process your request. Tap anywhere to exit.").then((alert) => { alertObject = alert })
            }
            reject(error)
        }


        function errorHandler(e) {
            if (errorParameters.display) {
                httpRequestFinished(errorParameters.title ? errorParameters.title : "Error", errorParameters.message ? errorParameters.message : "We was unable to process your request. Tap anywhere to exit.").then((alert) => { alertObject = alert })
            }
            console.dir(e)
            console.log('error2:' + e)
            reject(e)
        }
        function respondedHandler(result) {
            if (successParameters.display) {
                httpRequestFinished(successParameters.title ? successParameters.title : "Success", successParameters.message ? successParameters.message : "Your request was processed successfully").then((alert) => { alertObject = alert })
            }
            console.log(result.data)
            resolve({
                // /"JSON": result.data.toJSON(),
                //"String": result.data.toString()
            })
        }
        function progressHandler(e) {
            console.log("uploaded " + e.currentBytes + " / " + e.totalBytes);
        }
    });
}

async function getHttpFile(httpParameters,
    processParameters = { display: false, title: null, message: null },
    successParameters = { display: false, title: null, message: null },
    errorParameters = { display: false, title: null, message: null }) {
    dismissAlert(alertObject)
    //Make a timer if a requests take too long???
    return new Promise(async (resolve, reject) => {
        console.log("deviceID: " + await secureStorage.get({ key: "deviceID" }),
            "plainKey: " + await secureStorage.get({ key: "plainKey" }),
            "userID: " + await secureStorage.get({ key: "userID" }))
        try {
            if (processParameters.display) {
                httpRequestLoading(processParameters.title ? processParameters.title : "Processing...", processParameters.message ? processParameters.message : "Processing your request, please wait.").then((alert) => { alertObject = alert })
            }
            Http.getFile({
                url: "http://192.168.1.208:3333/" + httpParameters.url,
                method: httpParameters.method,
                headers: {
                    "Content-Type": "application/json"
                },
                content: JSON.stringify({
                    content: httpParameters.content,
                    auth: {
                        deviceID: await secureStorage.get({ key: "deviceID" }),
                        plainKey: await secureStorage.get({ key: "plainKey" }),
                        userID: await secureStorage.get({ key: "userID" }),
                    }
                })
            }).then((response) => {
                dismissAlert(alertObject)
                if (successParameters.display) {
                    httpRequestFinished(successParameters.title ? successParameters.title : "Success", successParameters.message ? successParameters.message : "Your request was processed successfully").then((alert) => { alertObject = alert })
                }
                resolve(response)
            })
        } catch (error) {
            dismissAlert(alertObject)
            if (errorParameters.display) {
                httpRequestFinished(errorParameters.title ? errorParameters.title : "Error", errorParameters.message ? errorParameters.message : "We was unable to process your request. Tap anywhere to exit.").then((alert) => { alertObject = alert })
            }
            console.log("error 3: " + error)
            reject(e)
        }
    });
}


exports.sendHTTP = sendHTTP;
exports.sendHTTPFile = sendHTTPFile;
exports.getHttpFile = getHttpFile;

