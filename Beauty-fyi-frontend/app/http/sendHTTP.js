const httpModule = require("tns-core-modules/http");
function sendHTTP(httpParameters) {
    return new Promise((resolve, reject) => {
        try {
            httpModule.request({
                url: httpParameters.url,
                method: httpParameters.method,
                headers: { "Content-Type": "application/json" },
                content: httpParameters.content,
            }).then((response) => {
                console.log("code: " + response.statusCode)
                if (parseInt(response.statusCode) < 300 ){
                    const responseString = response.content.toString();
                    const reponseJSON = response.content.toJSON()
                    resolveRequest(reponseJSON, responseString)
                }else{
                    console.log("2")
                    rejectRequest(response.statusCode)
                }
            }, (e) => {
                console.log("1")
                // send to database
                rejectRequest(e)
            });
        } catch (error) {
            // send to database
            rejectRequest(error)
        }
        function resolveRequest(reponseJSON, responseString) {
            resolve({"JSON":reponseJSON, "String":responseString})
        }
        function rejectRequest(error) {
            reject(error)
        }
    });
}
function sendHTTPFile(httpParameters) {
    return new Promise((resolve, reject) => {
        try {
            httpModule.request({
                url: httpParameters.url,
                method: httpParameters.method,
                headers: { "Content-Type": "application/json" },
                content: httpParameters.content,
            }).then((response) => {
                console.log("code: " + response.statusCode)
                if (parseInt(response.statusCode) < 300 ){
                    const responseString = response.content.toString();
                    const reponseJSON = response.content.toJSON()
                    resolveRequest(reponseJSON, responseString)
                }else{
                    console.log("2")
                    rejectRequest(response.statusCode)
                }
            }, (e) => {
                console.log("1")
                // send to database
                rejectRequest(e)
            });
        } catch (error) {
            // send to database
            rejectRequest(error)
        }
        function resolveRequest(reponseJSON, responseString) {
            resolve({"JSON":reponseJSON, "String":responseString})
        }
        function rejectRequest(error) {
            reject(error)
        }
    });
}

exports.sendHTTP = sendHTTP ;
exports.sendHTTPFile = sendHTTPFile ;

