exports.expandSection = function(args, source){
    const object = args.object
    const page = object.page
    source.get(object.sectionName) ? source.set(object.sectionName, false) : source.set(object.sectionName, true)
}

exports.setObjectSource = function (page, source, serviceArray, addonsArray, date, time, formArray, paymentDetailsArray){
    // Somewhere in here I would need to send a request to jj to get the total price
    source.set("serivceSelected", serviceArray[0].serviceName)
    source.set("addons", addonsArray)
    source.set("dateSelected", date)
    source.set("timeSelected", time)
    source.set("duration", serviceArray[0].duration)
    source.set("questionsAndAnswers", formArray)
    paymentPreviewReceipt = [
        {
            product: "Wash and go",
            value: "£120",
            class: "h4"
        },
        {
            product: "Addon one",
            value: "£30",
            class: "h4"
        },
        {
            product: "Total",
            value: "£150",
            class: "h4 font-bold"
        },
    ]
    source.set("paymentPreviewReceipt", paymentPreviewReceipt)
    source.set("serviceVisibillity", true);
    source.set("formIntakeVisibillity", false);
    source.set("paymentVisibillity", false);
    source.set("paymentPreviewReceiptVisibillity", false);

    source.set("paymentTotal", "£300")
    formatPaymentDetailsForDisplay(source, paymentDetailsArray)
    formatListViewHeight(page, formArray, "questionsAndAnswersList", 120)
    formatListViewHeight(page, paymentPreviewReceipt, "paymentPreviewReceipt", 60)
}

function formatListViewHeight(page, listLength, id, multiplier){
    const height = listLength.length * multiplier;
    page.getViewById(id).height = height;
}

function formatPaymentDetailsForDisplay(source, paymentDetailsArray){
    source.set("cardHolderName", paymentDetailsArray[0])

    paymentDetailsArray[1] = paymentDetailsArray[1].replace(/\s+/g, '');
    paymentDetailsArray[1] = "*" + paymentDetailsArray[1].slice(12, 16);
    source.set("cardNumberRedacted", paymentDetailsArray[1])
}

