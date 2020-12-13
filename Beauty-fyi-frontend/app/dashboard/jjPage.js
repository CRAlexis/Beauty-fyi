const Observable = require("tns-core-modules/data/observable").Observable; // This is so you can do '{{ myFunction }}' on the xml page
const source = new Observable();
const sendHTTP = require("~/http/sendHTTP").sendHTTP;


//Everything in here is javascript
exports.onShownModally = function (args) { // This is called when your modal is loaded - you can ignore this for now
    const context = args.context;
    closeCallback = args.closeCallback;
    const page = args.object;
    page.bindingContext = source
}

exports.loaded = async function (args) { //This is called when the page is loaded
    // You can do what you want here
    console.log("Tapped")
}

source.set("goToCamera", function(args){
    // inside args you can get the...
    const object = args.object //element or component that triggered the function
    const page = args.object // The page the element is in
    // When you have the object and the page you can do anything you need bassicaly

})

exports.goToVideo = function(args){
    var mPicker = require("nativescript-mediafilepicker");
    var mediafilepicker = new mPicker.Mediafilepicker();



    let options= {
        android: {
            isCaptureMood: true, // if true then camera will open directly.
            isNeedCamera: true,
            maxNumberFiles: 1,
            isNeedFolderList: true,
            maxDuration: 15,

        },
        ios: {
            isCaptureMood: true, // if true then camera will open directly.
            videoMaximumDuration: 15
        }
    };

    mediafilepicker.openVideoPicker(options);

    mediafilepicker.on("getFiles", function (res) {
        let results = res.object.get('results');

        // file path and url
        var file =  results[0]['file'];
        var url = "http://192.168.1.12:3333/test";
        var name = file.substr(file.lastIndexOf("/") + 1);

        // upload configuration
        var session = bghttp.session("image-upload");
        var request = {
                url: url,
                method: "POST",
                headers: {
                    "Content-Type": "application/octet-stream"
                },
                //description: "Uploading " + name
            };
        try {
            var task = session.uploadFile(file, request);
            task.on("progress", progressHandler);
            task.on("error", errorHandler);
            task.on("responded", respondedHandler);
            console.log(task)
        } catch (error) {
            console.log(error)
        }
    });
}

exports.goToCamera = function(args){
    var mPicker = require("nativescript-mediafilepicker");
    var mediafilepicker = new mPicker.Mediafilepicker();
    var bghttp = require("@nativescript/background-http");

    let options = {
        android: {
            isCaptureMood: true, // if true then camera will open directly.
            isNeedCamera: true,
            maxNumberFiles: 1,
            isNeedFolderList: true
        }, ios: {
            isCaptureMood: true, // if true then camera will open directly.
            isNeedCamera: true,
            maxNumberFiles: 1
        }
    };

    mediafilepicker.openImagePicker(options);

    mediafilepicker.on("getFiles", function (res) {
        let results = res.object.get('results');
        console.dir(results[0]['type']);
        console.dir(results[0]['file']);


        // file path and url
        var file =  results[0]['file'];
        var url = "http://192.168.1.12:3333/test";
        var name = file.substr(file.lastIndexOf("/") + 1);

        // upload configuration
        var session = bghttp.session("image-upload");
        var request = {
                url: url,
                method: "POST",
                headers: {
                    "Content-Type": "application/octet-stream"
                },
                //description: "Uploading " + name
            };
        try {
            var task = session.uploadFile(file, request);
            task.on("progress", progressHandler);
            task.on("error", errorHandler);
            task.on("responded", respondedHandler);
            console.log(task)
        } catch (error) {
            console.log(error)
        }

    });
}

function progressHandler(e) {
    alert("uploaded " + e.currentBytes + " / " + e.totalBytes);
}

function respondedHandler(e) {
    alert("received " + e.responseCode + " code. Server sent: " + e.data);
}


function errorHandler(e) {
    alert("received " + e.response + " code.");
    var serverResponse = e.response;
}
