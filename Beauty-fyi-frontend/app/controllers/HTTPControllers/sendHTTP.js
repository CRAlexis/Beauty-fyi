const httpModule = require("tns-core-modules/http");
const { Http } = require("@klippa/nativescript-http");
const { httpRequestLoading, httpRequestFinished, dismissAlert } = require("~/controllers/notifications/inApp/notification-alert");
const { SecureStorage } = require("nativescript-secure-storage");
var secureStorage = new SecureStorage();

async function sendHTTP(httpParameters,
    processParameters = {display: false, title: null, message: null},
    successParameters = {display: false, title: null, message: null},
    errorParameters = {display: false, title: null, message: null}) {
    return new Promise(async (resolve, reject) => {
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
                        userId: await secureStorage.get({ key: "userId" }),
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
                    console.log(errorParameters.display)
                if (true) {
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

function sendHTTPFile(httpParameters) {
    var bghttp = require("@nativescript/background-http");
    return new Promise((resolve, reject) => {
        console.log(httpParameters)
        const session = bghttp.session("file-upload");
        const request = {
            url: httpParameters.url,
            method: httpParameters.method,
            headers: {
                "Content-Type": "application/octet-stream"
            },
            description: "Uploading service image...",
            androidAutoClearNotification: true
        };
        const params = [
            { name: 'content', value: JSON.stringify(httpParameters.content)},
            {
                name: "filepathtestt",
                filename: httpParameters.file,
                mimeType: "image/jpeg"
            }
        ]
        try {
            const task = session.multipartUpload(params, request);
            task.on("error", errorHandler);
            task.on("responded", respondedHandler);
            //task.on("progress", progressHandler);
        } catch (error) {
            // send to database
            console.log('error1:' + error)
            reject(error)
        }
        function errorHandler(e) {
            console.log('error2:' + e)
            console.dir(e)
            reject(e)
        }
        function respondedHandler(result) {
            //const responseString = result.toString();
            //const reponseJSON = result.toJSON()
            resolve(result)
        }
    });
}

exports.sendHTTP = sendHTTP;
exports.sendHTTPFile = sendHTTPFile;
