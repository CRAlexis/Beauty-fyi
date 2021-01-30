let allowLimitCapacity = false
let ticketIsPaid = false
let eventStartTime
let eventEndTime
let eventDate
let eventPrice
let eventCapacity
let ticketType
exports.initSlide = (args) => {
    const page = args.object.page
    let date = new Date()
    page.getViewById("eventDate").minDate = date;
}



exports.eventEndTimeChanged = (args) => {
    const page = args.object.page
    let startTime = page.getViewById("eventStartTime").text
    let endTime = page.getViewById("eventEndTime").text
    if (startTime){
        let startTimeHour = parseInt(startTime.substring(0, 2));
        let startTimeMinutes = parseInt(startTime.substring(3, 5));
        let endTimeHour = parseInt(endTime.substring(0, 2));
        let endTimeMinutes = parseInt(endTime.substring(3, 5));
        if (endTimeHour == startTimeHour){
            if (endTimeMinutes < startTimeMinutes + 10){
                let newTime;
                if (startTimeMinutes > 49){
                    newTime = startTimeHour + 1 + startTimeMinutes - 50;
                }
                page.getViewById("eventEndTime").text = newTime;
                return
            }
        }else{
            if (endTimeHour > startTimeHour){
                console.log("good")
                return
            }else{
                console.log("hour not bigger")
                return
            }
        }
        console.log("Good")
    }
}

exports.validateFourthPageEvents = (args) => {
    return new Promise((resolve, reject) => {
        const page = args.object.page
        eventStartTime = page.getViewById("eventStartTime").text
        eventEndTime = page.getViewById("eventEndTime").text
        eventDate = page.getViewById("eventDate").text
        eventPrice = page.getViewById("eventPrice").text
        eventCapacity = page.getViewById("eventCapacity").text
        if (eventStartTime && eventEndTime && eventDate && ticketIsPaid){
            if (ticketIsPaid == "Paid"){
                if (!eventPrice){
                    reject() 
                    return;
                }
            } 
            if (allowLimitCapacity) {
                if (!eventCapacity) {
                    reject()
                    return;
                }
            }
            resolve()
        }
    })
}

exports.addToBasket = (sourceForm) => {
    sourceForm.set("eventStartTime", eventStartTime)
    sourceForm.set("eventEndTime", eventEndTime)
    sourceForm.set("eventDate", eventDate)
    sourceForm.set("ticketType", ticketType)
    ticketIsPaid == "Paid" ? sourceForm.set("eventPrice", eventPrice) : sourceForm.set("eventPrice", null)
    allowLimitCapacity ? sourceForm.set("eventCapacity", eventCapacity) : sourceForm.set("eventCapacity", null)
}




exports.chooseTicketType = async (args, loadAnimation) => {
    const object = args.object
    const page = object.page
    if (object.text == "Paid"){
        page.getViewById("eventPrice").visibility = "visible"
        await loadAnimation(page.getViewById("eventPrice"), "fade in")   
        ticketIsPaid = "Paid"
        ticketType = "Paid"
    } else if (object.text == "Donation") {
        await loadAnimation(page.getViewById("eventPrice"), "fade out")   
        page.getViewById("eventPrice").visibility = "collapsed"
        ticketIsPaid = "Donation"
        ticketType = "Donation"
    }else{
        await loadAnimation(page.getViewById("eventPrice"), "fade out")
        page.getViewById("eventPrice").visibility = "collapsed"
        ticketIsPaid = "Free"
        ticketType = "Free"
    }
}

exports.limitTotalCapicity = (args, loadAnimation) => {
    const object = args.object
    const page = object.page
    setTimeout(async ()=>{
        if (object.checked){
            page.getViewById("eventCapacity").visibility = "visible"
            await loadAnimation(page.getViewById("eventCapacity"), "fade in")   
            allowLimitCapacity = true
        }else{
            await loadAnimation(page.getViewById("eventCapacity"), "fade out")
            page.getViewById("eventCapacity").visibility = "collapsed"
            allowLimitCapacity = false
        }
    }, 125)
}