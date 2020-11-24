const observableModule = require("tns-core-modules/data/observable");
const Observable = require("tns-core-modules/data/observable").Observable;
const dropDownlist = "~/dashboard/modals/form/drop-down-list-modal";
const CheckBox = '@nstudio/nativescript-checkbox';
const source = new Observable();
let serviceDropDownActive = [false, false];
let closeCallback;
let slideIndex = 1;
let shoppingCart = [];
source.set("slideTitle", "Choose appointment")
source.set("nextSlideTitle", "Choose a date")

exports.onShownModally = function (args) {
    const context = args.context;
    closeCallback = args.closeCallback;
    const page = args.object;
    page.bindingContext = source

}

exports.loaded = function (args){
    const page = args.object.page
    let times = []
    times.push(
        {
            time: '13:30'
        },
        {
            time: '14:30'
        },
        {
            time: '15:00'
        },
        {
            time: '16:30'
        },
        {
            time: '17:00'
        },
        {
            time: '18:30'
        },

    )
    //format photos when uploading
    var listview = page.getViewById("bookAppointmentAvaliableTimes");
    listview.items = times;
    
}

exports.exit = function (args) { // What if someone accidently clicks of the modal - Might have to save it to device memory
    closeCallback(username, password);
}

source.set("goToNextSlide", function(args){
    const page = args.object.page
    switch (slideIndex) {
        case 1:
            slideIndex++
            animateToNextSlide(page.getViewById('bookAppointmentFirstSlideContainer'), page.getViewById('bookAppointmentSecondSlideContainer'))
            break;
        case 2:
            slideIndex++
            animateToNextSlide(page.getViewById('bookAppointmentSecondSlideContainer'), page.getViewById('bookAppointmentThirdSlideContainer'))
            break;
        case 3:
            slideIndex++
            animateToNextSlide(page.getViewById('bookAppointmentThirdSlideContainer'), page.getViewById('bookAppointmentFourthSlideContainer'))
            break;
    }
})

source.set("goToPreviousSlide", function (args) {
    const page = args.object.page
    if (serviceDropDownActive[0] != false) {
        const page = args.object.page;
        const object = serviceDropDownActive[0];
        const parent = page.getViewById('bookAppointmentFirstSlideButtonContainer')
        const children = parent.getChildrenCount();
        let indexSelected;
        indexSelected = object.id;
        object.serviceTapped = 'false';
        serviceDropDownActive[0] = false
        animation(object, "reduce section down", { height: '60', duration: 500 }).then(function () {
            object.getChildAt(1).visibility = "collapsed"
        })
        if (children > 1) {
            for (let index = 1; index < children + 1; index++) {
                if (index != indexSelected) {
                    animation(parent.getChildAt(index - 1), "fade in").then(function () {
                        parent.getChildAt(index - 1).visibility = 'visible'
                    })
                }
            }
        }
    }else{
        switch (slideIndex) {
            case 2:
                slideIndex--
                animateToNextSlide(page.getViewById('bookAppointmentSecondSlideContainer'), page.getViewById('bookAppointmentFirstSlideContainer'))
                break;
            case 3:
                slideIndex--
                animateToNextSlide(page.getViewById('bookAppointmentThirdSlideContainer'), page.getViewById('bookAppointmentSecondSlideContainer'))
                break;
            case 4:
                slideIndex--
                animateToNextSlide(page.getViewById('bookAppointmentFourthSlideContainer'), page.getViewById('bookAppointmentThirdSlideContainer'))
                break;
        }
    }
    
})

source.set("serviceTapped", function (args){
    if (!serviceDropDownActive[1]){
       
        serviceDropDownActive[1] = true
        console.log(serviceDropDownActive);
        const page = args.object.page;
        const object = args.object;
        const parent = page.getViewById('bookAppointmentFirstSlideButtonContainer')
        const children = parent.getChildrenCount();
        let indexSelected;
        indexSelected = object.id;
        if (object.serviceTapped != 'false') {
            object.serviceTapped = 'false';
            serviceDropDownActive[0] = false
            animation(object, "reduce section down", { height: '60', duration: 500 }).then(function () {
                object.getChildAt(1).visibility = "collapsed"
            })
            if (children > 1) {
                for (let index = 1; index < children + 1; index++) {
                    if (index != indexSelected) {
                        animation(parent.getChildAt(index - 1), "fade in").then(function () {
                            parent.getChildAt(index - 1).visibility = 'visible'
                        })
                    }
                }
            }
        } else {
            object.serviceTapped = 'true';
            serviceDropDownActive[0] = object;
            if (children > 1) {
                for (let index = 1; index < children + 1; index++) {
                    if (index != indexSelected) {
                        animation(parent.getChildAt(index - 1), "fade out").then(function () {
                            parent.getChildAt(index - 1).visibility = 'collapse'
                        })
                    }
                }
            }
            animation(object, "expand section down", { height: '460', duration: 500 }).then(function () {
                object.getChildAt(1).visibility = "visible"
            })
        }
        setTimeout(function () {
            serviceDropDownActive[1] = false
            console.log("ran")
        }, 1500)
    }
})

source.set("dropDownClicked", function (args){
    const mainView = args.object;
    let optionContext = [];
    optionContext = ['Option 1', 'Option 2', 'Option 3', 'Option 4'];
    const option = {
        // Gona need to send a http request to JJ to get client information
        context: {
            optionContext
        },
        closeCallback: (option) => {
            // Receive data from the modal view. e.g. username & password

            console.log(`${option}`)
            args.object.text = option
        },
        fullscreen: false
    };
    mainView.showModal(dropDownlist, option);
})

async function animateToNextSlide(currentSlide, nextSlide){
    animation(currentSlide, 'fade out').then(function(){
        currentSlide.visibility = 'collapsed';
    }).then(function(){
        nextSlide.visibility = 'visible';
        animation(nextSlide, 'fade in')
    })
    switch (slideIndex) {
        case 1:
            source.set("slideTitle", "Choose appointment")
            source.set("nextSlideTitle", "Choose a date")
            break;
        case 2:
            source.set("slideTitle", "Choose a date")
            source.set("nextSlideTitle", "Form intake")
            break;
        case 3:
            source.set("slideTitle", "Form intake")
            source.set("nextSlideTitle", "Payment")
            break;
        case 4:
            source.set("slideTitle", "Payment")
            source.set("nextSlideTitle", "Preview")
            break;
    }
}
