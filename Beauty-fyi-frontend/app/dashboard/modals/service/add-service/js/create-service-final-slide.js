exports.initialise = (args, sourceForm) =>{
    // Set context for form dropdown { will need to do http request}
    const page = args.object.page;
    sourceForm.set("serviceForm", page.getViewById("serviceForm").text)
    sourceForm.set("serviceOptionalQuestion", page.getViewById("serviceOptionalQuestion").text)
    sourceForm.set("servicePaymentSetting", page.getViewById("servicePaymentSetting").text)
}