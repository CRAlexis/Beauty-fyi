const Observable = require("tns-core-modules/data/observable").Observable;
const slideTransition = require("~/controllers/slide-transitionController");
const navigation = require("~/controllers/navigationController");
const animation = require("~/controllers/animationController").loadAnimation;
const application = require('application');
let shareArray = []
let currentContentData = []
// Probably send http requests for videos as soon as this page loads


exports.onShownModally = function (args) {
    const context = args.context;
    closeCallback = args.closeCallback;
    //console.log(observableModule.fromObject(context))
    //page.bindingContext = observableModule.fromObject(context);
    //const { Video } = require('nativescript-videoplayer');
//
    //const video = args.object.page.getViewById('nativeVideoPlayer')
    //console.log(video)
    //// Setting event listeners on the Video
    //video.on(Video.pausedEvent, () => {
    //    console.log('Video has been paused.');
    //});
//
    //video.on(Video.mutedEvent, () => {
    //    console.log('Video has been muted.');
    //});
}

exports.onPageLoaded = function (args) {
    if (application.android) {
        application.android.on(application.AndroidApplication.activityBackPressedEvent, backEvent);
    } 
    setTimeout(function () {
        const page = args.object.page
        const height = (page.getMeasuredWidth() / 4)
        loadImages(page, height)
    },250)
    shareArray = []
}

exports.goBack = (args) => {
    backEvent(args)
}

function backEvent(args) {
    args.cancel = true;
    if (application.android) {
        application.android.off(application.AndroidApplication.activityBackPressedEvent, backEvent);
    } 
    closeCallback();
}

async function loadImages(page, height) {
    const SocialShare = require("nativescript-social-share"); // I have hard coded sdk to 21
    const imageSourceModule = require("tns-core-modules/image-source").ImageSource; 
    const httpModule = require("tns-core-modules/http");
    const fileSystemModule = require("tns-core-modules/file-system");
    //const filePath = fileSystemModule.path.join(fileSystemModule.knownFolders.currentApp().path, "test.png");
    //await httpModule.getFile("https://www.gravatar.com/avatar/3e3383b665786b15645c04f876d3c059?s=328&d=identicon&r=PG", filePath).then((resultFile) => {        
    //}, (e) => {
    //    //console.log(e)
    //});
    let images = []
    images.push(
        {
            contentImage: "~/images/temp.png",
            contentId: "contentImage0",
            height: height + "px",
            isImage: true
        },
        {
            contentImage: "~/images/temp2.png",
            contentId: "contentImage1",
            height: height + "px",
            isImage: true
        },
        {
            contentImage: "~/images/temp3.png",
            contentId: "contentImage2",
            height: height + "px",
            isImage: true
        },
        {
            contentImage: "~/images/temp4.png",
            contentId: "contentImage3",
            height: height + "px",
            isImage: true
        },
        {
            contentImage: "~/images/temp7.png",
            contentId: "contentImage4",
            height: height + "px",
            isImage: true
        },
        {
            contentImage: "~/images/temp8.png",
            contentSource: "~/videos/temp.mp4",
            contentId: "contentImage5",
            height: height + "px",
            isImage: false
        },
        {
            contentImage: "~/images/temp9.png",
            
            contentId: "contentImage6",
            height: height + "px",
            isImage: true
        },
        {
            contentImage: "~/images/temp10.png",
            contentId: "contentImage7",
            height: height + "px",
            isImage: true
        },
    )
    currentContentData = ["contentImage0", "~/images/temp.png"]
    //format photos when uploading
    var listview = page.getViewById("contentGalleryList");
    listview.items = images;
}

exports.viewContent = async (args) => {
    const object = args.object
    const page = object.page
    const imageId = object.id;
    const src = object.getChildAt(0).src;
    const videoSrc = object.getChildAt(0).contentSource;
    const isImage = object.getChildAt(0).isImage;
    const videoPlayer = page.getViewById("nativeVideoPlayer")
    const slides = [page.getViewById("photoContainer"), page.getViewById("videoContainer")]
    if (shareArray.includes(src)){
        page.getViewById("addButton").text = "Remove"
    }else{
        page.getViewById("addButton").text = "Add"
    }
    if (isImage) { //Check if image or video
        console.log(1)
        page.getViewById("mainImage").src = src; // Load content into container
        slideTransition.goToCustomSlide(args, 1, 0, null, slides)
        currentContentData = [imageId, src]
        videoPlayer.pause()
        videoPlayer.src = ""
    }else{
        console.log(2)
        videoPlayer.src = videoSrc // Load content into container
        slideTransition.goToCustomSlide(args, 0, 1, null, slides)
        currentContentData = [imageId, videoSrc]
    }   
}

exports.addContent = (args) => {
    const page = args.object.page
    const id = currentContentData[0]
    const src = currentContentData[1]
    const imageContainer = page.getViewById(id)
    if (page.getViewById("addButton").text == "Add"){
        imageContainer.opacity = 0.6
        shareArray.push(src)
        page.getViewById("addButton").text = "Remove"
    }else{
        imageContainer.opacity = 1
        let i = 0;
        shareArray.forEach(element => {
            if (element == src) {
                shareArray.splice(i, 1)
            }
            i++
        });
        page.getViewById("addButton").text = "Add"
    }
    page.getViewById("shareButton").text = "Share (" + shareArray.length + ")"
}

exports.longPressedImage = (args) => {
    console.log(args.object.id)
    const page = args.object.page
    let src = args.object.getChildAt(0).src
    let id = args.object.getChildAt(0).id
    if (args.object.opacity == 1){
        args.object.opacity = 0.6
        shareArray.push(src)
    }else{
        args.object.opacity = 1
        let i = 0;
        shareArray.forEach(element => {
            if (element == src){
                shareArray.splice(i, 1)
            }
            i++
        });
    }
    page.getViewById("shareButton").text = "Share (" + shareArray.length + ")"
}

exports.closeFullScreenImage = (args) => {
    closeFullScreenImage(args)
    
}

async function closeFullScreenImage(args){
    args.cancel = true;
    const page = args.object.page
    await animation(page.getViewById("fullScreenImage"), "fade out")
    page.getViewById("fullScreenImage").visibility = 'collapsed'
    if (application.android) {
        application.android.off(application.AndroidApplication.activityBackPressedEvent, closeFullScreenImage);
        application.android.on(application.AndroidApplication.activityBackPressedEvent, backEvent);
    } 
}

exports.shareContent = (args) => {
    var imageSourceModule = require("image-source");
    var image = imageSourceModule.fromFile("~/images/temp.png");
    let path = ["https://www.gravatar.com/avatar/3e3383b665786b15645c04f876d3c059?s=328&d=identicon&r=PG"]
    const SocialShare = require("nativescript-social-share");
    SocialShare.shareInit([image], path, "testing")
}



// changing the src
//video.src = 'some video file or url';

// set loop
//video.loop = false;