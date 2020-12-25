const Observable = require("tns-core-modules/data/observable").Observable;
const slideTransition = require("~/controllers/slide-transitionController");
const navigation = require("~/controllers/navigationController");
const animation = require("~/controllers/animationController").loadAnimation;

exports.onShownModally = function (args) {
    const context = args.context;
    closeCallback = args.closeCallback;
    //console.log(observableModule.fromObject(context))
    //page.bindingContext = observableModule.fromObject(context);
}

exports.onPageLoaded = function (args) {
    setTimeout(function () {
        const page = args.object.page
        const height = (page.getMeasuredWidth() / 4)
        loadImages(page, height)
    },250)
    
}

exports.goBack = (args) => {
    closeCallback();
}

function loadImages(page, height) {
    const SocialShare = require("nativescript-social-share"); // I have hard coded sdk to 21
    const fs = require("tns-core-modules/file-system");
    const imageSourceModule = require("tns-core-modules/image-source").ImageSource; 
    let imageSource = [("~/videos/temp.mp4"), imageSourceModule.fromFileSync("~/images/temp2.png"), imageSourceModule.fromFileSync("~/images/temp2.png")]

    

    const path = '~/videos/temp.mp4';

    const videoFile = fs.File.fromPath(path);
    const documents = fs.knownFolders.documents();
    //var targetFile = documents.getFile('video-copy.mp4');

    const binarySource = videoFile.readSync((err) => {
        console.log(err);
    });
    //targetFile.writeSync(binarySource, (err) => {
    //    console.log(err);
    //});


    /*const documentsFolder = knownFolders.documents();
    const destination = path.join(documentsFolder.path, 'result.mp4 ');
    const file = File.fromPath(destination)
    const blob = (Array).create("byte", file.size);
    for (let i = 0; i < blob.length; i++) {
        blob[i] = (file as any)._buffer[i];
    
    file.write(blob);
    this.pdfUrl = file.path;


    let reader = new FileReader();
    var file = new Blob(
        ["~/videos/temp.mp4"],
        { "type": "video\/mp4" });
        console.log(Object.values(file))
    reader.readAsArrayBuffer(file)
    reader.onload = function (event) {
        //let arrayBuffer = reader.result;
        //console.log(Object.values(arrayBuffer).toString())
        //console.log(event)
        var arrayBuffer = reader.result
        var bytes = new Uint8Array(arrayBuffer);
        console.log(bytes.values())
        SocialShare.shareVideo(bytes.toString())
    };
    reader.onerror = function () {
        console.log(reader.error);
    };
    try {
        
        
    } catch (error) {
        console.log(error) //image path undefined
    }*/
    let images = []
    images.push(
        {
            contentIndex: 1,
            contentImage: "~/images/temp.png",
            height: height + "px",
            isImage: "true"
        },
        {
            contentIndex: 1,
            contentImage: "~/images/temp2.png",
            height: height + "px",
            isImage: "true"
        },
        {
            contentIndex: 1,
            contentImage: "~/images/temp3.png",
            height: height + "px",
            isImage: "true"
        },
        {
            contentIndex: 1,
            contentImage: "~/images/temp4.png",
            height: height + "px",
            isImage: "true"
        },
        {
            contentIndex: 1,
            contentImage: "~/images/temp5.png",
            height: height + "px",
            isImage: "true"
        },
        {
            contentIndex: 1,
            contentImage: "~/images/temp6.png",
            height: height + "px",
            isImage: "true"
        },
    )
    //format photos when uploading
    var listview = page.getViewById("contentGalleryList");
    listview.items = images;
}