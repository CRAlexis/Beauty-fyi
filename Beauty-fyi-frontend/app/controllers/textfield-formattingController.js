exports.currencyFormattingStarted = function (args) {
    const object = args.object;
    let string = object.text
    if (string[0] == "£") {
        string = string.substring(1)
    }
    args.object.text = string
}

exports.currencyFormattingLive = function (args) {
    const object = args.object;
    let string = object.text
    var regex = /^£?\-?([1-9]{1}[0-9]{0,2}(\,\d{3})*(\.\d{0,2})?|[1-9]{1}\d{0,}(\.\d{0,2})?|0(\.\d{0,2})?|(\.\d{1,2}))$|^\-?\$?([1-9]{1}\d{0,2}(\,\d{3})*(\.\d{0,2})?|[1-9]{1}\d{0,}(\.\d{0,2})?|0(\.\d{0,2})?|(\.\d{1,2}))$|^\(\$?([1-9]{1}\d{0,2}(\,\d{3})*(\.\d{0,2})?|[1-9]{1}\d{0,}(\.\d{0,2})?|0(\.\d{0,2})?|(\.\d{1,2}))\)$/;
    if (!regex.test(string)) { string = object.resetText }

    object.text = string
    object.resetText = string;
}
exports.currencyFormattingFinished = function (args) {
    const object = args.object;
    let string = object.text
    if (string[0] != "£") {
        string = "£" + string
    }
    args.object.text = string
}