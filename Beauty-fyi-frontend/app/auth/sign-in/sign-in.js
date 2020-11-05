const httpModule = require("tns-core-modules/http");
const Observable = require("tns-core-modules/data/observable").Observable;

const source = new Observable();
source.set("username", "")
source.set("email", "")
source.set("password", "")

function onNavigatingTo(args) {
    const page = args.object;
    page.bindingContext = source;
}

source.set("signUpTapped", function (eventData) {
    httpModule.request({
        url: "https://httpbin.org/get",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        content: JSON.stringify({
            username: source.get("username"),
            email: source.get("email"),
            password: source.get("password")
        })
    }).then((response) => {
        // Content property of the response is HttpContent
        // The toString method allows you to get the response body as string.
        const str = response.content.toString();
        // The toJSON method allows you to parse the received content to JSON object
        // var obj = response.content.toJSON();
        // The toImage method allows you to get the response body as ImageSource.
        // var img = response.content.toImage();
    }, (e) => {
        //error
    });
});

exports.onNavigatingTo = onNavigatingTo