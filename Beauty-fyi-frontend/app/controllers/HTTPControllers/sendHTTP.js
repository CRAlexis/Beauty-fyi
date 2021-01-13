const httpModule = require("tns-core-modules/http");
const { Http } = require("@klippa/nativescript-http");
const { httpRequestLoading, httpRequestFinished, dismissAlert } = require("~/controllers/notifications/inApp/notification-alert");
const { SecureStorage } = require("nativescript-secure-storage");
var secureStorage = new SecureStorage();

async function sendHTTP(httpParameters,
    processParameters = {display: false, title: null, message: null},
    successParameters = {display: false, title: null, message: null},
    errorParameters = {display: false, title: null, message: null}) {
    //Make a timer if a requests take too long???
    return new Promise(async (resolve, reject) => {
        console.log("deviceID: " + await secureStorage.get({ key: "deviceID" }),
            "plainKey: " + await secureStorage.get({ key: "plainKey" }),
            "userID: " + await secureStorage.get({ key: "userID" }), )
        try {
            let alertObject;
            if (processParameters.display){
                httpRequestLoading(processParameters.title ? processParameters.title : "Processing...", processParameters.message ? processParameters.message : "Processing your request, please wait.").then((alert) => { alertObject = alert })
            }
            Http.request({
                url: httpParameters.url,
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
                    if (errorParameters.display) {
                        httpRequestFinished(errorParameters.title ? errorParameters.title : "Error", errorParameters.message ? errorParameters.message : "We was unable to process your request. Tap anywhere to exit.").then((alert) => { alertObject = alert })
                    }
                    //console.log(response.headers)
                    //rejectRequest(response.statusCode)
                    console.log(Object.keys(response))
                    console.log(response.statusCode)

                    reject(response)
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
            dismissAlert(alertObject)
            if (errorParameters.display) {
                httpRequestFinished(errorParameters.title ? errorParameters.title : "Error", errorParameters.message ? errorParameters.message : "We was unable to process your request. Tap anywhere to exit.").then((alert) => { alertObject = alert })
            }
            // send to database
            //rejectRequest(error)
            console.log("error 3: " + error)
            reject(e)
        } finally {

        }
    });
}

async function sendHTTPFile(httpParameters,
    processParameters = { display: false, title: null, message: null },
    successParameters = { display: false, title: null, message: null },
    errorParameters = { display: false, title: null, message: null }) {
    var bghttp = require("@nativescript/background-http");
    
    return new Promise(async (resolve, reject) => {
        const session = bghttp.session("video-upload");
        const request = {
            url: httpParameters.url,
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
            {
                name: httpParameters.file.name,
                filename: httpParameters.file.filename,
                mimeType: httpParameters.file.mimeType
            },
            /*{
                name: httpParameters.file2.name,
                filename: httpParameters.file2.filename,
                mimeType: httpParameters.file2.mimeType
            }*/
        ]

        httpParameters.file.forEach(element => {
            params.push({
                name: element.file.name,
                filename: element.file.filename,
                mimeType: element.file.mimeType
            })
        });
        console.log(params)

        try {
            let alertObject;
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
                "JSON": result.data.toJSON(),
                "String": result.data.toString()
            })
        }
        function progressHandler(e) {
        console.log("uploaded " + e.currentBytes + " / " + e.totalBytes);
        }
    });
}

exports.sendHTTP = sendHTTP;
exports.sendHTTPFile = sendHTTPFile;
