const httpModule = require("tns-core-modules/http");

function sendHTTP(httpParameters) {
    return new Promise((resolve, reject) => {
        try {
            httpModule.request({
                url: httpParameters.url,
                method: httpParameters.method,
                headers: {
                    "Content-Type": "application/json"
                },
                //content: httpParameters.content,
            }).then((response) => {
                if (parseInt(response.statusCode) < 300) {
                    const responseString = response.content.toString();
                    const reponseJSON = response.content.toJSON()
                    //resolveRequest(reponseJSON, responseString)
                    console.log('successful request')
                    resolve({
                        "JSON": reponseJSON,
                        "String": responseString
                    })
                } else {
                    console.log(response.headers)
                    //rejectRequest(response.statusCode)
                    console.log(Object.keys(response))
                    reject(response)
                }
            }, (e) => {
                // send to database
                //rejectRequest(e)
                reject(e)
            });
        } catch (error) {
            // send to database
            //rejectRequest(error)
            console.log(error)
            reject(e)
        }

        function resolveRequest(reponseJSON, responseString) {

        }

        function rejectRequest(error) {

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
            resolve(e)
        }
    });
}

exports.sendHTTP = sendHTTP;
exports.sendHTTPFile = sendHTTPFile;
