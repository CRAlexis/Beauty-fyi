exports.getData  = (args, sourceForm) =>{
    // Set context for form dropdown { will need to do http request}
    const page = args.object.page;
    sourceForm.set("serviceForm", page.getViewById("serviceForm").formID)
    sourceForm.set("serviceOptionalQuestion", page.getViewById("serviceOptionalQuestion").text)
    sourceForm.set("servicePaymentSetting", page.getViewById("servicePaymentSetting").text)
}

exports.createFormOptions = (args, sendHTTP) => {
    const page = args.object.page
    const httpParameters = { url: 'formsget', method: 'POST', content: {}, }
    sendHTTP(httpParameters, { display: false }, { display: false }, { display: false })
        .then((response) => {
            if (response.JSON.status == "success") {
                let index = 0;
                let optionString = "";
                let optionMetaString = "";
                formData = response.JSON.serviceForms
                console.log(formData)
                formData.forEach(element => {
                    optionString += element.form_name + ","
                    optionMetaString += element.id + ",";
                })
                optionString += "Add new form";
                optionMetaString += "null"
                page.getViewById("serviceForm").optionContext = optionString
                page.getViewById("serviceForm").optionContextMeta = optionMetaString
            } else {
                page.getViewById("serviceForm").optionContext = ""
            }
        }, (e) => {
            console.log(e)
        })
}