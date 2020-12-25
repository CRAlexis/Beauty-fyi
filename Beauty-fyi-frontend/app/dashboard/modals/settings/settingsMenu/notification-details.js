const Observable = require("tns-core-modules/data/observable").Observable;
const animation = require("~/controllers/animationController").loadAnimation;;
let closeCallback;
const source = new Observable()

exports.onShownModally = function (args) {
    const context = args.context;
    closeCallback = args.closeCallback;
    const page = args.object;
    page.bindingContext;
}

exports.loading = (args) => {
    source.set("bookings", true);
    source.set("reviews", true);
    source.set("marketing", true)
}

exports.goBack = (args) => {
    closeCallback()
}

exports.save = (args) => {
    const object = args.object
    const page = object.page;
    object.text = "saving..."
    const content = JSON.stringify({
        bookings: source.get("bookings"),
        reviews: source.get("reviews"),
        marketing: source.get("marketing")
    })
    const httpParameters = {
        url: 'http://192.168.1.12:3333/login',
        method: 'POST',
        content: content,
    }
    sendHTTP(httpParameters)
        .then((response) => {
            object.text = "saved"
        }, (e) => {
            object.text = "error, try again"
        })
}