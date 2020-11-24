const Observable = require("tns-core-modules/data/observable").Observable;
const fullGalleryView = "~/dashboard/modals/clientTab/full-gallery-view";
const source = new Observable();

var images = [];
exports.onShownModally = function (args) {
    const context = args.context;
    closeCallback = args.closeCallback;
    //console.log(observableModule.fromObject(context))
    //page.bindingContext = observableModule.fromObject(context);
    
    
}


exports.onPageLoaded = function (args){
    const page = args.object.page; //edited
    page.bindingContext = source
    setTimeout(function () {
        source.set("height", (page.getMeasuredWidth() / 3))
        loadImages(page)
    }, 500)
}

function loadImages(page) { // am not able to get page object
    images.push(
        {
            image: "~/temp.png",
            height: source.get("height") + "px",
            index: 1,
            date: "19th November 2020"
        },
        {
            image: "~/temp5.png",
            height: source.get("height") + "px",
            index: 2,
            date: "20th November 2020"
        },
        {
            image: "~/temp1.png",
            height: source.get("height") + "px",
            index: 3,
            date: "21th November 2020"
        },
    )
    //format photos when uploading
    var listview = page.getViewById("clientGalleryList");
    listview.items = images;
}

source.set("imageTapped", function(args){
    const mainView = args.object;
    const imageUrl = args.object.src
    const imageIndex = args.object.id;
    console.log("imageIndex: " + imageIndex);
    const option = {
        // Gona need to send a http request to JJ to get client information
        context: {
            imageUrls: images,
            imageIndex: imageIndex,
            imageUrl: imageUrl
        },
        closeCallback: () => {
            // Receive data from the modal view. e.g. username & password
            //alert(`Username: ${username} : Password: ${password}`);
        },
        fullscreen: true
    };
    mainView.showModal(fullGalleryView, option);
})

source.set("navigateBack", function (args) {
    closeCallback();
});

source.set("longPressImage", function (args){
    args.object.borderBottomWidth = index
    args.object.borderColor = '#dca7ff'
})