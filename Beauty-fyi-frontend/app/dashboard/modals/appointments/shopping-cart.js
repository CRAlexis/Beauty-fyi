const fifthSlide = require("~/dashboard/modals/appointments/fifth-slide.js")
let serviceArray = []
let addonsArray = []
let formArray = [];
let appointmentNotes;
let paymentDetailsArray = [];
let date;
let time;
exports.addToShoppingCart = function (args, slideIndex, serviceDropDownActive, dateSelected, timeSelected, source) {
    const page = args.object.page;
    let isErrorAndString = [false, ""]
    return new Promise((resolve, reject) => {
        try {
            switch (slideIndex) {
                case 1:
                    if(serviceDropDownActive[0]){
                        const addonLength = serviceDropDownActive[0].getChildAt(1).getChildAt(1).getChildAt(2).getChildrenCount();
                        serviceArray.push({
                            storeId: serviceDropDownActive[0].storeId,
                            serviceName: serviceDropDownActive[0].serviceName,
                            duration: serviceDropDownActive[0].duration,
                        })
                        for (i = 0; i < addonLength; i++) {
                            if ((serviceDropDownActive[0].getChildAt(1).getChildAt(1).getChildAt(2).getChildAt(i).storeAddonId != "null") &&
                                (serviceDropDownActive[0].getChildAt(1).getChildAt(1).getChildAt(2).getChildAt(i).checked)) {
                                //addonsArray.push(serviceDropDownActive[0].getChildAt(1).getChildAt(1).getChildAt(2).getChildAt(i).storeAddonId)
                                addonsArray.push({
                                    addonId: serviceDropDownActive[0].getChildAt(1).getChildAt(1).getChildAt(2).getChildAt(i).storeAddonId,
                                    addonName: serviceDropDownActive[0].getChildAt(1).getChildAt(1).getChildAt(2).getChildAt(i).addonName,
                                    
                                })
                            }
                        }
                    }else{
                        isErrorAndString[0] = true
                        isErrorAndString[1] = "Please choose a service"
                    }
                    
                    break;
                case 2:
                    if (timeSelected != null && dateSelected != null){
                        date = dateSelected;
                        time = timeSelected;
                    }else{
                        if (dateSelected == null){
                            isErrorAndString[0] = true
                            isErrorAndString[1] = "Please choose a date."
                        }else{
                            isErrorAndString[0] = true
                            isErrorAndString[1] = "Please choose a time."
                        }                   
                    }
                    break;
                case 3:
                    const formContainer = page.getViewById("bookAppointmentThirdSlideFormContainer")
                    const formLength = formContainer.getChildrenCount();
                    for (i = 0; i < formLength; i++) {
                        if (formContainer.getChildAt(i).formActive == "true"){
                            if (formContainer.getChildAt(i).getChildAt(1).checkBoxInput){
                                formArray.push({
                                    id: formContainer.getChildAt(i).getChildAt(1).formId,
                                    value: formContainer.getChildAt(i).getChildAt(1).checked,
                                    question: formContainer.getChildAt(i).getChildAt(0).text
                                })
                            }else{
                                if (formContainer.getChildAt(i).getChildAt(1).text){
                                    formArray.push({
                                        id: formContainer.getChildAt(i).getChildAt(1).formId,
                                        value: formContainer.getChildAt(i).getChildAt(1).text,
                                        question: formContainer.getChildAt(i).getChildAt(0).text
                                    })
                                }else{
                                    isErrorAndString[0] = true
                                    isErrorAndString[1] = "Please fill in the entire all the form"
                                }    
                            }
                        }
                    }      
                    formArray.push({
                        id: appointmentNotes = page.getViewById("appointmentNotes").id,
                        value: appointmentNotes = page.getViewById("appointmentNotes").text,
                        question: "Appointment notes"
                    })
                    
                    break;
                case 4:
                    const paymentContainer = page.getViewById("bookAppointmentFourthSlidePaymentContainer");
                    const containerLength = paymentContainer.getChildrenCount();
                    
                    console.log("original: " + isErrorAndString)
                    for (i = 0; i < containerLength; i++) { 
                        const validator = paymentFormValidator(paymentContainer.getChildAt(i).text, i)
                        if (!paymentContainer.getChildAt(i).text){
                            isErrorAndString[0] = true
                            isErrorAndString[1] = "Please fill in the entire all the form"
                            break
                        }else if(validator != true){
                            console.log(validator)
                            isErrorAndString[0] = true
                            isErrorAndString[1] = validator
                            break;
                        }else{
                            paymentDetailsArray.push(paymentContainer.getChildAt(i).text)
                        }
                    }
                    if (!isErrorAndString[0]){
                        fifthSlide.setObjectSource(page, source, serviceArray, addonsArray, date, time, formArray, paymentDetailsArray)
                    }
            
                    break;
                case 5:
                break;
            }
            if (isErrorAndString[0]){
                formArray = [];
                inAppNotifiationAlert.errorMessage(isErrorAndString[1])
                reject()
            }else{
                resolve()
            }
        } catch (error) {
            console.log("error: " + error)
            inAppNotifiationAlert.errorMessage("Something went wrong, please try again later.")
            reject()
        } 
    })
}

exports.removeFromShoppingCart = function (args, slideIndex, serviceDropDownActive, dateSelected, timeSelected) {
    const page = args.object.page;
    return new Promise((resolve, reject) => {
        switch (slideIndex) {
            case 1:
                storeId = null
                addonsArray = [];
                break;
            case 2:
                date = null;
                time = null;
                page.getViewById("currentSelectedTimeLabel").color = "black"
                page.getViewById("currentSelectedTimeLabel").id = ""
                page.getViewById("bookAppointmentCalander").clearSelection();
                
                break;
            case 3:
                formArray = []; // May need to call class to ask for questions to be changed?    
                break;
            case 4:
                try {
                    page.getViewById("questionsAndAnswersList").items = []
                } catch (error) {
                    console.log(error)
                }
                paymentDetails = [];
        }
        resolve()
    })
}

function paymentFormValidator(text, index) {
    switch (index) {
        case 0:
            return true
        case 1:
            if (text.length == 16) {
                return true;
            } else {
                return "Card length should be 16 digits"
            }
            break;
        case 2:
            if (text.length == 2) {
                return true;
            } else {
                return "Month length should be 2 digits"
            }
        case 3:
            if (text.length == 4) {
                return true;
            } else {
                return "Year length should be 4 digits"
            }
        case 4:
            if (text.length == 3) {
                return true;
            } else {
                return "CVC length should be 3 digits"
            }
    }
}